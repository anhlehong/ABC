import  { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { logout } from "../../../firebase/logout.js";
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

import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
const db = getDatabase();

let CateName = document.getElementById('CateNameInp');
let CategoryID = document.getElementById('CateIdInp');

let AddBtn = document.getElementById('AddBtn');
let UpdBtn = document.getElementById('UpdateBtn');
let DelBtn = document.getElementById('DeleteBtn');

function initializeCounter() {
    const counterRef = ref(db, 'CategoryCounter');
    get(counterRef).then((snapshot) => {
        if (!snapshot.exists()) {
            set(counterRef, 0).then(() => {
                console.log("CategoryCounter initialized to DM000");
            }).catch((error) => {
                console.error("Error initializing counter:", error);
            });
        } else {
            console.log("CategoryCounter already initialized");
        }
    }).catch((error) => {
        console.error("Error checking counter:", error);
    });
}

function Interface(e) {
    const dbref = ref(db);
    let BtnId = e.target.id;
    let cateId = document.getElementById('CateIdInp').value;

    if (BtnId == 'AddBtn') {
        AddData();
    } else {
        get(child(dbref, 'Category/' + cateId)).then((snapshot)=>{
            if(snapshot.exists() && (cateId !== "")){
                if (BtnId == 'UpdateBtn')
                    UpdateData(cateId);
                else if (BtnId == 'DeleteBtn')
                    DeleteData(cateId); 
            }
            else {
                if (BtnId == 'UpdateBtn')
                    alert("Cannot update, category does not exist");
                else if (BtnId == 'DeleteBtn')
                    alert("Cannot delete, category does not exist");
            }
        });
    }
}

function RetData(ID){
    const dbref = ref(db);

    get(child(dbref, 'Category/' + ID)).then((snapshot)=>{
        if(snapshot.exists()) {
            CateName.value = snapshot.val().CateName,
            CategoryID.value = ID
        }
        else {
            alert("Category does not exist");
        }
    })
    .catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

function AddData(){
    const counterRef = ref(db, 'CategoryCounter');
    runTransaction(counterRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then(({ snapshot }) => {
        const newCateId = 'DM' + formatCounter(snapshot.val());;
        set(ref(db, 'Category/' + newCateId), {
            CateName: CateName.value
        }).then(()=>{
            alert("Data Added Successfully with ID: " + newCateId);
            location.reload();
        }).catch((error)=>{
            alert("Unsuccessful");
            console.log(error);
        });
    }).catch((error) => {
        alert("Transaction failed");
        console.log(error);
    });
}

function UpdateData(cateId){
    update(ref(db, 'Category/' + cateId), {
        CateName: CateName.value
    }).then(()=>{
        alert("Data Updated Successfully");
        location.reload();
    }).catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    });
}

function DeleteData(cateId){
    remove(ref(db, 'Category/' + cateId)).then(()=>{
        alert("Data Deleted Successfully");
        location.reload();
    }).catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    });
}

AddBtn.addEventListener('click', Interface);
UpdBtn.addEventListener('click', Interface);
DelBtn.addEventListener('click', Interface);

// Initialize counter on application start
initializeCounter();

let cateList = document.getElementById('categoryList');
let stdno = 1;

function GetCategory(){
    const dbref = ref(db);

    get(child(dbref, 'Category')).then((category)=>{
        category.forEach(std => {
            AddCategorytAsListItem(std);
        });
    })
}

function AddCategorytAsListItem(std) {
    let key = std.key;
    let value = std.val();

    let id = document.createElement('th');
    let name = document.createElement('td');

    id.innerHTML = key;
    name.innerHTML = value.CateName;

    let tr = document.createElement('tr');
    tr.append(id, name);
    tr.className = 'clickTable';
    let tbody = document.createElement('tbody');
    tbody.appendChild(tr);
    cateList.append(tbody);
    stdno++;
}

window.addEventListener('load', GetCategory);

function GetClick() {
    const dbref = ref(db);

    get(child(dbref, 'User')).then(()=>{
        var rows = document.querySelectorAll("tr.clickTable");

        rows.forEach(function(row) {
            row.addEventListener("click", function() {
                var table = row.closest("tbody");
                var headers = table.querySelectorAll("th");
                headers.forEach(function(header) {
                    RetData(header.textContent);
                });
            });
        });
    })
}

window.addEventListener('load', GetClick);


function formatCounter(value) {
    return value.toString().padStart(3, '0');
}

function resetCounter() {
    const counterRef = ref(db, 'CategoryCounter');
    set(counterRef, + 0).then(() => {
        alert("CategoryCounter has been reset to 0");
    }).catch((error) => {
        console.error("Error resetting counter:", error);
    });
}

// Call this function to reset the counter
// resetCounter();


