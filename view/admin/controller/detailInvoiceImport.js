import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import Utils from "./utils.js";
import InvoiceImport from "../DAO/invoiceImport.js";
import Supplier from "../DAO/supplier.js";
import Product from "../DAO/product.js";
class DetailInvoiceImportManager {
  constructor() {
    this.utils = new Utils();
    this.invoiceImportDB = new InvoiceImport();
    this.supplierDB = new Supplier();
    this.productDB = new Product();
    this.getInp();
    this.getFirebaseStuff();
    this.getOptionProduct();
    this.getOptionInvoiceImport();
    this.addOptionSize();
    this.getButton();
    this.addLoopShowHide();
    this.creatTableData();
    this.getForm();
    this.orderDetailAddBtn.addEventListener('click', this.addEventAddProduct.bind(this));
    this.orderDetailIDInvoiceImportInp.addEventListener('change', this.creatTableData.bind(this));
  }
  getForm() {
    this.formOrder = document.getElementById('FormOrder');
  }
  getButton() {
    this.orderDetailAddBtn = document.getElementById('OrderDetailAddBtn');
    this.orderDetailDeleteBtn = document.getElementById('OrderDetailDeleteBtn');
    this.orderDetailUpdateBtn = document.getElementById('OrderDetailUpdateBtn');
  }
  getFirebaseStuff() {
    const firebaseConfig = {
      apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
      authDomain: "demosoftwaretechnology.firebaseapp.com",
      databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
      projectId: "demosoftwaretechnology",
      storageBucket: "demosoftwaretechnology.appspot.com",
      messagingSenderId: "375046175781",
      appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
      measurementId: "G-120GXQ1F6L"
    };

    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase();

  }
  async getOptionInvoiceImport() {
    const data = await this.invoiceImportDB.getInvoiceImportList();
    data.forEach((item) => {
      let option = document.createElement('option');
      option.innerHTML = item.key;
      option.value = item.key;
      this.orderDetailIDInvoiceImportInp.appendChild(option);
    })
  }
  getOptionProduct() {
    const productRef = ref(this.db, 'Product');
    get(productRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
          let option = document.createElement('option');
          option.innerHTML = data[key].Name;
          option.value = key;
          this.orderDetailAvailableNameInp.appendChild(option);
        }
      }
    })
  }
  addOptionSize() {
    const SIZE = ['S', 'M', 'L', 'XL', 'XXL'];
    SIZE.forEach((size) => {
      let option = document.createElement('option');
      option.innerHTML = size;
      option.value = size;
      this.orderDetailSizeInp.appendChild(option);
    })
  }

  getInp() {
    this.address = document.getElementById('Address');
    this.supplier = document.getElementById('Supplier');
    this.phone = document.getElementById('Phone');
    this.orderDetailSizeInp = document.getElementById('OrderDetailSizeInp');
    this.orderDetailIDInvoiceImportInp = document.getElementById('OrderDetailIDInvoiceImportInp');
    this.orderDetailIDProductInp = document.getElementById('OrderDetailIDProductInp');
    this.orderDetailNewNameInp = document.getElementById('OrderDetailNewNameInp');
    this.orderDetailAvailableNameInp = document.getElementById('OrderDetailAvailableNameInp');
    this.orderDetailQuantityInp = document.getElementById('OrderDetailQuantityInp');
    this.orderDetailUnitPriceInp = document.getElementById('OrderDetailUnitPriceInp');
    this.orderDetailAmountInp = document.getElementById('OrderDetailAmountInp');
  }
  async creatTableData() {
    // information of supplier
    const dataInvoiceImport = await this.invoiceImportDB.querryInvoiceImportBasedOnID(this.orderDetailIDInvoiceImportInp.value);
    const dataSupplier = await this.supplierDB.querrySupplierBasedOnID(dataInvoiceImport.Supplier) || null; 
    this.address.innerHTML = dataSupplier?.Address || '';
    this.supplier.innerHTML = dataSupplier?.Name  || '';
    this.phone.innerHTML = dataSupplier?.Phone || '';

    let dataSet = [];
    let dataInvoiceImportItems = dataInvoiceImport.Items || {};

    for(let key in dataInvoiceImportItems){
      const [productID, size] = key.split('-');
      let productData = await this.productDB.querryProductByID(productID);
      let productName = productData.Name;
      dataSet.push([
        productID,
        productName,
        size,
        dataInvoiceImportItems[key].Quantity,
        this.utils.formatToVND(dataInvoiceImportItems[key].PurchasePrice),
        this.utils.formatToVND(dataInvoiceImportItems[key].Quantity * dataInvoiceImportItems[key].PurchasePrice),
      ])
    }
    if($.fn.DataTable.isDataTable('#table-order-detail'))
      $('#table-order-detail').DataTable().destroy();
    
    var table = $('#table-order-detail').DataTable({
      data: dataSet,
      columns: [
        { title: 'ID' },
        { title: 'Tên sản phẩm' },
        { title: 'Kích cỡ ' },
        { title: 'Số lượng' },
        { title: 'Giá đơn vị' },
        { title: 'Thành tiền' }
      ],
      rowCallback: (row, data) => {
        $(row).on('click', () => {
          // this.createTableOrderDetail(data[0], data);
        })
      }
    })

    // let dbref = ref(this.db);
    // let dataSet = [];
    // get(child(dbref, 'InvoiceImport')).then((snapshot) => {
    //   snapshot.forEach((childSnapshot) => {
    //     let value = childSnapshot.val();
    //     dataSet.push([
    //       value.ID,
    //       value.Date,
    //       value.Supplier,
    //       value.Note,
    //       value.PaymentMethod
    //     ])
    //   })
    //   console.log(dataSet);
    //   var table = $('#table-order').DataTable({
    //     data: dataSet,
    //     columns: [
    //       { title: 'ID' },
    //       { title: 'Ngày mua' },
    //       { title: 'Nhà cung cấp' },
    //       { title: 'Ghi chú' },
    //       { title: 'PTTT' }
    //     ],
    //     rowCallback: (row, data) => {
    //       $(row).on('click', () => {
    //         this.createTableOrderDetail(data[0], data); 
    //       })
    //     }
    //   })
    // })
    // const data = await this.invoiceImportDB.getInvoiceImportList(); 
    // data.forEach((subData) => {
    //   dataSet.push([
    //     subData.item
    //   ])
    // })
  }
  // createTableOrderDetail(orderID, data) {
  //   this.IDInp.value = data[0];
  //   this.dateInp.value = data[1];
  //   this.supplierInp.value = data[2];
  //   this.noteInp.value = data[3];
  //   this.paymentMethodInp.value = data[4];
  //   this.getInformationSupplier(data[2]);

  //   this.orderDetailIDInvoiceInp.value = data[0];
  // }
  addLoopShowHide() {
    setInterval(() => {
      if (this.orderDetailAvailableNameInp.value === '' && this.orderDetailNewNameInp.value === '') {
        this.orderDetailNewNameInp.disabled = false;
        this.orderDetailAvailableNameInp.disabled = false;
      }
      else if (this.orderDetailAvailableNameInp.value !== '' && this.orderDetailNewNameInp.value === '') {
        this.orderDetailNewNameInp.disabled = true;
        this.orderDetailAvailableNameInp.disabled = false;
      }
      else if (this.orderDetailAvailableNameInp.value === '' && this.orderDetailNewNameInp.value !== '') {
        this.orderDetailNewNameInp.disabled = false;
        this.orderDetailAvailableNameInp.disabled = true;
      }

    }, 500);
  }
  async addEventAddProduct() {
    const dbref = ref(this.db);
    if (this.orderDetailNewNameInp.value !== '') {
      const Size = {
        L: 0,
        M: 0,
        S: 0,
        XL: 0,
        XXL: 0
      }
      Size[this.orderDetailSizeInp.value] = Number(this.orderDetailQuantityInp.value);
      const data = {
        Name: this.orderDetailNewNameInp.value,
        Price: 0,
        PurchasePrice: Number(this.orderDetailUnitPriceInp.value),
        Promotion: '',
        Size: Size,
        Category: '',
        Images: '',
        CreateDate: this.utils.getCurrentDay(),
        UpdateDate: this.utils.getCurrentDay(),
        Detail: '',
        Description: ''
      }
      await this.productDB.setProduct(data);
      // update invoice import
      const currentProductID = await this.productDB.getCurrentProductID();
      const productIDSize = currentProductID + '-' + this.orderDetailSizeInp.value;
      const invoiceImportData = await this.invoiceImportDB.querryInvoiceImportBasedOnID(this.orderDetailIDInvoiceImportInp.value);
      const items = invoiceImportData.Items || {};
      items[productIDSize] = {
        Quantity: Number(this.orderDetailQuantityInp.value),
        PurchasePrice: Number(this.orderDetailUnitPriceInp.value),
      }
      await this.invoiceImportDB.updateInvoiceImport(this.orderDetailIDInvoiceImportInp.value, {
        Items: items
      })
    }
    else {
      const productData = await this.productDB.querryProductByID(this.orderDetailAvailableNameInp.value);
      const productSize = productData.Size;
      productSize[this.orderDetailSizeInp.value] += Number(this.orderDetailQuantityInp.value);
      await this.productDB.updateProduct(this.orderDetailAvailableNameInp.value, {
        Size: productSize,
        PurchasePrice: Number(this.orderDetailUnitPriceInp.value)
      })

      // update invoice import
      const productIDSize = this.orderDetailAvailableNameInp.value + '-' + this.orderDetailSizeInp.value;
      const invoiceImportData = await this.invoiceImportDB.querryInvoiceImportBasedOnID(this.orderDetailIDInvoiceImportInp.value);
      const items = invoiceImportData.Items || {};
      items[productIDSize] = {
        Quantity: Number(this.orderDetailQuantityInp.value),
        PurchasePrice: Number(this.orderDetailUnitPriceInp.value),
      }
      await this.invoiceImportDB.updateInvoiceImport(this.orderDetailIDInvoiceImportInp.value, {
        Items: items
      })
    }
  }
}

const invoiceImportManager = new DetailInvoiceImportManager();