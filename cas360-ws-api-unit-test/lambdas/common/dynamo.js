const aws = require('aws-sdk');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

if (process.env.JEST_WORKER_ID) {
    options = {
        endpoint: 'http://localhost:8000',
        region: 'local-env',
        sslEnabled: false,
    };
}

const documentClient = new aws.DynamoDB.DocumentClient(options);

const Dynamo = {
    async put(item, tableName) {
        const params = {
            TableName: tableName,
            Item: item,
        };

        const res = await documentClient.put(params).promise();
        return res ? item : null;
    },

    async delete(connectionId, tableName) {
        const params = {
            TableName: tableName,
            Key: {
                connectionId: connectionId
            }
        };

        return documentClient.delete(params).promise();
    },

    async get(clientId, tableName, ExclusiveStartKey) {
        const params = {
            TableName: tableName,
            FilterExpression: 'clientId = :clientId',
            ExpressionAttributeValues: {
                ':clientId': clientId
            },
            ExclusiveStartKey
        };
    
        const { Items, LastEvaluatedKey } = await documentClient.scan(params).promise();
      
        const items = Items.map(({ connectionId }) => connectionId);
        if(LastEvaluatedKey) {
            items.push(...await get(clientId, tableName, LastEvaluatedKey));
        }
      
        return items;
    }
};

module.exports = Dynamo;
