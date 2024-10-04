// Nhập các mô-đun cần thiết từ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, update, remove, runTransaction, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// Cấu hình ứng dụng Firebase
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let cartItems = {};
let localStorageUserID = localStorage.getItem('userID');

// Hàm để đọc và kiểm tra dữ liệu từ Firebase
function readCart() {
    const cartRef = ref(database, `User/${localStorageUserID}/Cart`);

    const unsubscribe = onValue(cartRef, (cartSnapshot) => {
        const cartData = cartSnapshot.val();
        loadCartItems(cartData);
        unsubscribe();  // Gỡ bỏ listener ngay sau khi xử lý dữ liệu
    });
}

function loadCartItems(cartData) {
    let lenCart = Object.keys(cartData).length;
    if (lenCart > 0) {
        let promises = [];

        for (let productID in cartData) {
            const productInforRef = ref(database, `Product/${productID}`);

            let promise = new Promise((resolve) => {
                const unsubscribe = onValue(productInforRef, (productInforSnapshot) => {
                    const productInfor = productInforSnapshot.val();
                    if (productInfor) {
                        // Lưu thông tin sản phẩm vào object cartItems
                        if (!cartItems[productID]) {
                            cartItems[productID] = {
                                Name: productInfor["Name"],
                                Amount: cartData[productID],
                                Price: productInfor["Price"],
                                ImgURL: productInfor["Images"][Object.keys(productInfor["Images"])[0]]["ImgURL"],
                            };
                        }
                    } else {
                        console.error(`Product information for ID ${productID} is not available.`);
                    }
                    resolve();
                    unsubscribe();  // Gỡ bỏ listener ngay sau khi xử lý dữ liệu
                });
            });

            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            displayCartItems();
            initializeCheckboxEvents();
            initializeButtonMinus();
            initializeButtonPlus();
            initializeDeleteProduct();
            payAllProducts();
        });

    } else {
        let showProduct = document.getElementById("showProduct");
        showProduct.innerHTML = "Giỏ hàng hiện đang trống.";

        const productDiv = document.getElementById(`allProduct`);
        if (productDiv) {
            productDiv.remove();
        }
    }
}

function formatPrice(number) {
    let formattedNumber = number.toLocaleString('vi-VN');
    return formattedNumber + "đ";
}

function displayCartItems() {
    let showProduct = document.getElementById("showProduct");
    showProduct.innerHTML = "";

    let fragment = document.createDocumentFragment();

    for (const productID in cartItems) {
        let product = cartItems[productID];
        let divProduct = document.createElement("div");
        divProduct.classList.add("card", "mb-3", "px-0");
        divProduct.id = `${productID}`;
        divProduct.innerHTML = `
            <div class="card px-0">
                <div class="row g-0">
                    <div class="col-xl-4 col-lg-5 col-sm-4 d-flex align-items-center">
                        <div class="d-flex align-items-center p-3">
                            <input class="form-check-input m-0 me-2" type="checkbox"
                                name="shopping_cart_items" id="inp-${productID}">
                            <img src="${product.ImgURL}" class="img-fluid img-thumbnail" alt="Hình ảnh thẻ">
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-7 col-sm-8">
                        <div class="card-body">
                            <h5 class="card-title">${product.Name}</h5>

                            <div class="row">
                                <div class="col">
                                    <label class="form-label">Số Lượng</label>
                                    <div class="input-group small-input-group">
                                        <button id="minus-${productID}" class="btn btn-outline-secondary button-minus" type="button"
                                            style="background-color: whitesmoke; border-right: 0;">
                                            <i class="fa-solid fa-minus"></i>
                                        </button>
                                        <input id="amount-${productID}" type="text" class="form-control input-number" value="${product.Amount}" readonly style="background-color: whitesmoke;">
                                        <button id="plus-${productID}" class="btn btn-outline-secondary button-plus" type="button"
                                            style="background-color: whitesmoke; border-left: 0;">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-4">
                                <div>
                                    <label class="form-label">Giá: <b id="price-${productID}">${formatPrice(product.Price * product.Amount)}</b></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        fragment.appendChild(divProduct);
    }

    showProduct.appendChild(fragment);
}

function initializeCheckboxEvents() {
    const allProductCheckbox = document.getElementById('allProduct');
    if (!allProductCheckbox) {
        console.error('Phần tử #allProduct không tồn tại trong DOM');
        return;
    }

    const productCheckboxes = document.querySelectorAll('input[name="shopping_cart_items"]');

    allProductCheckbox.addEventListener('click', function () {
        if (this.checked) {
            productCheckboxes.forEach(function (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            });
        } else {
            productCheckboxes.forEach(function (checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
        }
        payAllProducts(); // Gọi hàm payAllProducts để cập nhật lại tổng tiền
    });

    productCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                allProductCheckbox.checked = false;
            }
            payAllProducts(); // Gọi hàm payAllProducts để cập nhật lại tổng tiền
        });
    });
}

function initializeButtonMinus() {
    document.querySelectorAll('.button-minus').forEach(button => {
        button.addEventListener('click', function () {
            let id = this.id.replace('minus-', 'amount-');
            let amountInput = document.getElementById(id);
            let currentValue = parseInt(amountInput.value);
            if (currentValue > 1) {
                amountInput.value = currentValue - 1;
                let productId = id.split('-')[1];

                // Cập nhật số lượng trong đối tượng cartItems
                cartItems[productId].Amount = currentValue - 1;
                updatePrice(productId, currentValue - 1);
                updateAmountForFirebase(productId, currentValue - 1);
            }
        });
    });
}

function initializeButtonPlus() {
    document.querySelectorAll('.button-plus').forEach(button => {
        button.addEventListener('click', function () {
            let id = this.id.replace('plus-', 'amount-');
            let amountInput = document.getElementById(id);
            let currentValue = parseInt(amountInput.value);
            amountInput.value = currentValue + 1;
            let productId = id.split('-')[1];

            // Cập nhật số lượng trong đối tượng cartItems
            cartItems[productId].Amount = currentValue + 1;
            updatePrice(productId, currentValue + 1);
            updateAmountForFirebase(productId, currentValue + 1);
        });
    });
}

function updatePrice(productId, amount) {
    let product = cartItems[productId];
    let priceLabel = document.getElementById(`price-${productId}`);
    if (priceLabel) {
        priceLabel.textContent = formatPrice(product.Price * amount);
    } else {
        console.error(`Cannot find price label for product ${productId}`);
    }
}

function updateAmountForFirebase(productId, amount) {
    let path = `User/${localStorageUserID}/Cart`;
    const orderDetailRef = ref(database, path);

    const updateData = {};
    updateData[productId] = amount;

    update(orderDetailRef, updateData)
        .then(() => {
            console.log(`Updated ${path} with product ${productId} amount ${amount}`);
            payAllProducts(); // Chỉ gọi payAllProducts sau khi cập nhật thành công
        })
        .catch((error) => {
            console.error(`Failed to update ${path} with product ${productId}:`, error);
        });
}

function initializeDeleteProduct() {
    document.getElementById('deleteProduct').addEventListener('click', deleteProductUI);
}

// XÓA CART ITEMS
function deleteProductUI() {
    const productCheckboxes = Array.from(document.querySelectorAll('input[name="shopping_cart_items"]:checked')).map(checkbox => {
        const ids = checkbox.id.split("-");
        return {
            ProductID: ids[1]
        };
    });
    const showProduct = document.getElementById("showProduct");

    if (productCheckboxes.length === 0) {
        showAlert("Chọn sản phẩm cần xóa", "danger");
        return;
    }

    productCheckboxes.forEach((product) => {
        const productDiv = document.getElementById(`${product.ProductID}`);
        if (productDiv) {
            productDiv.remove();
        }
    });

    // Kiểm tra nếu giỏ hàng trống sau khi xóa
    if (showProduct.innerHTML.trim() === "") {
        showProduct.innerHTML = "Giỏ hàng hiện đang trống.";
    }

    showAlert("Đã xóa khỏi giỏ hàng", "success");
    console.log(productCheckboxes);
    deleteProductsForFirebase(productCheckboxes);
}

function deleteProductsForFirebase(productCheckboxes) {
    productCheckboxes.forEach(product => {
        const productRef = ref(database, `User/${localStorageUserID}/Cart/${product.ProductID}`);
        remove(productRef)
            .then(() => {
                console.log(`Đã xóa sản phẩm ${product.ProductID} khỏi Firebase`);
            })
            .catch(error => {
                console.error("Lỗi khi xóa sản phẩm từ Firebase:", error);
                showAlert(`Lỗi khi xóa sản phẩm ${product.ProductID} khỏi Firebase`, "danger");
            });
    });
}

function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertPlaceholder.append(wrapper);

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        wrapper.remove();
    }, 3000);
}

function payAllProducts() {
    const areaPay = document.getElementById("Pay_for_all_products");
    const showProduct = document.getElementById("showProduct");

    if (showProduct.innerHTML.trim() === "Giỏ hàng hiện đang trống.") {
        areaPay.innerHTML = "";
    } else {
        const checkedProducts = document.querySelectorAll('input[name="shopping_cart_items"]:checked');

        if (checkedProducts.length === 0) {
            areaPay.innerHTML = "Vui lòng chọn sản phẩm cần thanh toán";
        }
        else {
            let totalPrice = 0;

            checkedProducts.forEach(checkbox => {
                if (checkbox.id === 'allProduct') return; // Bỏ qua checkbox có id là 'allProduct'

                const ids = checkbox.id.split("-");
                const productId = ids[1];
                const product = cartItems[productId];

                if (product) {
                    totalPrice += product.Price * product.Amount;
                }
            });

            areaPay.innerHTML = `
                <button id="payButton" class="btn btn-primary">Thanh Toán</button>
                <span id="totalPrice">Tổng tiền: ${formatPrice(totalPrice)}</span>
            `;

            let payButton = document.getElementById("payButton");
            payButton.addEventListener("click", () => {
                const productCheckboxes = Array.from(document.querySelectorAll('input[name="shopping_cart_items"]:checked')).map(checkbox => {
                    if (checkbox.id === 'allProduct')
                        return {
                            ProductID: 'allProduct'
                        };
                    const ids = checkbox.id.split("-");
                    return {
                        ProductID: ids[1]
                    };
                });
                console.log("productCheckboxes: ", productCheckboxes);

                // remove UI product
                const showProduct = document.getElementById("showProduct");
                productCheckboxes.forEach((product) => {
                    const productDiv = document.getElementById(`${product["ProductID"]}`);

                    if (productDiv) {
                        productDiv.remove();
                    }
                });

                // Kiểm tra nếu giỏ hàng trống sau khi xóa
                if (showProduct.innerHTML.trim() === "") {
                    const productDiv = document.getElementById(`allProduct`);
                    if (productDiv) {
                        productDiv.remove();
                    }
                    showProduct.innerHTML = "Giỏ hàng hiện đang trống.";
                    areaPay.innerHTML = "";
                }
                else {
                    areaPay.innerHTML = "Vui lòng chọn sản phẩm cần thanh toán";
                }

                showAlert("Thanh toán thành công.", "primary");

                incrementAndCreateOrder(productCheckboxes, totalPrice, `${localStorageUserID}`)
                deleteProductsForFirebase(productCheckboxes)
            })
        }
    }
}

function createOrderDetail(orderId, productCheckboxes) {
    const orderDetailRef = ref(database, 'OrderDetail/' + orderId);

    let updates = {};

    // Tạo cập nhật chi tiết đơn hàng chỉ cho các sản phẩm đã được chọn
    productCheckboxes.forEach(product => {
        const productID = product.ProductID;
        if (productID != "allProduct" && cartItems[productID]) {
            updates[productID] = {
                Name: cartItems[productID].Name,
                Amount: cartItems[productID].Amount,
                Price: cartItems[productID].Price,
                ImgURL: cartItems[productID].ImgURL,
                Total: cartItems[productID].Amount * cartItems[productID].Price
            };
        }
    });

    update(orderDetailRef, updates)
        .then(() => {
            console.log("Order details created for order ID:", orderId);
        })
        .catch((error) => {
            console.error("Error creating order details:", error);
        });
}


function getCurrentDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); // Đảm bảo ngày là 2 chữ số
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0, cộng thêm 1 và đảm bảo là 2 chữ số
    const year = today.getFullYear();

    return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
}

function incrementAndCreateOrder(productCheckboxes, total, userId) {
    const orderDate = getCurrentDate(); // Lấy ngày hôm nay đã định dạng
    const ordersCounterRef = ref(database, 'Orders/OrdersCounter');
    runTransaction(ordersCounterRef, (currentValue) => {
        return (currentValue || 0) + 1;  // Tăng giá trị hiện tại của counter lên 1
    }).then((result) => {
        if (result.committed) {
            const newOrderId = 'HD' + formatCounter(result.snapshot.val());  // Tạo ID mới với tiền tố 'HD'
            const newOrderRef = ref(database, 'Orders/' + newOrderId);
            set(newOrderRef, {
                OrderDate: orderDate,
                OrderID: newOrderId,
                Total: total,
                UserID: userId
            }).then(() => {
                console.log("New order created with ID:", newOrderId);
                createOrderDetail(newOrderId, productCheckboxes);  // Gọi hàm tạo chi tiết đơn hàng
            }).catch((error) => {
                console.error("Error creating new order:", error);
            });
        } else {
            console.log("Failed to increment OrderCounter");
        }
    }).catch((error) => {
        console.error("Error when incrementing OrderCounter:", error);
    });
}

function formatCounter(value) {
    return value.toString().padStart(4, '0');  // Đảm bảo mã đơn hàng có 4 chữ số
}

document.addEventListener('DOMContentLoaded', (event) => {
    readCart();
});