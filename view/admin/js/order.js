import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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

let OrderDetail = document.getElementById('order-detail');
let ODID = document.getElementById('ODID');
let Customer = document.getElementById('Customer');
let Address = document.getElementById('Address');
let Phone = document.getElementById('Phone');
let getTotal = document.getElementById('total-full');

const db = getDatabase();
$(document).ready(function() {
    var dataSet = [];
    const dbref = ref(db);
    let cusID;
    get(child(dbref, 'Orders')).then(async function(snapshot) {
        let promises = [];

        snapshot.forEach(function(childSnapshot) {
            var value = childSnapshot.val();
            cusID = value.UserID;
            // Fetch user name asynchronously and push to dataSet once complete
            let userPromise = get(child(dbref, 'User/' + value.UserID)).then((userSnapshot) => {
                let userName; // Default name
                if(userSnapshot.exists()) {
                    userName = userSnapshot.val().FullName;
                    dataSet.push([
                        value.OrderID,
                        userName,
                        value.OrderDate,
                        value.Total
                    ]);
                }

            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });

            promises.push(userPromise);
        });

        // Wait for all promises to complete
        await Promise.all(promises);
        $('#table-order').DataTable({
            // DataTable options
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Khách hàng" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" }

            ],
            rowCallback: function(row, data) {
                $(row).on('click', function() {
                    $('#order-detail tbody').remove();
                    ODID.innerText = data[0];
                    var totalFull = 0;
                    get(child(dbref, 'Orders/' + data[0])).then((snapshotOrder)=>{
                        
                        if(snapshotOrder.exists()) {
                            get(child(dbref, 'User/' + snapshotOrder.val().UserID)).then((snapshotUser)=>{
                                if(snapshotUser.exists()) {
                                    Customer.innerText = snapshotUser.val().FullName;
                                    Address.innerText = snapshotUser.val().Address;
                                    Phone.innerText = snapshotUser.val().Phone;
                                }
                                else {
                                    alert("User does not exist");
                                }
                            })
                        }
                        else {
                            alert("Order does not exist");
                        }
                    })
                    .catch((error)=>{
                        alert("Unsuccessful");
                        console.log(error);
                    });
                    get(child(dbref, 'OrderDetail/' + data[0])).then((snapshot)=>{
                        if(snapshot.exists()) {
                            let details = snapshot.val();
                            for (let product in details) {
                                
                                let id = document.createElement('th');
                                let namePro = document.createElement('td');
                                let quantity = document.createElement('td');
                                let price = document.createElement('td');
                                let total = document.createElement('td');
                                id.innerHTML = product;

                                let productDetail = details[product];
                                quantity.innerHTML = productDetail.Amount;
                                total.innerHTML = productDetail.Total;


                                get(child(dbref, 'Product/' + product)).then((snapshot)=>{
                                    if(snapshot.exists()) {
                                        namePro.innerHTML = snapshot.val().Name;
                                        price.innerHTML = snapshot.val().Price;
                                        totalFull += productDetail.Total;

                                        total.innerHTML = snapshot.val().Price * productDetail.Amount;

                                        getTotal.innerHTML = totalFull;
                                    }
                                    else {
                                        alert("Product does not exist");
                                    }
                                })
                                .catch((error)=>{
                                    alert("Unsuccessful");
                                    console.log(error);
                                })

                                let tr = document.createElement('tr');
                                tr.append(id, namePro, quantity, price, total);
                                let tbody = document.createElement('tbody');
                                tbody.appendChild(tr);
                                OrderDetail.append(tbody);
                                
                            }
                        }
                        else {
                            alert("Product does not exist");
                        }
                    })
                    .catch((error)=>{
                        alert("Unsuccessful");
                        console.log(error);
                    });
                    
                });
            }
        });
    });
});
const logoutBtn = document.getElementById('admin__sign-out');
const pathToLogin = "../user/login.html"
logoutBtn.addEventListener('click', () => logout(pathToLogin));
