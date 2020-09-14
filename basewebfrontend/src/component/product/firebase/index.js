import firebase from "firebase/app";
import "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAD6SowAxNZZYfDx9os3_a-5bsvrUWSYls",
    authDomain: "img-base-d6dac.firebaseapp.com",
    databaseURL: "https://img-base-d6dac.firebaseio.com",
    projectId: "img-base-d6dac",
    storageBucket: "img-base-d6dac.appspot.com",
    messagingSenderId: "148982850317",
    appId: "1:148982850317:web:c64b72cde0410cdc4fc644",
    measurementId: "G-0JM99HVHVJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();
export {storage , firebase as default};