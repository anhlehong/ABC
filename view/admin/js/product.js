import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const storage = getStorage(app);

let AddBtn = document.getElementById('AddBtn');
let UpdBtn = document.getElementById('UpdateBtn');
let DelBtn = document.getElementById('DeleteBtn');

let ProductID = document.getElementById('ProductID');
let ProductName = document.getElementById('ProductName');
let ProductPrice = document.getElementById('ProductPrice');
let ProductCategory = document.getElementById('ProductCategory');
let ProductPromotion = document.getElementById('range');
let Description = document.getElementById('Description');

//========================= HIỆN THỊ DANH MỤC SẢN PHẨM ==================================
let stdno = 1;

function getProductCategory() {
    const dbref = ref(db);
    get(child(dbref, 'Category')).then((category) => {
        category.forEach(std => {
            AddProductCategory(std);
        });
    }).catch((error) => {
        console.error("Failed to fetch product categories:", error);
    });
}

function AddProductCategory(std) {
    let key = std.key;
    let value = std.val();
    console.log(`key: ${key} - value: ${value}`);

    let opt = document.createElement('option');
    opt.value = value.CateID;
    opt.innerText = value.CateName;
    opt.setAttribute('data-catid', key);

    ProductCategory.append(opt);

    stdno++;
}

window.addEventListener('load', getProductCategory);

//=================================================SETUP TODAY=================================
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const today = new Date();
const formattedDate = formatDateToYYYYMMDD(today);

//=================================== ĐỌC FILE IMAGE=============================================
var files = [];
var proglab = document.getElementById('UpProgress');
var input = document.getElementById('file-image');

input.onchange = e => {
    files = e.target.files;
    console.log("Files selected: ", files);
}

function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    return fname;
}

async function handleFileUpload(inputElement) {
    const files = inputElement.files;
    let image = {};

    for (const file of files) {
        try {
            const url = await UploadProgress(file);
            console.log(`Uploaded file: ${file.name} to URL: ${url}`);
            const getName = GetFileName(file);
            image[getName] = {
                ImgName: file.name,
                ImgURL: url
            };
        } catch (error) {
            console.log("Failed to upload file: ", file.name, error);
            alert("Some images failed to upload. Please try again.");
            return null;
        }
    }
    console.log("Images uploaded: ", image);

    return image;
}

async function UploadProgress(file) {
    var ImgToUpload = file;
    var imgName = file.name;
    const metaData = {
        contentType: ImgToUpload.type
    };

    const storageRef = sRef(storage, "Images/" + imgName);
    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    return new Promise((resolve, reject) => {
        UploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            console.error("Error during upload: ", error);
            reject(error);
        }, () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            }).catch(reject);
        });
    });
}

function Interface(e) {
    const dbref = ref(db);
    let BtnId = e.target.id;
    let ProId = document.getElementById('ProductID').value;

    if (BtnId == 'AddBtn') {
        AddData();
    } else {
        get(child(dbref, 'Product/' + ProId)).then((snapshot) => {
            if (snapshot.exists()) {
                if (BtnId == 'UpdateBtn')
                    UpdateData(ProId);
                else if (BtnId == 'DeleteBtn')
                    DeleteData(ProId);
            }
            else {
                if (BtnId == 'UpdateBtn')
                    alert("Cannot update, product does not exist");
                else if (BtnId == 'DeleteBtn')
                    alert("Cannot delete, product does not exist");
            }
        }).catch((error) => {
            console.error("Error accessing product data: ", error);
        });
    }
}

async function AddData() {
    var checkbox = document.getElementsByName('size');
    let image = await handleFileUpload(document.getElementById('file-image'));

    if (!image) {
        console.error("No images uploaded, aborting AddData.");
        return;
    }

    const counterRef = ref(db, 'ProductCounter');
    runTransaction(counterRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then(({ snapshot }) => {
        const newCateId = 'SP' + formatCounter(snapshot.val());

        let detailContent = tinymce.get('Detail').getContent();

        const productData = {
            ProductID: newCateId,
            Name: ProductName.value,
            Price: Number(ProductPrice.value),
            Promotion: Number(ProductPromotion.value),
            Category: ProductCategory.value,
            Images: image,
            CreateDate: formattedDate,
            UpdateDate: formattedDate,
            Detail: detailContent,
            Description: Description.value
        };

        set(ref(db, 'Product/' + newCateId), productData).then(() => {
            alert("Data Added Successfully with ID: " + newCateId);
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.error("Failed to save product data: ", error);
        });
    }).catch((error) => {
        alert("Transaction failed");
        console.error("Failed to increment product counter: ", error);
    });
}

async function UpdateData(ProID) {
    console.log("ProID: ", ProID);
    console.log("Starting UpdateData function for Product ID: ", ProID);

    var checkbox = document.getElementsByName('size');
    let image = await handleFileUpload(document.getElementById('file-image'));

    const productCategorySelect = document.getElementById('ProductCategory');
    const selectedOption = productCategorySelect.options[productCategorySelect.selectedIndex];
    const dataCatID = selectedOption.getAttribute('data-catid');

    let detailContent = tinymce.get('Detail').getContent();

    // Tạo đối tượng productData
    const productData = {
        Name: ProductName.value,
        Price: Number(ProductPrice.value),
        Promotion: Number(ProductPromotion.value),
        Category: dataCatID,
        UpdateDate: formattedDate,
        Detail: detailContent,
        Description: Description.value
    };

    // Nếu image không rỗng, thêm thuộc tính Images vào productData
    if (image && Object.keys(image).length > 0) {
        productData.Images = image;
    }

    console.log(productData);

    update(ref(db, 'Product/' + ProID), productData).then(() => {
        alert("Data Updated Successfully");
        location.reload();
    }).catch((error) => {
        alert("Unsuccessful");
        console.error("Failed to update product data: ", error);
    });
}


function DeleteData(ProID) {
    remove(ref(db, 'Product/' + ProID)).then(() => {
        alert("Data Deleted Successfully");
        location.reload();
    }).catch((error) => {
        alert("Unsuccessful");
        console.error("Failed to delete product data: ", error);
    });
}

AddBtn.addEventListener('click', Interface);
UpdBtn.addEventListener('click', Interface);
DelBtn.addEventListener('click', Interface);

//===================================DANH SÁCH SẢN PHẨM=====================================
$(document).ready(function () {
    var dataSet = [];
    const dbref = ref(db);

    get(child(dbref, 'Product')).then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var value = childSnapshot.val();
            const productID = childSnapshot.key;
            dataSet.push([
                productID,
                value.Name,
                value.Price,
                value.CreateDate,
                value.UpdateDate
            ]);
        });

        var table = $('#listProduct').DataTable({
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Sản phẩm" },
                { title: "Đơn giá" },
                { title: "Ngày tạo" },
                { title: "Ngày cập nhật" }
            ],
            rowCallback: function (row, data) {
                $(row).on('click', function () {
                    get(child(dbref, 'Product/' + data[0])).then((snapshot) => {
                        if (snapshot.exists()) {
                            ProductID.value = snapshot.key;
                            ProductName.value = snapshot.val().Name;
                            ProductPrice.value = snapshot.val().Price;

                            const categoryID = snapshot.val().Category; // Lấy giá trị của Category từ snapshot
                            const selectElement = document.getElementById('ProductCategory'); // Lấy phần tử select

                            // Duyệt qua tất cả các tùy chọn trong select
                            for (let i = 0; i < selectElement.options.length; i++) {
                                let option = selectElement.options[i];

                                // Kiểm tra xem giá trị của data-catid có bằng với Category từ snapshot không
                                if (option.getAttribute('data-catid') === categoryID) {
                                    option.selected = true; // Chọn tùy chọn này
                                    console.log(`Selected category: ${option.innerText} with data-catid: ${categoryID}`);
                                    break; // Thoát vòng lặp khi tìm thấy tùy chọn phù hợp
                                }
                            }

                            let detailContent = snapshot.val().Detail;
                            tinymce.get('Detail').setContent(detailContent);
                            Description.value = snapshot.val().Description;
                        }
                        else {
                            alert("Product does not exist");
                        }
                    }).catch((error) => {
                        alert("Unsuccessful");
                        console.error("Failed to fetch product details: ", error);
                    });
                });
                $(row).on('mouseenter', function () {
                    // Optional: Add hover functionality here
                });
            }
        });
    }).catch((error) => {
        console.error("Failed to fetch product list: ", error);
    });
});

//===================================PRIMARY KEY=============================================
function initializeCounter() {
    const counterRef = ref(db, 'ProductCounter');
    get(counterRef).then((snapshot) => {
        if (!snapshot.exists()) {
            set(counterRef, 0).then(() => {
                console.log("ProductCounter initialized to SP00000");
            }).catch((error) => {
                console.error("Error initializing counter:", error);
            });
        } else {
            console.log("ProductCounter already initialized");
        }
    }).catch((error) => {
        console.error("Error checking counter:", error);
    });
}

function formatCounter(value) {
    return value.toString().padStart(5, '0');
}

function resetCounter() {
    const counterRef = ref(db, 'ProductCounter');
    set(counterRef, 0).then(() => {
        alert("ProductCounter has been reset to SP00000");
    }).catch((error) => {
        console.error("Error resetting counter:", error);
    });
}

initializeCounter();

// Uncomment to reset the counter
// resetCounter();
