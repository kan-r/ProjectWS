'use strict';

const AWS = require('aws-sdk')
let dynamo = new AWS.DynamoDB.DocumentClient();

const WS_ONNECTION_TABLE = process.env.CS_WS_CLIENTS_TABLE;
const WS_AUTH_TABLE = process.env.CS_WS_AUTH_TABLE;

// the following section injects the new ApiGatewayManagementApi service
// into the Lambda AWS SDK, otherwise you'll have to deploy the entire new version of the SDK

module.exports.cs_ws_connect = async event => {
  //console.log('Called connect route ' + JSON.stringify(event))

  let connectionId = event.requestContext.connectionId
  let firmId = !isNaN(event.queryStringParameters.firmId) ? parseInt(event.queryStringParameters.firmId) : undefined
  let userId = !isNaN(event.queryStringParameters.userId) ? parseInt(event.queryStringParameters.userId) : undefined

  console.log('CconnectionId ' + connectionId + ' firmId' + firmId + ' userId ' + userId)

  // Firm id will be duplicated on data as well as firmId, for shor period for seemless migration
  let dataPart = {}
   if (firmId) {
     dataPart = {
      firmId: parseInt(firmId)
    }
  }

  const params = {
    TableName: WS_ONNECTION_TABLE,
    Item: {
      connectionId: connectionId,
      data: dataPart,
      firmId: firmId,
      userId: userId
    }
  };

  await dynamo.put(params).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

module.exports.cs_ws_disconnect = async event => {
  console.log('Called disconnect route ' + JSON.stringify(event))
  let connectionId = event.requestContext.connectionId
  
  
  const params = {
    TableName: WS_ONNECTION_TABLE,
    Key: {
      connectionId: connectionId
    }
  };

  await dynamo.delete(params).promise()

   return {
    statusCode: 200
  };
};

module.exports.cs_ws_default = async event => {
  console.log('Called default route ' + JSON.stringify(event))
  return {
    statusCode: 200,
    body: 'PONG'
  };
};


module.exports.cs_ws_auth = async event => {
  let authToken = event.queryStringParameters.auth
  var authParam = {
    TableName: WS_AUTH_TABLE,
    Key:{
        "auth_token": authToken
    }
  }

  let effect = "Deny"

  await dynamo.get(authParam).promise().then((res) => {
    if (JSON.stringify(res) === '{}') {
      console.log("Auth token not found " + authToken);
    } else {
        effect = "Allow"
        return dynamo.delete(authParam).promise()
      }
  })

  console.log("authToken " + authToken + " result " + effect);

  return {
    "principalId": "user",
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": effect,
          "Resource": event.methodArn
        }
      ]
    }
  };

};
