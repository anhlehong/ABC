import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
class User {
    constructor() {
        this.ROLE = {
            USER: 1,
            ADMIN: 2,
            WAREHOUSE: 3,
            CASHIER: 4,
            SALES: 5
        }
        this.defaultPassword = '12345678';
        this.originURL = "."
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
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
    }
    /**
     * 
     * @summary Track user login and store user ID in local storage
     */
    trackUserLogin(currentUser) {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                localStorage.setItem('userID', user.uid);
            } else {
            }

        });
    }
    getRoleName(role) {
        switch (role) {
            case this.ROLE.USER:
                return 'User';
            case this.ROLE.ADMIN:
                return 'Admin';
            case this.ROLE.WAREHOUSE:
                return 'Warehouse';
            case this.ROLE.CASHIER:
                return 'Cashier';
            case this.ROLE.SALES:
                return 'Sales';
        }
    }
    transRoleKeyToName(role) {
        switch (role) {
            case 'USER':
                return 'Người dùng';
            case 'ADMIN':
                return 'Quản trị viên';
            case 'WAREHOUSE':
                return 'Thủ kho';
            case 'CASHIER':
                return 'Thu ngân';
            case 'SALES':
                return 'Nhân viên bán hàng';
        }
    }
    /**
     * 
     * @param {String} role {User, Admin, Warehouse, Cashier, Sales}
     */
    redirectBasedOnRole(role) {
        if (role === 'Admin') {
            window.location.href = `${this.originURL}/view/admin/user.html`;
        } else if (role === 'Warehouse') {
            window.location.href = `${this.originURL}/view/admin/warehouse.html`;
        } else if (role === 'Cashier') {
            window.location.href = `${this.originURL}/view/admin/statisticSales.html`;
        } else if (role === 'Sales') {
            window.location.href = `${this.originURL}/view/admin/category.html`;
        }
    }
    /**
     * 
     * @param {String} userID 
     * @returns {Promise<Object>} {Address: String, Birth: Date, CreateDate: Date, Email: String, FullName: String, Phone: Number, Role: Number}      
     */
    async querryUser(userID) {
        const db = getDatabase();
        const reference = ref(db, 'User/' + userID);
        const snapshot = await get(reference);
        if (snapshot.exists()) {
            return snapshot.val();
        }
    }
    /**
     * 
     * @param {String} userID 
     * @returns {Promise<String>}  one of those values {User, Admin, Warehouse, Cashier, Sales}
     */
    async getRoleUser(userID) {
        const db = getDatabase();
        const reference = ref(db, 'User/' + userID);
        const snapshot = await get(reference);
        if (snapshot.exists()) {
            console.log(snapshot.val());
            const iRole = snapshot.val().Role;
            return this.getRoleName(iRole);
        }
    };


    /**
     * 
     * @param {String} userID 
     * @returns {Promise<Boolean>}
     */
    async isUserExist(userID) {
        const db = getDatabase();
        const reference = ref(db, 'User/' + userID);
        const snapshot = await get(reference);
        return snapshot.exist();

    }

    async getListUser() {
        const db = getDatabase();
        const reference = ref(db, 'User/');
        const snapshot = await get(reference);
        if (snapshot.exists()) {
            return snapshot.val();
        }
    }
}
export default User;