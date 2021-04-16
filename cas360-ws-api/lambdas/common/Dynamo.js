const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async getAll(tableName, ExclusiveStartKey) {

        console.log("tableName: ", tableName);

        const { Items, LastEvaluatedKey } = await documentClient.scan({
          TableName: tableName,
          AttributesToGet: [ 'domainName', 'stage', 'connectionId' ],
          ExclusiveStartKey
        }).promise();
      
        const items = Items.map(({ domainName, stage, connectionId }) => { domainName, stage, connectionId });
        if(LastEvaluatedKey) {
          connections.push(...await getAll(tableName, LastEvaluatedKey));
        }
      
        return items;
      },

    async getAll2(tableName) {
        const params = {
            TableName: tableName,
            AttributesToGet: [ 'domainName', 'stage', 'connectionId' ]
        };

        const data = await documentClient.scan(params).promise(); 

        console.log("Data: ", data);

        if(!data || !data.Items){
            return [];
        }
      
        return data.Items;
    },

    async get(id, tableName) {
        const params = {
            TableName: tableName,
            Key: {
                connectionId: id
            }
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${id} from ${tableName}`);
        }

        console.log(data);

        return data.Item;
    },

    async write(item, tableName) {
        if (!item.connectionId) {
            throw Error('No ID for the item');
        }

        const params = {
            TableName: tableName,
            Item: item
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${item.connectionId} in table ${tableName}`);
        }

        return res;
    },

    async delete(id, tableName) {
        const params = {
            TableName: tableName,
            Key: {
                connectionId: id
            }
        };

        return documentClient.delete(params).promise();
    },
};
module.exports = Dynamo;
