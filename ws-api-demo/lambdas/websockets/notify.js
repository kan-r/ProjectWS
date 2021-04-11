const Responses = require('../common/Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    const { connectionId, body } = event;

    try {
        const item = await Dynamo.get(connectionId, tableName);
        const { domainName, stage } = item;

        await WebSocket.send({
            domainName,
            stage,
            connectionId,
            message: body
        });

        return Responses._200({ message: 'notified' });
    } catch (error) {
        console.log(error);
        return Responses._400({ message: 'could not be notified' });
    }
};
