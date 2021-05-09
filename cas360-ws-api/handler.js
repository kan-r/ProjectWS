'use strict';

const aws = require('aws-sdk');
// const https = require('https');
const axios = require('axios');
const dynamo = new aws.DynamoDB.DocumentClient();
const ssm = new aws.SSM();

const WS_CONNECTIONS_TABLE = process.env.WS_CONNECTIONS_TABLE;
const WS_AUTH_ENDPOINT = process.env.WS_AUTH_ENDPOINT;

const ws = new aws.ApiGatewayManagementApi({
    endpoint: process.env.WS_ENDPOINT
});


exports.connect = async (event) => {
  console.log('CONNECT: ' + JSON.stringify(event))

  const connectionId = event.requestContext.connectionId;
  const requestId = event.requestContext.requestId;
  const requestTime = event.requestContext.requestTime;
  const clientId = event.queryStringParameters.clientId;
  
  console.log('connectionId ' + connectionId  + ' clientId ' + clientId)

  const params = {
    TableName: WS_CONNECTIONS_TABLE,
    Item: {
      connectionId: connectionId,
      clientId: clientId,
      requestId: requestId,
      requestTime: requestTime,
    //   1 hr
      ttl: parseInt((Date.now() / 1000) + 3600)
    }
  };

  await dynamo.put(params).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Connecteed'
  };
}


exports.disconnect = async (event) => {
  console.log('DISCONNECT: ' + JSON.stringify(event))

  const connectionId = event.requestContext.connectionId
  
  const params = {
    TableName: WS_CONNECTIONS_TABLE,
    Key: {
      connectionId: connectionId
    }
  };

  await dynamo.delete(params).promise();

   return {
    statusCode: 200,
    body: 'Disconnected'
  };
}


exports.default = async (event) => {
  console.log('DEFAULT: ' + JSON.stringify(event));

  return {
    statusCode: 200,
    body: 'Routed to $default'
  };
}


exports.notify = async (event) => {
    console.log('NOTIFY: ' + JSON.stringify(event));
  
    const clientId = event.pathParameters.Id;
    const body = event.body
    
    try {
        const connections = await getAllConnections(clientId);
        console.log('connections: ', connections);
        await Promise.all(
          connections.map(connectionId => postToConnection(connectionId, body))
        );

        return response200({ message: 'notified' });
    } catch (error) {
        console.log('ERROR: ', error);
        return response400({ message: 'could not be notified' });
    }
}


exports.authorize = async (event) => {
    console.log('AUTHORIZE: ' + JSON.stringify(event));

    const { clientId, clientName } = event.queryStringParameters;
    const { methodArn } = event;
    const { Origin } = event.headers;

    let effect = 'Deny';
  
    const resp = await isAuthorized(clientId, clientName, Origin);
    if(resp){
        effect = 'Allow';
    }
  
    return {
      "principalId": "user",
      "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "execute-api:Invoke",
            "Effect": effect,
            "Resource": methodArn
          }
        ]
      }
    };
}


const isAuthorized = async (clientId, clientName, ipAddress) => {
    console.log('isAuthorized');

    const authEndpoint = WS_AUTH_ENDPOINT;
    let authToken = 'cas360';

    authToken = await getSystemParameter('/cas360/ws-auth');

    const data = {
        'clientId': clientId,
        'clientName': clientName,
        'ipAddress': ipAddress
    }

    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        }
    }

    try {
        const resp = await axios.post(authEndpoint, data, options);
        console.log('Resp: ', resp);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getSystemParameter = async (paramName) => {
    const params = {
        Name: paramName,
        WithDecryption: false
    };

    try {
        const resp = await ssm.getParameter(params).promise();
        console.log('paramValue: ', resp);
        return resp.Parameter.Value;
    } catch (error) {
        console.error(error);
        return '';
    }
    
}


const getAllConnections = async (clientId, ExclusiveStartKey) => {

    const params = {
        TableName: WS_CONNECTIONS_TABLE,
        FilterExpression: 'clientId = :clientId',
        ExpressionAttributeValues: {
            ':clientId': clientId
        },
        ExclusiveStartKey
    };

    const { Items, LastEvaluatedKey } = await dynamo.scan(params).promise();
  
    const connections = Items.map(({ connectionId }) => connectionId);
    if(LastEvaluatedKey) {
      connections.push(...await getAllConnections(clientId, LastEvaluatedKey));
    }
  
    return connections;
}


const postToConnection = async (connectionId, data) => {

    const params = {
        ConnectionId: connectionId,
        Data: data
    };

    try {
        await ws.postToConnection(params).promise();
    } catch (error) {
        // Ignore if connection no longer exists
        if(error.statusCode !== 400 && error.statusCode !== 410){
            throw error;
        }
    }
}


const response200 = (data = {}) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(data),
    }
}

const response400 = (data = {}) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: 400,
        body: JSON.stringify(data),
    }
}
