'use strict';

const aws = require('aws-sdk')

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

const dynamo = new aws.DynamoDB.DocumentClient(options);

const WS_CONNECTIONS_TABLE = process.env.WS_CONNECTIONS_TABLE;

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
      requestTime: requestTime
    }
  };

  await dynamo.put(params).promise()

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

  await dynamo.delete(params).promise()

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
    console.log('NOTIFY: ' + JSON.stringify(event))
  
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


// to be changed
exports.authorize = async (event) => {
    let authToken = event.queryStringParameters.auth
    let resource = event.methodArn;
  
    console.log("authToken " + authToken + " resource " + resource);
  
    return {
      "principalId": "user",
      "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "execute-api:Invoke",
            "Effect": effect,
            "Resource": resource
          }
        ]
      }
    };
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
