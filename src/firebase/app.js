import firebase from 'firebase/app'
import config from './config.js'
const firebaseApp = firebase.initializeApp(config)

export default firebaseApp;