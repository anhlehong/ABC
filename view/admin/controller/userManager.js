import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// import User from './user.js';
import User from "../model/user.js";
class UserManager {
    constructor() {
        this.userModel = new User();
        this.ROLE = this.userModel.ROLE;
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
        this.auth = getAuth(this.app);

        this.ID = document.getElementById('IDInp');
        this.Email = document.getElementById('EmailInp');
        this.User = document.getElementById('UserInp');
        this.Address = document.getElementById('AddressInp');
        this.Phone = document.getElementById('PhoneInp');
        this.Role = document.getElementById('RoleInp');
        this.Birth = document.getElementById('current-time');

        this.TxtInfor = document.getElementById('txt__infor');
        this.AddBtn = document.getElementById('AddBtn');
        this.InforBtn = document.getElementById('btn__infor');
        this.UpdBtn = document.getElementById('UpdateBtn');
        this.DelBtn = document.getElementById('DeleteBtn');
        this.listUser = document.getElementById('userList');
        this.stdno = 1;

        this.AddBtn.addEventListener('click', this.registerUser.bind(this));
        this.UpdBtn.addEventListener('click', this.updateUser.bind(this));
        this.DelBtn.addEventListener('click', this.deleteUser.bind(this));
        this.InforBtn.addEventListener('mouseover', () => {
            this.TxtInfor.style.display = 'inline-block';
        });
        this.InforBtn.addEventListener('mouseout', () => {
            this.TxtInfor.style.display = 'none';
        });
        // window.addEventListener('load', this.getUser.bind(this));
        window.addEventListener('load', this.createTableData.bind(this));
        window.addEventListener('load', this.addOptionInRole.bind(this));
    }
    addOptionInRole() {
        for (let key in this.ROLE) {
            let option = document.createElement('option');
            const nameRole = this.userModel.transRoleKeyToName(key);
            option.innerHTML = nameRole;
            option.value = key;
            this.Role.appendChild(option);
        }
    }
    formatDateToDDMMYYYY(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    deleteUser() {
        let uid = this.ID.value;
        const dbref = ref(this.db);
        remove(child(dbref, 'User/' + uid)).then(() => {
            alert("Người dùng đã được xóa thành công");
            location.reload();
        }).catch((error) => {
            alert("Xóa không thành công");
            console.log(error);
        });
    }
    updateUser() {
        let uid = this.ID.value;
        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);
        const dbref = ref(this.db);
        update(child(dbref, 'User/' + uid), {
            FullName: this.User.value,
            Email: this.Email.value,
            Address: this.Address.value,
            Birth: this.Birth.value,
            Phone: this.Phone.value,
            Role: this.ROLE[this.Role.value],
            UpdateDate: formattedDate
        }).then(() => {
            alert("Cập nhật người dùng thành công");
            location.reload();
        }).catch((error) => {
            alert("Câp nhật không thành công");
            console.log(error);
        });
    }

    createTableData() {
        const dbref = ref(this.db);
        var dataSet = [];
        get(child(dbref, 'User')).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var value = childSnapshot.val();
                let meaningRole;
                for (let key in this.ROLE) {
                    if (this.ROLE[key] == value.Role) {
                        meaningRole = key;
                    }
                }
                meaningRole = this.userModel.transRoleKeyToName(meaningRole);
                dataSet.push([
                    childSnapshot.key,
                    value.FullName,
                    value.Email,
                    meaningRole
                ]);
            });
            console.log(dataSet);
            var table = $('#userList').DataTable({
                // DataTable options
                data: dataSet,
                columns: [
                    { title: "ID" },
                    { title: "Họ và tên" },
                    { title: "Email" },
                    { title: "Phân quyền" },
                ],
                rowCallback: (row, data) => {
                    const role = data[3];
                    if (role == 'Quản trị viên') {
                        $(row).addClass('bg-success text-white');
                    } else if (role == 'Thủ kho') {
                        $(row).addClass('bg-warning text-white');
                    }
                    else if (role == 'Thu ngân') {
                        $(row).addClass('bg-info text-white');
                    }
                    else if (role == 'Nhân viên bán hàng') {
                        $(row).addClass('bg-secondary text-white');
                    }
                    $(row).on('click', () => {
                        get(child(dbref, 'User/' + data[0])).then((snapshot) => {
                            if (snapshot.exists()) {
                                let meaningRole;
                                for (let key in this.ROLE) {
                                    if (this.ROLE[key] == snapshot.val().Role) {
                                        meaningRole = key;
                                    }
                                }
                                this.Email.value = snapshot.val().Email;
                                this.User.value = snapshot.val().FullName;
                                this.Address.value = snapshot.val().Address;
                                this.Birth.value = snapshot.val().Birth;
                                this.Phone.value = snapshot.val().Phone;
                                this.Role.value = meaningRole;
                                this.ID.value = data[0];
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

    registerUser(evt) {
        evt.preventDefault();

        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);

        createUserWithEmailAndPassword(this.auth, this.Email.value, this.userModel.defaultPassword)
            .then((credentials) => {
                set(ref(this.db, 'User/' + credentials.user.uid), {
                    FullName: this.User.value,
                    Email: this.Email.value,
                    Address: this.Address.value,
                    Birth: this.Birth.value,
                    Phone: this.Phone.value,
                    Role: this.userModel.ROLE[this.Role.value],   
                    CreateDate: formattedDate,
                    UpdateDate: formattedDate
                });
            })
            .then(() => {
                alert("Thêm người dùng thành công");
                location.reload();
            })
            .catch((error) => {
                alert(error.message);
                console.log(error.code);
                console.log(error.message);
            });
    }
}

const userManager = new UserManager();