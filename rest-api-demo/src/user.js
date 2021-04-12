const RESPONSES = require('./responses');

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.Id) {
        // failed without an Id
        return RESPONSES._400({ message: 'missing the Id from the path' });
    }

    let Id = event.pathParameters.Id;

    if (data[Id]) {
        // return the data
        return RESPONSES._200(data[Id]);
    }

    //failed as Id not in the data
    return RESPONSES._400({ message: 'no Id in data' });
};

const data = {
    1: { name: 'Anna Jones', age: 25, job: 'journalist' },
    2: { name: 'Chris Smith', age: 52, job: 'teacher' },
    3: { name: 'Tom Hague', age: 23, job: 'plasterer' },
};
