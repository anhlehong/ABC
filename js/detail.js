import CartController from './controllers/cartController.js';
import ProductDetailController from './controllers/productDetailController.js';
import { signInDialog } from '../public/js/popUpAction.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartController = new CartController();
    const productDetailController = new ProductDetailController();

    await cartController.init();  // Chờ cho việc khởi tạo hoàn thành

    document.getElementById('showSizeGuide').addEventListener('click', function () {
        document.getElementById('sizeGuide').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    });

    document.getElementById('closeSizeGuide').addEventListener('click', function () {
        document.getElementById('sizeGuide').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });

    const isLoggedIn = () => {
        const userId = localStorage.getItem('userID');
        return userId !== 'null';
    };
 
    document.getElementById('sizeList').addEventListener('click', function (event) {
        // Kiểm tra nếu phần tử có attribute data-size
        if (event.target && event.target.dataset.size) {
            // Lấy tất cả các phần tử li có class 'size-item'
            const sizeItems = sizeList.getElementsByClassName('size-item');

            // Lọc ra các phần tử không có thuộc tính 'style'
            for (let item of sizeItems) {
                if (!item.style.pointerEvents || item.style.pointerEvents !== 'none') {
                    item.removeAttribute('id');
                    item.style.backgroundColor = '#efefef';
                    item.style.color = 'black';
                }
            }

            // Thay đổi id và màu của phần tử được click
            event.target.id = 'selected';
            event.target.style.backgroundColor = 'black';
            event.target.style.color = 'white';

            // In ra kích thước đã chọn
            console.log('Selected size:', event.target.dataset.size);
        }
    });


    document.getElementById('addCart').addEventListener('click', function (event) {
        let productId = this.getAttribute('data-id');
        let size = "";
        console.log('Product ID:', productId);

        const selectedSize = document.getElementById('selected');
        if (!selectedSize) {
            document.getElementById('requestChoseSize').style.display = 'block';
            document.getElementById('requestChoseSize').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        } else {
            document.getElementById('requestChoseSize').style.display = 'none';
            size = selectedSize.dataset.size;
        }

        console.log("size: ", size)
        if (isLoggedIn()) {
            cartController.addToCart(`${productId}-${size}`);
        } else {
            signInDialog.showModal();
            signInDialog.addEventListener('close', () => {
                if (isLoggedIn()) {
                    cartController.addToCart(productId);
                }
            }, { once: true });
        }
    });

    const iconCart = document.querySelector('.icon-cart');
    iconCart.addEventListener('click', () => {
        if (isLoggedIn()) {
            cartController.view.toggleCart();
        } else {
            signInDialog.showModal();
            signInDialog.addEventListener('close', () => {
                if (isLoggedIn()) {
                    cartController.view.toggleCart();
                }
            }, { once: true });
        }
    });

    let userProfile = document.getElementById('user__profile');
    let path = '';

    userProfile.addEventListener('click', () => {
        if (isLoggedIn()) {
            console.log('user');
            path = "user_profile_UI.html";
            window.location.href = path;

        } else {
            signInDialog.showModal();
            signInDialog.addEventListener('close', () => {
                if (isLoggedIn()) {
                    cartController.view.toggleCart();
                }
            }, { once: true });
        }
    });
});
