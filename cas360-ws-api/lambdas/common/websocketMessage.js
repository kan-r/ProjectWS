const AWS = require('aws-sdk');

const create = (domainName, stage) => {
    const endpoint = `${domainName}/${stage}`;
    return new AWS.ApiGatewayManagementApi({
        endpoint: endpoint
    });
};

const send = ({domainName, stage, connectionId, message }) => {
    const ws = create(domainName, stage);

    let data = {
        connectionId: connectionId,
        message: message
    }

    const postParams = {
        ConnectionId: connectionId,
        Data: JSON.stringify(data)
    };

    return ws.postToConnection(postParams).promise();
};

module.exports = {
    send
};
