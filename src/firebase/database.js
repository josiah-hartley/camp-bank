import 'firebase/firestore'
import firebaseApp from './app.js'

const firestore = firebaseApp.firestore();
firestore.enablePersistence().catch((err) => {
    console.log("error: ", err);
});

export default firestore;