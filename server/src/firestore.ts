export const admin = require("firebase-admin");
const serviceAccount = require("./keys/ecoOcean_firebase_key.json");
const { makeQueryRunner } = require("./QueryRunner.js");

const dbUserName = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gs://ecoocean.appspot.com",
});

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();

(async function (){
  const runner = await makeQueryRunner(
      process.env.DATABASE_URL || `postgres://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
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

})();
