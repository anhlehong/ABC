import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import Utils from "./utils.js";
class SupplierManager {
    constructor() {
        this.utils = new Utils();
        this.getInp();
        this.getButton();
        this.getFirebaseStuff();
        this.createTableData();

        this.deleteBtn.addEventListener('click', this.addEventDeleteSupplier.bind(this));
        this.addBtn.addEventListener('click', this.addEventAddSupplier.bind(this));
        this.updateBtn.addEventListener('click', this.addEventUpdateSupplier.bind(this));
        document.addEventListener('DOMContentLoaded', () => {
            this.cleanInpValue();
        });
    }
    getFirebaseStuff() {
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

        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase();

    }
    getInp() {
        this.IDInp = document.getElementById('IDInp');
        this.nameInp = document.getElementById('NameInp');
        this.addreesInp = document.getElementById('AddressInp');
        this.ZIPInp = document.getElementById('ZIPInp');
        this.phoneInp = document.getElementById('PhoneInp');
        this.emailInp = document.getElementById('EmailInp');

    }
    getButton() {
        this.addBtn = document.getElementById('AddBtn');
        this.deleteBtn = document.getElementById('DeleteBtn');
        this.updateBtn = document.getElementById('UpdateBtn');
    }
    cleanInpValue() {
        this.IDInp.value = '';
        this.nameInp.value = '';
        this.addreesInp.value = '';
        this.ZIPInp.value = '';
        this.phoneInp.value = '';
        this.emailInp.value = '';
    }
    async addEventDeleteSupplier() {
        const dbref = ref(this.db);
        const runTransactionResult = await runTransaction(ref(this.db, 'SupplierCounter'), (counter) => {
            return counter <= 0 ? 0 : counter - 1;
        });
        get(child(dbref, 'Supplier/' + this.IDInp.value)).then((snapshot) => {
            if (snapshot.exists()) {
                remove(child(dbref, 'Supplier/' + this.IDInp.value)).then(() => {
                    alert("Delete supplier successfully");
                    location.reload();
                }).catch((error) => {
                    alert("Delete supplier unsuccessfully");
                    console.log(error);
                });
            } else {
                alert("User does not exist");
            }
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }
    async addEventAddSupplier() {
        const counterRef = ref(this.db, 'SupplierCounter');
        const runTransactionResult = await runTransaction(counterRef, (counter) => {
            return counter + 1;
        });
        const newSupplierID = 'NCC' + this.utils.formatCounter(runTransactionResult.snapshot.val());
        set(ref(this.db, 'Supplier/' + newSupplierID), {
            Name: this.nameInp.value,
            Address: this.addreesInp.value,
            ZIP: this.ZIPInp.value,
            Phone: this.phoneInp.value,
            Email: this.emailInp.value
        }).then(() => {
            alert("Add supplier successfully");
            location.reload();
        }).catch((error) => {
            alert("Add supplier unsuccessfully");
            console.log(error);
        })
    }
    async addEventUpdateSupplier() {
        const dbref = ref(this.db);
        get(child(dbref, 'Supplier/' + this.IDInp.value)).then((snapshot) => {
            if (snapshot.exists()) {
                update(child(dbref, 'Supplier/' + this.IDInp.value), {
                    Name: this.nameInp.value,
                    Address: this.addreesInp.value,
                    ZIP: this.ZIPInp.value,
                    Phone: this.phoneInp.value,
                    Email: this.emailInp.value
                }).then(() => {
                    alert("Update supplier successfully");
                    location.reload();
                }).catch((error) => {
                    alert("Update supplier unsuccessfully");
                    console.log(error);
                });
            } else {
                alert("User does not exist");
            }
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }
    createTableData() {
        const dbref = ref(this.db);
        console.log('createTableData');
        var dataSet = [];
        get(child(dbref, 'Supplier')).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let value = childSnapshot.val();
                dataSet.push([
                    childSnapshot.key,
                    value.Name,
                    value.Address,
                    value.ZIP,
                    value.Phone,
                    value.Email
                ]);
            });
            console.log(dataSet);
            var table = $('#SupplierList').DataTable({
                // DataTable options
                data: dataSet,
                columns: [
                    { title: "ID" },
                    { title: "Tên" },
                    { title: "Địa chỉ" },
                    { title: "ZIP" },
                    { title: "SĐT" },
                    { title: "Email" },
                ],
                rowCallback: (row, data) => {
                    $(row).on('click', () => {
                        get(child(dbref, 'Supplier/' + data[0])).then((snapshot) => {
                            if (snapshot.exists()) {
                                let value = snapshot.val();
                                this.nameInp.value = value.Name;
                                this.addreesInp.value = value.Address;
                                this.ZIPInp.value = value.ZIP;
                                this.phoneInp.value = value.Phone;
                                this.emailInp.value = value.Email;
                                this.IDInp.value = data[0];
                            } else {
                                alert("User does not exist");
                            }
                        }).catch((error) => {
                            alert("Unsuccessful");
                            console.log(error);
                        });
                    });
                    $(row).on('mouseenter', function () {
                        // Add any additional functionality on mouse enter if needed
                    });
                }
            });
        }).catch((error) => {
            console.log("Error fetching user data: ", error);
        });
    }
}

const supplierManager = new SupplierManager();