const Responses = require('../common/Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    const { connectionId } = event.requestContext;
    const { data } = JSON.parse(event.body);

    try {
        const item = await Dynamo.get(connectionId, tableName);
        const { domainName, stage } = item;

        await WebSocket.send({
            domainName,
            stage,
            connectionId,
            message: data
            // message: `{"connectionId": "${connectionId}", "message": "${data}"}`
        });

        return Responses._200({ message: 'got a message' });
    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }
};
