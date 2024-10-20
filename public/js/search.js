import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import Product from '../../js/models/product.js'

// Cấu hình Firebase
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
const db = getDatabase(app);

function formatPrice(number) {
    let formattedNumber = number.toLocaleString('vi-VN');
    return formattedNumber + "đ";
}

function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Hàm lấy sản phẩm
async function fetchProducts() {
    const productRef = ref(db, 'Product');
    const snapshot = await get(productRef);

    if (!snapshot.exists()) {
        console.log("No products found");
        return;
    }

    const products = [];
    snapshot.forEach(childSnapshot => {
        const value = childSnapshot.val();
        const product = new Product(
            childSnapshot.key,
            value.Name,
            value.Price,
            value.Images ? Object.values(value.Images)[0].ImgURL : '',
            value.Category,
            value.CreateDate,
            value.Description,
            value.Detail,
            value.ProductID,
            value.Promotion,
            value.Size,
            value.UpdateDate
        );
        products.push(product);
    });

    return products;
}

// Hàm tìm kiếm sản phẩm
async function searchProducts(event) {
    event.preventDefault(); // Ngăn chặn form submit theo cách mặc định

    const input = normalizeText(document.getElementById('cloth-input').value.trim());
    const listProductHTML = document.getElementById('search-results');
    
    if (input === '') {
        alert('Vui lòng nhập từ khóa tìm kiếm.');
        listProductHTML.innerHTML = ''; // Xóa kết quả trước đó
        return;
    }

    try {
        const products = await fetchProducts();

        listProductHTML.innerHTML = '';

        for (let value of products) {
            const normalizedProductName = normalizeText(value.name || '');

            if (!normalizedProductName.includes(input)) {
                continue;
            }

            let amount = 0;
            for (let amountSize of Object.values(value.size)) {
                amount += amountSize;
            }
            if (amount === 0) {
                continue;
            }

            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = value.id;

            newProduct.innerHTML = `
                <a href="detail.html?id=${value.id}">
                    <img class="card-img-top" src="${value.imgURL}" alt="${value.name}">
                </a>
                <h2>${value.name}</h2>
                <div class="price" style="font-weight: bold; text-align: center;">${formatPrice(value.price)}</div>
            `;

            listProductHTML.appendChild(newProduct);
        }

        if (listProductHTML.innerHTML === '') {
            listProductHTML.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        }
        showSearchResults();
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        alert('Lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại sau.');
    }
}

function showSearchResults() {
    document.getElementById('showSearch').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeSearchResults() {
    document.getElementById('showSearch').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Gắn sự kiện lắng nghe vào form khi trang tải
window.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('search-form');
    if (form) {
        form.addEventListener('submit', searchProducts);
    }

    const closeSearch = document.getElementById('closeSearch');
    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchResults);
    }

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSearchResults);
    }
});
