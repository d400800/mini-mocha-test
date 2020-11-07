const assert = require('assert');

it('a', async () => {
    const testPromise = new Promise(resolve => {
        setTimeout(() => resolve('abcde'), 6000);
    });

    const result = await testPromise;

    return assert.equal(result, 1)
});
