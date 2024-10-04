import FirebaseService from './services/firebaseService.js';
import Product from './models/product.js';
import Category from './models/Category.js';

class ProductManager {
    constructor() {
        this.products = {};
        this.categories = {};
    }

    async fetchProducts() {
        const productRef = FirebaseService.getRef('Product');
        const snapshot = await FirebaseService.getData(productRef);
        console.log("hello productManager");

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
            this.products[childSnapshot.key] = product;
        });
    }

    async fetchCategories() {
        const categoryRef = FirebaseService.getRef('Category');
        const snapshot = await FirebaseService.getData(categoryRef);

        snapshot.forEach(childSnapshot => {
            const value = childSnapshot.val();
            const category = new Category(childSnapshot.key, value.CateName);
            this.categories[childSnapshot.key] = category;
        });
    }

    getProductsByCategory(categoryId) {
        const productsByCategory = {};
        for (const key in this.products) {
            if (this.products[key].category === categoryId) {
                productsByCategory[key] = this.products[key];
            }
        }
        return productsByCategory;
    }

    getCategoriesByType(type) {
        const normalizedType = normalizeText(type);
        return Object.values(this.categories).filter(category =>
            normalizeText(category.name).includes(normalizedType)
        );
    }
}

function formatPrice(number) {
    let formattedNumber = number.toLocaleString('vi-VN');
    return formattedNumber + "đ";
}

const listProductHTML = document.getElementById('search-results');

// Function to create submenu items
function createSubmenuItems(items, menuId, productManager) {
    const dropdownMenu = document.getElementById(menuId);
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = '#';
        a.textContent = item.name;

        a.addEventListener('click', () => {
            const categoryId = item.id;
            const products = productManager.getProductsByCategory(categoryId);

            listProductHTML.innerHTML = '';
            for (let pro of Object.values(products)) {
                
                let amount = 0;
                for(let amountSize of Object.values(pro.size))
                    amount += amountSize
                if(amount == 0)
                    continue

                const newProduct = document.createElement('div');
                newProduct.classList.add('item');
                newProduct.dataset.id = pro.productID;

                newProduct.innerHTML = `
                    <a href="detail.html?id=${pro.productID}">
                        <img class="card-img-top" src="${pro.imgURL}" alt="${pro.name}">
                    </a>
                    <h2>${pro.name}</h2>
                    <div class="price" style="font-weight: bold;">${formatPrice(pro.price)}</div>
                `;

                console.log(newProduct)
                listProductHTML.appendChild(newProduct);
            }

            if (listProductHTML.innerHTML === '') {
                listProductHTML.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
            }

            showSearchResults();
        });

        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });
}

// Function to normalize text to lowercase without accents
function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Function to process and classify categories
function processCategories(productManager) {
    const aoNamItems = productManager.getCategoriesByType('ao');
    const quanNamItems = productManager.getCategoriesByType('quan');

    createSubmenuItems(aoNamItems, 'dropdownAoNamMenu', productManager);
    createSubmenuItems(quanNamItems, 'dropdownQuanNamMenu', productManager);
}

// Fetch data from Firebase and classify categories
async function fetchAndClassifyCategories(productManager) {
    await productManager.fetchCategories();
    processCategories(productManager);
}

async function init() {
    const productManager = new ProductManager();

    await productManager.fetchProducts();
    await fetchAndClassifyCategories(productManager);
}


function showSearchResults() {
    document.getElementById('showSearch').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeSearchResults() {
    document.getElementById('showSearch').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

init();

// Gắn sự kiện lắng nghe vào form khi trang tải
window.addEventListener('DOMContentLoaded', (event) => {
    const closeSearch = document.getElementById('closeSearch');
    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchResults);
    }

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSearchResults);
    }
});
