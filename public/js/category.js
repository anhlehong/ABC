import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

function fetchAndDisplayProductsByCategory(categoryId) {
    const dbRef = ref(db);
    get(child(dbRef, 'Product')).then(snapshot => {
        const productsByCategory = [];
        snapshot.forEach(childSnapshot => {
            const product = childSnapshot.val();
            if (product.CategoryID === categoryId) {
                productsByCategory.push(product);
            }
        });

        const categorySection = document.createElement('section');
        categorySection.classList.add('homepage-products', 'mb-4');
        const productListHTML = document.createElement('div');
        productListHTML.classList.add('listProduct', 'container');
        categorySection.appendChild(productListHTML);

        productsByCategory.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item', 'card', 'align-items-center');
            newProduct.dataset.id = product.ProductID;

            let imagesHtml = '';
            if (product.Images) {
                const firstImageKey = Object.keys(product.Images)[0];
                if (firstImageKey) {
                    let imgURL = product.Images[firstImageKey].ImgURL.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    imagesHtml = `<img class="card-img-top" src="${imgURL}" alt="${product.Name}">`;
                }
            }

            newProduct.innerHTML =  `
                <a href="detail.html?id=${product.ProductID}">
                    ${imagesHtml}
                </a>
                <h2>${product.Name}</h2>
                <div class="price">${product.Price}đ</div>
                <button class="addCart">
                    Thêm vào giỏ hàng
                </button>
            `;
            productListHTML.appendChild(newProduct);
        });

        const runningProductsSection = document.getElementById('runningProductsSection');
        runningProductsSection.innerHTML = '';
        runningProductsSection.appendChild(categorySection);
    }).catch(error => {
        console.error("Error fetching products by category:", error);
    });
}

// Call the function to display products by category
fetchAndDisplayProductsByCategory("specificCategoryId"); // Replace "specificCategoryId" with the actual category ID
