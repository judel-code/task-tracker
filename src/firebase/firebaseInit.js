import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyApuQKObPhvciRjEDtk7DpKUHxGxSisdgY",
    authDomain: "task-tracker-b1397.firebaseapp.com",
    projectId: "task-tracker-b1397",
    storageBucket: "task-tracker-b1397.appspot.com",
    messagingSenderId: "134940599726",
    appId: "1:134940599726:web:cc77e75354f43fa715d43f"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export default firebaseApp.firestore();