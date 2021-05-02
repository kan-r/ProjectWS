const response = require('../common/response');

test('response is an object', () => {
    expect(typeof response).toBe('object');
});

test('_200 works', () => {
    const res = response._200({ name: 'josh' });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
});

test('_400 works', () => {
    const res = response._400({ name: 'josh' });
    expect(res.statusCode).toBe(400);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
});

test('_404 works', () => {
    const res = response._404({ name: 'josh' });
    expect(res.statusCode).toBe(404);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
});

test('define response', () => {
    const res = response._DefineResponse(382, { any: 'thing' });
    expect(res.statusCode).toBe(382);
    expect(res.body).toBe(JSON.stringify({ any: 'thing' }));
});
