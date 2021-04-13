const Responses = require('../common/Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
    
    const { connectionId, domainName, stage } = event.requestContext;

    const item = {
        connectionId,
        domainName,
        stage,
        date: Date.now(),
        ttl: parseInt((Date.now() / 1000) + 3600)
    };

    await Dynamo.write(item, tableName);

    return Responses._200({ message: 'connected' });
};
