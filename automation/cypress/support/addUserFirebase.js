const auth = require('./firebase.auth');
const { makeQueryRunner } = require("./queryRunner");

(async () => {
    const runner = await makeQueryRunner(
        'postgres://postgres:mysecretpassword@localhost:5432/postgres',
        "public"
    );
    const email = process.env.email;
    const password = process.env.password;
    const displayName = process.env.displayName;
    const isAdmin = process.env.isAdmin;
    const user = await auth.createUser({
        email,
        emailVerified: true,
        password,
        displayName,
        disabled: false,
    });

    const result = await runner.query(
        `
            mutation createUser($input: CreateUserInput!) {
              createUser(input: $input) {
                user {
                  uid
                }
              }
            }
       `,
        {
            input: {
                user:{
                    uid: user.uid,
                    displayName,
                    email,
                    isAdmin: isAdmin === 'true',
                    emailVerified: true,
                    isOnboarded: true,
                }
            },
        }
    );
    console.log(JSON.stringify(result, null, 2));
    await runner.release();
})()