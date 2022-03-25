const waitOn = require('wait-on');

const opts = {
    resources: [
        'http://localhost:3000',
    ],
    log: true,
    timeout: 120000
};

(async function () {
    try {
        await waitOn(opts);
        // once here, all resources are available
    } catch (err) {
        console.log('failed to wait for services');
        throw new Error('failed to wait for services');
    }
})();