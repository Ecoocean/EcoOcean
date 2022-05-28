export const admin = require("firebase-admin");
const { makeQueryRunner } = require("./queryRunner");

const dbUserName = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

if (process.env.ENVIRONMENT === 'prod') {
  admin.initializeApp();
} else {
  admin.initializeApp({
    projectId: "ecoocean",
    databaseURL:
        "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "http:localhost:9199",
  });
}


export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();

(async function (){
  if ( process.env.ENVIRONMENT === 'dev') {
    const runner = await makeQueryRunner(
        `postgres://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
        "public"
    );
    try {
      const email = 'admin@gmail.com';
      const displayName = 'admin';
      const user = await auth.createUser({
        email,
        emailVerified: true,
        password: '123456',
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
                isAdmin: true,
                emailVerified: true,
                isOnboarded: true,
              }
            },
          }
      );

      console.log(JSON.stringify(result, null, 2));

    }
    catch (e) {
      console.log(e);
    }
    finally {
      await runner.release();
    }
  }
})();
