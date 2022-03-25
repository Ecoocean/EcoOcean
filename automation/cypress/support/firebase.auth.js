const admin = require("firebase-admin");


admin.initializeApp({
    projectId: 'ecoocean',
    credential: admin.credential.applicationDefault()
});

module.exports = admin.auth();