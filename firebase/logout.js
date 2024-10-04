import  { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    signOut,
    getAuth
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
const firebaseConfig = {
    apiKey: 'AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus',
    authDomain: 'demosoftwaretechnology.firebaseapp.com',
    databaseURL: 'https://demosoftwaretechnology-default-rtdb.firebaseio.com',
    projectId: 'demosoftwaretechnology',
    storageBucket: 'demosoftwaretechnology.appspot.com',
    messagingSenderId: '375046175781',
    appId: '1:375046175781:web:0d1bfac1b8ca71234293cc',
    measurementId: 'G-120GXQ1F6L',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const logout = async (path) => {
    await signOut(auth);
    console.log('Logged out')
    window.location.href = path;
}
export{
    logout,
}
