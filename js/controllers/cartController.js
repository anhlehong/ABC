import FirebaseService from '../services/firebaseService.js';
import CartView from '../views/cartView.js';
import User from '../models/user.js';
import Product from '../models/product.js';

class CartController {
    constructor() {
        this.view = new CartView();
        this.user = null;
        this.products = {}; // Sử dụng đối tượng thay vì mảng
        this.isUserFetched = false;
        this.productSoldOut = [];
    }

    async init() {
        const userId = localStorage.getItem('userID');
        if (userId !== 'null') {
            await this.fetchUser(userId); // Chờ fetchUser hoàn thành
            await this.fetchProducts();   // Chờ fetchProducts hoàn thành
            this.isUserFetched = true;
            await this.preprocessSize();
            this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
            this.view.bindChangeQuantity(this.handleChangeQuantity.bind(this));
        } else {
            console.error('User ID is missing in localStorage');
        }
    }

    async preprocessSize() {
        if (!this.isUserFetched) {
            console.error('User not fetched yet');
            return;
        }

        console.log("preprocessSize");
        let dataCart = Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity }));

        for (let prd of dataCart) {
            let [prdID, sizePrd] = prd.productID.split("-");
            let currentQuantity = this.products[`${prdID}`][`size`][`${sizePrd}`]
            if (currentQuantity <= 0) {
                let soldOut = true;
                for (let i in this.products[`${prdID}`]["size"]) {
                    let newQuantity = this.products[`${prdID}`]["size"][i];
                    if (newQuantity > 0) {
                        delete this.user.cart[prd.productID];
                        await FirebaseService.removeData(FirebaseService.getRef(`User/${this.user.id}/Cart/${prd.productID}`));
                        if (prd.quantity > newQuantity)
                            prd.quantity = newQuantity

                        let newPrdID = `${prdID}-${i}`;
                        this.user.cart[newPrdID] = prd.quantity;
                        await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);
                        soldOut = false;
                        break;
                    }
                }
                if (soldOut) {
                    await FirebaseService.removeData(FirebaseService.getRef(`User/${this.user.id}/Cart/${prd.productID}`));
                    delete this.user.cart[prd.productID];
                    this.productSoldOut.push(prdID)
                }
            } else {
                if (prd.quantity > currentQuantity) {
                    this.user.cart[prd.productID] = currentQuantity;
                    await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);
                }
            }
        }
    }

    async fetchUser(userId) {
        const userRef = FirebaseService.getRef(`User/${userId}`);
        const snapshot = await FirebaseService.getData(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            this.user = new User(
                userId,
                userData.Address,
                userData.Birth,
                userData.Cart,
                userData.CreateDate,
                userData.Email,
                userData.FullName,
                userData.Phone,
                userData.Role,
                userData.UpdateDate
            );
        } else {
            console.error('User data not found in Firebase');
        }
    }

    async fetchProducts() {
        const productRef = FirebaseService.getRef('Product');
        const snapshot = await FirebaseService.getData(productRef);

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

    async addToCart(productId) {
        if (!this.isUserFetched) {  // Kiểm tra xem người dùng đã được tải xong chưa
            console.error('User not fetched yet');
            return;
        }

        this.user.addToCart(productId);

        await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);

        if (!document.body.classList.contains('showCart')) {
            this.view.toggleCart();
        }
    }

    async handleChangeQuantity(productId, type) {
        if (!this.isUserFetched) {
            console.error('User not fetched yet');
            return;
        }
        if (type === 'plus') {
            let [prdID, sizePrd] = productId.split("-");
            if (this.user.cart[productId] == this.products[`${prdID}`][`size`][`${sizePrd}`]) {
                this.view.showAlert("Số lượng bạn yêu cầu hiện không có sẵn", "info")
                return;
            }

            this.user.addToCart(productId, 1);
        } else {
            if (this.user.cart[productId] == 1) {
                await FirebaseService.removeData(FirebaseService.getRef(`User/${this.user.id}/Cart/${productId}`));
                delete this.user.cart[productId];
            } else {
                this.user.updateCart(productId, this.user.cart[productId] - 1);
            }
        }
        await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);
        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
    }
}

export default CartController;