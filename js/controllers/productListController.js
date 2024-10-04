import FirebaseService from '../services/firebaseService.js';
import ProductListView from '../views/productListView.js';
import Product from '../models/product.js';
import CartController from './cartController.js';

class ProductListController {
    constructor() {
        this.view = new ProductListView();
        this.products = {}; // Sử dụng đối tượng thay vì mảng

        this.init();
    }

    async init() {
        await this.fetchProducts();
        this.preprocessSize();
        this.view.renderProducts(this.products);
    }

    preprocessSize() {
        console.log("preprocessSize productListController");
        Object.values(this.products).forEach(prd => {
            let soldOut = true;
            if (prd.size) {
                for (let amount of Object.values(prd.size)) {
                    if (amount > 0) {
                        soldOut = false;
                        break;
                    }
                }
            }
            if (soldOut) {
                delete this.products[prd.id];
            }
        });
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
}

export default ProductListController;
