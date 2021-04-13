const Responses = require('../common/Responses');

exports.handler = async event => {
    return Responses._200({ message: 'default' });
};
