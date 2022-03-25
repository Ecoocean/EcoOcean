const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "gs://ecoocean.appspot.com",
});

module.exports = admin.auth();