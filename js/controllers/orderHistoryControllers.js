import FirebaseService from '../services/firebaseService.js';
import OrderHistoryView from '../views/orderHistoryView.js';
import Order from '../models/order.js';

class OrderHistoryController {
    constructor(userID) {
        this.userID = userID; // User ID được truyền vào khi khởi tạo controller
        this.view = new OrderHistoryView();
        this.loadOrderHistory();
    }

    async loadOrderHistory() {
        try {
            const ordersRef = FirebaseService.getRef('orders');
            const snapshot = await FirebaseService.getData(ordersRef);

            if (snapshot.exists()) {
                const ordersData = snapshot.val();
                const orders = [];

                Object.keys(ordersData).forEach((orderId) => {
                    const orderData = ordersData[orderId];

                    // Kiểm tra xem userID trong đơn hàng có trùng với userID hiện tại không
                    if (orderData.userID === this.userID) {
                        const order = new Order(
                            this.userID,
                            orderData.name,
                            orderData.phone,
                            orderData.email,
                            orderData.address,
                            orderData.note,
                            orderData.paymentMethod,
                            orderData.orderDate,
                            orderData.totalAmount,
                            orderData.items,
                            orderData.isIssue // Lấy giá trị isIssue từ dữ liệu
                        );
                        orders.push(order);
                    }
                });

                if (orders.length > 0) {
                    this.view.renderOrderHistory(orders);
                } else {
                    console.log('No order history found for this user.');
                }
            } else {
                console.log('No order history found.');
            }
        } catch (error) {
            console.error('Error loading order history:', error);
        }
    }

}

export default OrderHistoryController;
