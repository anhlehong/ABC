import ProductListController from './controllers/productListController.js';
import CartController from './controllers/cartController.js';
import { signInDialog } from '../public/js/popUpAction.js';


document.addEventListener('DOMContentLoaded', async () => {
    const productListController = new ProductListController();
    const cartController = new CartController();

    await cartController.init();  // Chờ cho việc khởi tạo hoàn thành

    const isLoggedIn = () => {
        const userId = localStorage.getItem('userID');
        return userId !== 'null';
    };

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

        }
        else {
            signInDialog.showModal();
            signInDialog.addEventListener('close', () => {
                if (isLoggedIn()) {
                    cartController.view.toggleCart();
                }
            }, { once: true });
        }
    })
});