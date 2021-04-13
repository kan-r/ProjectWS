const Responses = require('../common/Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
    const { connectionId } = event.requestContext;

    await Dynamo.delete(connectionId, tableName);

    return Responses._200({ message: 'disconnected' });
};
