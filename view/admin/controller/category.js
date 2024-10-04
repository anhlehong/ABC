import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { logout } from "../../../firebase/logout.js";

export default class CategoryManager {
    constructor() {
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
        this.cateName = document.getElementById('CateNameInp');
        this.cateID = document.getElementById('CateIdInp');
        this.app = initializeApp(this.firebaseConfig);
        this.db = getDatabase();
        this.initializeCounter();
        this.attachEventListeners();
    }

    initializeCounter() {
        const counterRef = ref(this.db, 'CategoryCounter');
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

    attachEventListeners() {
        document.getElementById('AddBtn').addEventListener('click', this.interface.bind(this));
        document.getElementById('UpdateBtn').addEventListener('click', this.interface.bind(this));
        document.getElementById('DeleteBtn').addEventListener('click', this.interface.bind(this));
        // window.addEventListener('load', this.getCategory.bind(this));
        window.addEventListener('load', this.createTableData.bind(this));
        window.addEventListener('load', this.getClick.bind(this));
    }

    interface(e) {
        const dbref = ref(this.db);
        let BtnId = e.target.id;
        let cateId = document.getElementById('CateIdInp').value;
        console.log(cateId);
        if (BtnId == 'AddBtn') {
            this.addData();
        } else {
            get(child(dbref, 'Category/' + cateId)).then((snapshot) => {
                if (snapshot.exists() && (cateId !== "")) {
                    if (BtnId == 'UpdateBtn')
                        this.updateData(cateId);
                    else if (BtnId == 'DeleteBtn')
                        this.deleteData(cateId);
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

    addData() {
        const counterRef = ref(this.db, 'CategoryCounter');
        runTransaction(counterRef, (currentValue) => {
            return (currentValue || 0) + 1;
        }).then(({ snapshot }) => {
            const newCateId = 'DM' + this.formatCounter(snapshot.val());
            set(ref(this.db, 'Category/' + newCateId), {
                CateName: document.getElementById('CateNameInp').value
            }).then(() => {
                alert("Data Added Successfully with ID: " + newCateId);
                location.reload();
            }).catch((error) => {
                alert("Unsuccessful");
                console.log(error);
            });
        }).catch((error) => {
            alert("Transaction failed");
            console.log(error);
        });
    }

    updateData() {
        update(ref(this.db, 'Category/' + this.cateID.value), {
            CateName: document.getElementById('CateNameInp').value
        }).then(() => {
            alert("Data Updated Successfully");
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    deleteData() {
        remove(ref(this.db, 'Category/' + this.cateID.value)).then(() => {
            alert("Data Deleted Successfully");
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    createTableData() {
        const dbref = ref(this.db);
        var dataSet = [];
        get(child(dbref, 'Category')).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var value = childSnapshot.val();
                dataSet.push([
                    childSnapshot.key,
                    value.CateName
                ]);
            });
            console.log(dataSet);
            var table = $('#categoryList').DataTable({
                // DataTable options
                data: dataSet,
                columns: [
                    { title: "ID" },
                    { title: "Danh mục sản phẩm" }
                ],
                rowCallback: (row, data) => {
                    $(row).on('click', () => {
                        get(child(dbref, 'Category/' + data[0])).then((snapshot) => {
                            if (snapshot.exists()) {
                                this.cateName.value = snapshot.val().CateName;
                                this.cateID.value = data[0];
                            } else {
                                alert("Category does not exist");
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
            console.log("Error fetching category data: ", error);
        });
    }
    getClick() {
        console.log('getClick');
        const dbref = ref(this.db);
        get(child(dbref, 'User')).then(() => {
            var rows = document.querySelectorAll("tr.clickTable");

            rows.forEach((row) => {
                row.addEventListener("click", () => {
                    var table = row.closest("tbody");
                    var headers = table.querySelectorAll("th");
                    headers.forEach((header) => {
                        this.retData(header.textContent);
                    });
                });
            });
        });
    }

    retData(ID) {

        const dbref = ref(this.db);

        get(child(dbref, 'Category/' + ID)).then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById('CateNameInp').value = snapshot.val().CateName;
                document.getElementById('CateIdInp').value = ID
            }
            else {
                alert("Category does not exist");
            }
        })
        .catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    formatCounter(value) {
        return value.toString().padStart(3, '0');
    }

    resetCounter() {
        const counterRef = ref(this.db, 'CategoryCounter');
        set(counterRef, 0).then(() => {
            alert("CategoryCounter has been reset to 0");
        }).catch((error) => {
            console.error("Error resetting counter:", error);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryManager = new CategoryManager();
});

