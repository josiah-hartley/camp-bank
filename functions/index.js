const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();
const auth = admin.auth();

exports.createUser = functions.firestore
    .document('users/{userID}')
    .onCreate((snap, context) => {
        const d = snap.data();
        const userID = context.params.userID;

        auth.createUser({
            uid: userID,
            email: d.email
        })
        .then((rec) => {
            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAJosTqvzbXS2kUTytLX8Yv-M52RUs4Jmg ', {
                requestType: 'PASSWORD_RESET',
                email: d.email
            })
            .then((res) => {
                console.log('Sent verification email successfully.');
            })
            .catch((err) => {
                console.error(new Error('Error sending verification email: ' + err));
            });
            //client.auth().sendPasswordResetEmail(d.email);
            return userID;
        })
        .catch((err) => {
            console.error(new Error('Couldn\'t create user: ' + err));
            return 0;
        });
    });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
