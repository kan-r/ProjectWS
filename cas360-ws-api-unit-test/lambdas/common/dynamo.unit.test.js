const dynamo = require('./dynamo');

const validTableName = 'cas360WSConnections';

const items = [
    { connectionId: 'abcde1=', clientId: 'Kan' },
    { connectionId: 'abcde2=', clientId: 'Kan' },
    { connectionId: 'abcde3=', clientId: 'Ran' }
]

beforeAll(() => {

})

test('dynamo is an object', () => {
    expect(typeof dynamo).toBe('object');
});

test('dynamo has functions get, put & delete', () => {
    expect(typeof dynamo.get).toBe('function');
    expect(typeof dynamo.put).toBe('function');
    expect(typeof dynamo.delete).toBe('function');
});

test('dynamo put works', async () => {
    const item = await dynamo.put(items[0], validTableName);
    expect(item).toBe(items[0]);
});

// test('dynamo delete works', async () => {
//     await dynamo.put(items[0], validTableName);
//     const item = await dynamo.delete(items[0].connectionId, validTableName);
//     expect(item).toBe(items[0]);
// });

test('dynamo function get works', async () => {
    await dynamo.put(items[0], validTableName);
    await dynamo.put(items[1], validTableName);
    await dynamo.put(items[2], validTableName);
    const ids = await dynamo.get(items[0].clientId, validTableName);
    expect(ids.length).toBe(2);
    expect(ids[0]).toEqual(items[0].connectionId);
});