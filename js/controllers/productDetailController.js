import FirebaseService from '../services/firebaseService.js';
import ProductDetailView from '../views/productDetailView.js';
import Product from '../models/product.js';

class ProductDetailController {
    constructor() {
        this.view = new ProductDetailView();
        this.productId = this.getProductIdFromURL();
    }

    // Tách phương thức fetch ra để gọi nó sau khi controller được khởi tạo
    async init() {
        await this.fetchProductDetails();  // Chờ fetch dữ liệu sản phẩm hoàn tất
    }

    getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async fetchProductDetails() {
        try {
            const productRef = FirebaseService.getRef(`Product/${this.productId}`);
            const snapshot = await FirebaseService.getData(productRef);
            console.log("this.productId: ", this.productId);

            if (snapshot.exists()) {
                const productData = snapshot.val();
                const product = new Product(
                    this.productId,
                    productData.Name,
                    productData.Price,
                    productData.Images ? Object.values(productData.Images)[0].ImgURL : '',
                    productData.Category,
                    productData.CreateDate,
                    productData.Description,
                    productData.Detail,
                    productData.ProductID,
                    productData.Promotion,
                    productData.Size,
                    productData.UpdateDate
                );
                // Render chi tiết sản phẩm sau khi đã fetch dữ liệu
                this.view.renderProductDetails(product);
            } else {
                console.error('Product data not found in Firebase');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }
}

export default ProductDetailController;
