import Utils from "./utils.js";
import InvoiceImport from "../model/invoiceImport.js";
import Supplier from "../model/supplier.js";
import Product from "../model/product.js";
class WarehouseManager {
    constructor() {
        this.utils = new Utils();
        this.invoiceImportDB = new InvoiceImport();
        this.supplierDB = new Supplier();
        this.productDB = new Product();
        this.creatTableData();
        const set = this.productDB.setAllPurchasePrice();
    }
    async creatTableData() {
        // information of supplier
        let dataSet = [];
        const allProductList = await this.productDB.getProductList();
        console.log(allProductList);
        allProductList.forEach((product) => {
            for (let key in product.item.Size) {
                if (product.item.Size[key] !== 0) {
                    let dataProduct = [product.key, product.item.Name, key, this.utils.formatToVND(product.item.PurchasePrice) || 0, this.utils.formatToVND(product.item.Price)];
                    dataProduct.push(product.item.Size[key]);
                    dataSet.push(dataProduct);
                }
            }
        })
        var table = $('#table-warehouse').DataTable({
            data: dataSet,
            columns: [
                { title: 'ID' },
                { title: 'Tên sản phẩm' },
                { title: 'Kích cỡ' },
                { title: 'Giá mua' },
                { title: 'Giá bán' },
                { title: 'Tồn kho' },
            ],
        })

    }
}

const invoiceImportManager = new WarehouseManager();