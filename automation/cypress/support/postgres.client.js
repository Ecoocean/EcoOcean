const { Client } = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'postgres',
    database: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
});

module.exports = client;