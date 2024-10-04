import Utils from "./utils.js";
import InvoiceImport from "../model/invoiceImport.js";
import Supplier from "../model/supplier.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
import InvoiceExport from "../model/invoiceExport.js";
class IssueManager {
    constructor() {
        this.utils = new Utils();
        this.invoiceImportDB = new InvoiceImport();
        this.supplierDB = new Supplier();
        this.productDB = new Product();
        this.orderDB = new Order();
        this.invoiceExportDB = new InvoiceExport();
        this.getTag();
        this.createTable();
    }
    getTag(){
        this.OrderDetail = document.getElementById('order-detail');
        this.orderID = document.getElementById('OrderID');
        this.warehouse = document.getElementById('WarehouseName'); 
        this.warehouseID = document.getElementById('WarehouseID');
        this.ODID = document.getElementById('ODID');
        this.Customer = document.getElementById('Customer');
        this.Address = document.getElementById('Address');
        this.Phone = document.getElementById('Phone');
        this.getTotal = document.getElementById('total-full');

    }
    async createTable() {
        let dataSet = [];
        let objData = []
        let invoiceExportList = await this.invoiceExportDB.getInvoiceExportList();
        invoiceExportList.forEach((invoiceExport) => {
            dataSet.push([invoiceExport.key, invoiceExport.item['ZIPIssue'], invoiceExport.item['dateIssue'] ]);
            objData.push(invoiceExport.item);
        });
        $('#table-order').DataTable({
            data: dataSet,
            columns: [
                { title: "ID xuất kho" },
                { title: "Mã bưu điện" },
                { title: "Ngày xuất hóa đơn" },
            ],
            rowCallback: (row, data) => {
               
                $(row).on('click', () => {
                    this.handleRowClick(row, data, objData);
                    console.log(objData);
                });
            }
        });
    }
    handleRowClick(row, data, objData) {
        let indexRow = row._DT_RowIndex;
        $('#order-detail tbody').remove();
        this.ODID.innerText = data[0];
        let totalFull = 0;
        this.warehouse.innerText = objData[indexRow].userFullName;
        this.orderID.innerText = objData[indexRow].orderID;
        this.warehouseID.innerText = objData[indexRow].userID;
        this.Customer.innerText = objData[indexRow].name;
        this.Address.innerText = objData[indexRow].address;
        this.Phone.innerText = objData[indexRow].phone;
        const details = objData[indexRow].items;
        for (let product in details) {
            let id = document.createElement('th');
            let namePro = document.createElement('td');
            let quantity = document.createElement('td');
            let price = document.createElement('td');
            let total = document.createElement('td');
            id.innerHTML = product;
            quantity.innerHTML = details[product]['quantity'];
            namePro.innerHTML = details[product]['item_name'];
            price.innerHTML = this.utils.formatToVND(details[product]['unit_price']);
            total.innerHTML = this.utils.formatToVND(details[product]['total_price']);
            totalFull += details[product]['total_price'];
            this.getTotal.innerHTML = this.utils.formatToVND(totalFull);

            let tr = document.createElement('tr');
            tr.append(id, namePro, quantity, price, total);
            let tbody = document.createElement('tbody');
            tbody.appendChild(tr);
            this.OrderDetail.append(tbody);
        }
    }
}

const invoiceImportManager = new IssueManager();