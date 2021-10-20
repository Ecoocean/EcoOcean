export const admin = require("firebase-admin");

const serviceAccount = require("./keys/ecoOcean_firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gs://ecoocean.appspot.com",
});

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
