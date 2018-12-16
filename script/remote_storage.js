const firebase = require('firebase');

class RemoteStorage {
  constructor() {
    const config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);
  }

  upload(id, blob, onFulfilled) {
    const storageRef = firebase.storage().ref();
    const uploadRef = storageRef.child(id + "_mov.webm");
    uploadRef.put(blob).then(onFulfilled);
  }
}

module.exports = RemoteStorage;
