import OrderHistoryController from './controllers/orderHistoryControllers.js';

document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = () => {
        const userId = localStorage.getItem('userID');
        return userId !== 'null';
    };

    if (isLoggedIn) {
        const userId = localStorage.getItem('userID');
        const orderHistoryController = new OrderHistoryController(userId);
    }
});
