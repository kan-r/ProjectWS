'use strict';

const aws = require('aws-sdk')
const dynamo = new aws.DynamoDB.DocumentClient();

const WS_CONNECTIONS_TABLE = process.env.WS_CONNECTIONS_TABLE;


exports.connect = async (event) => {
  console.log('CONNECT: ' + JSON.stringify(event))

  const connectionId = event.requestContext.connectionId;
  const requestId = event.requestContext.requestId;
  const requestTime = event.requestContext.requestTime;
  
  console.log('connectionId ' + connectionId  + ' requestId ' + requestId)

  const params = {
    TableName: WS_CONNECTIONS_TABLE,
    Item: {
      connectionId: connectionId,
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
};


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
};


exports.default = async (event) => {
  console.log('DEFAULT: ' + JSON.stringify(event));

  return {
    statusCode: 200,
    body: 'Routed to $default'
  };
};

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
  };
