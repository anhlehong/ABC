// Database.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, get, update, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
  authDomain: "demosoftwaretechnology.firebaseapp.com",
  databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
  projectId: "demosoftwaretechnology",
  storageBucket: "demosoftwaretechnology.appspot.com",
  messagingSenderId: "375046175781",
  appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
  measurementId: "G-120GXQ1F6L"
};

class Database {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.db = getDatabase(this.app);
  }

  getUserData(userId) {
    const dbRef = ref(this.db);
    return get(child(dbRef, `User/${userId}`));
  }

  updateUser(userId, userData) {
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    return update(ref(this.db, `User/${userId}`), {
      ...userData,
      UpdateDate: formattedDate
    });
  }
}

export default new Database();
