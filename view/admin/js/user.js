import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
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
const db = getDatabase();
const auth = getAuth(app);

let Email = document.getElementById('EmailInp');
let User = document.getElementById('UserInp');
let Address = document.getElementById('AddressInp');
let Phone = document.getElementById('PhoneInp');
let Role = document.getElementById('RoleInp');
let Birth = document.getElementById('current-time');
let UserID = document.getElementById('UserID')

let AddBtn = document.getElementById('AddBtn');
let UpdBtn = document.getElementById('UpdateBtn');
let DelBtn = document.getElementById('DeleteBtn');

function formatDateToDDMMYYYY(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const today = new Date();
const formattedDate = formatDateToDDMMYYYY(today);

function Interface(e) {
    const dbref = ref(db);
    let BtnId = e.target.id;
    let Id = document.getElementById('UserID').value;

    if (BtnId == 'AddBtn') {
        RegisterUser();
    } else {
        get(child(dbref, 'User/' + Id)).then((snapshot)=>{
            if(snapshot.exists() && (Id !== "")){
                if (BtnId == 'UpdateBtn')
                    UpdateData(Id);
                else if (BtnId == 'DeleteBtn')
                    DeleteData(Id); 
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

let RegisterUser = evt => {
    evt.preventDefault();

    createUserWithEmailAndPassword(auth, Email.value, '12345678')
    .then((credentials)=>{
        set(ref(db, 'User/' + credentials.user.uid),{
            FullName: User.value,
            Email: Email.value,
            Address: Address.value,
            Birth: Birth.value,
            Phone: Phone.value,
            Role: (Role.value == 'admin'),
            CreateDate: formattedDate,
            UpdateDate: formattedDate
        });
    })
    .then(() => {
        alert("User Added Successfully");
        location.reload();
    })
    .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

function UpdateData(UserID){
    update(ref(db, 'User/' + UserID), {
        FullName: User.value,
        Email: Email.value,
        Address: Address.value,
        Birth: Birth.value,
        Phone: Phone.value,
        Role: (Role.value == 'admin'),
        UpdateDate: formattedDate
    }).then(()=>{
        alert("Data Updated Successfully");
        location.reload();
    }).catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    });
}

function DeleteData(userID){
    remove(ref(db, 'User/' + userID)).then(()=>{
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



let listUser = document.getElementById('userList');
let stdno = 1;

function GetUser(){
    const dbref = ref(db);

    get(child(dbref, 'User')).then((user)=>{
        user.forEach(std => {
            AddUserAsList(std);
        });
    })
}

function AddUserAsList(std) {
    let key = std.key;
    let value = std.val();

    let id = document.createElement('th');
    let name = document.createElement('td');
    let email = document.createElement('td');
    let role = document.createElement('td');

    id.innerHTML = key;
    name.innerHTML = value.FullName;
    email.innerHTML = value.Email;
    if(value.Role == true) {
        role.innerHTML = 'admin';
        role.className = 'bg-success badge';
    }
    else {
        role.innerHTML = 'user';
        role.className = 'bg-warning badge';
    }
    role.style.marginTop = '5px';

    let tr = document.createElement('tr');
    tr.append(id, email, name, role);
    tr.className = 'clickTable';
    let tbody = document.createElement('tbody');
    tbody.appendChild(tr);
    listUser.append(tbody);
    stdno++;
}

window.addEventListener('load', GetUser);

function RetData(ID){
    const dbref = ref(db);
    get(child(dbref, 'User/' + ID)).then((snapshot)=>{
        if(snapshot.exists()) {
            UserID.value = ID;
            Email.value = snapshot.val().Email;
            User.value = snapshot.val().FullName;
            Address.value = snapshot.val().Address;
            Birth.value = snapshot.val().Birth;
            Phone.value = snapshot.val().Phone;
            if(snapshot.val().Role == true)
                Role.value = 'admin';
            else
                Role.value = 'user';
        }
        else {
            alert("Product does not exist");
        }
    })
    .catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

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