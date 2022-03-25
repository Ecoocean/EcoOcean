const auth = require('./firebase.auth');
const client = require("./postgres.client");

(async () => {
    const result = await auth.listUsers();
    await auth.deleteUsers(result.users.map((user) => user.uid));
    await client.connect();
    await client.query('TRUNCATE TABLE users;');
    await client.end();
})()

