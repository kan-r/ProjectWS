module.exports = {
    tables: [
        {
            TableName: 'cas360WSConnections',
            KeySchema: [
                {
                    AttributeName: 'connectionId',
                    KeyType: 'HASH',
                },
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'connectionId',
                    AttributeType: 'S',
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        },
    ],
};
