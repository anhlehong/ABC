import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get, update, remove, set, child, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

document.getElementById("btnClick").addEventListener('click', ()=>{
    const dbRef = ref(db);
    get(child(dbRef, `Product`)).then((snapshot) => {
        if (snapshot.exists()) {
            const value = snapshot.val()
            for (let pro of Object.values(value)) {

                console.log(pro.ProductID)
                console.log(pro.Size)

                update(ref(db, 'Product/' + pro.ProductID), {
                    Size: { L: 50, M: 50, S: 50, XL: 50, XXL: 50 }
                }).then(() => {
                    console.log('Product updated successfully');
                }).catch((error) => {
                    console.error('Error updating product:', error);
                });
            }
        } else {
            console.log('No data available');
            document.getElementById('retrieveProductResult').innerText = 'No data available';
        }
    }).catch((error) => {
        console.error('Error retrieving product:', error);
    });
})
