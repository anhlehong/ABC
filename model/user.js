import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
class User{
    constructor(userID, address, birth, email, fullName, phone, role){
        this.firebaseConfig = {
            apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
            authDomain: "demosoftwaretechnology.firebaseapp.com",
            databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
            projectId: "demosoftwaretechnology",
            storageBucket: "demosoftwaretechnology.appspot.com",
            messagingSenderId: "375046175781",
            appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
            measurementId: "G-120GXQ1F6L"
        };
        this.app = initializeApp(this.firebaseConfig);
        this.db = getDatabase();
    }
    addUser(){
        const dbref = ref(this.db);
        set(child(dbref, 'User/' + this.id), {
            Name: this.name,
            Email: this.email,
            Role: this.role,
            Phone: this.phone
        }).then(() => {
            console.log("User added successfully");
        }).catch((error) => {
            console.error("Error adding user:", error);
        });
    }
    removeUser(){
        const dbref = ref(this.db);
        remove(child(dbref, 'User/' + this.id)).then(() => {
            console.log("User removed successfully");
        }).catch((error) => {
            console.error("Error removing user:", error);
        });
    }
    updateUser(){
        const dbref = ref(this.db);
        update(child(dbref, 'User/' + this.id), {
            Name: this.name,
            Email: this.email,
            Role: this.role,
            Phone: this.phone
        }).then(() => {
            console.log("User updated successfully");
        }).catch((error) => {
            console.error("Error updating user:", error);
        });
    }
}