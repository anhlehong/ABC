import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import ProductDB from "../model/product.js";
import UserDB from '../model/user.js';
import InvoiceImportDB from '../model/invoiceImport.js';
import Utils from "./utils.js";
class InvoiceImportManager {
  constructor() {
    this.utils = new Utils();
    this.getFirebaseStuff();
    this.getButton();
    this.getInp();
    this.getForm();
    this.getTotal();
    this.invoiceImportDB = new InvoiceImportDB();
    this.reader = new FileReader();
    this.productDB = new ProductDB();
    this.userDB = new UserDB();
    this.loadHandlerExcel = false;
    this.userDB.trackUserLogin();
    this.excelIpt.addEventListener('change', this.buyGoods.bind(this));
    this.infoBtn.addEventListener('click', this.exportExcelFile.bind(this));
    this.addBtn.addEventListener('click', async () => {
      const lstUsers = await this.userDB.getUserList();
    });
    this.creatTableData();
    this.InforBtn.addEventListener('mouseover', () => {
      this.TxtInfor.style.display = 'inline-block';
    });
    this.InforBtn.addEventListener('mouseout', () => {
      this.TxtInfor.style.display = 'none';
    });
  }
  getForm() {
    this.formOrder = document.getElementById('FormOrder');
  }
  getButton() {
    //order
    this.addBtn = document.getElementById('AddBtn');
    this.infoBtn = document.getElementById('InfoBtn');
    this.TxtInfor = document.getElementById('txt__infor');
    this.InforBtn = document.getElementById('btn__infor');
    // this.deleteBtn = document.getElementById('DeleteBtn');
    // this.updateBtn = document.getElementById('UpdateBtn');
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
  getInp() {
    //order
    this.excelIpt = document.getElementById('ExcelIpt');
  }
  getTotal() {
    this.totalFull = document.getElementById('total-full');
  }
  getInformationSupplier(supplierID) {
    this.address = document.getElementById('Address');
    this.supplier = document.getElementById('Supplier');
    this.phone = document.getElementById('Phone');

    const supplierRef = ref(this.db, 'Supplier/' + supplierID);
    get(supplierRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.address.innerHTML = data.Address;
        this.phone.innerHTML = data.Phone;
        this.supplier.innerHTML = data.Name;
      }
    })
  }
  async creatTableData() {
    let lstDataInvoiceImport = await this.invoiceImportDB.getInvoiceImportList();
    let dataSet = [];
    lstDataInvoiceImport.forEach((item) => {
      dataSet.push([item.key, item.item.Date, item.item.Note, item.item.PaymentMethod, item.item.userFullName]);
    })
    var table = $('#table-order').DataTable({
      data: dataSet,
      columns: [
        { title: 'ID' },
        { title: 'Ngày mua' },
        { title: 'Ghi chú' },
        { title: 'PTTT' },
        { title: 'Người nhập' },
        // {title: 'ID thủ kho'}
      ],
      rowCallback: (row, data) => {
        $(row).on('click', () => {
          this.createTableOrderDetail(data, lstDataInvoiceImport);
        })
      }
    })

  }
  async createTableOrderDetail(dataFromOrder, lstDataInvoiceImport) {
    $('#table-order-detail').DataTable().clear().destroy();
    const currentDataInvoiceImport = lstDataInvoiceImport.find((item) => (item.key === dataFromOrder[0]));
    const dataSet = []
    for (let key in currentDataInvoiceImport.item.Items) {
      const [idsp, size] = key.split('-');
      const product = await this.productDB.querryProductByID(idsp);
      const productName = product.Name;
      const price = this.utils.formatToVND(currentDataInvoiceImport.item.Items[key].PurchasePrice);
      const dataTableOrderDetail = [idsp, productName, currentDataInvoiceImport.item.Items[key].Quantity, size, price, currentDataInvoiceImport.item.Items[key].SupplierName];
      dataSet.push(dataTableOrderDetail);
    }
    const configTable = {
      data: dataSet,
      columns: [
        { title: 'IDSP' },
        { title: 'Tên sản phẩm' },
        { title: 'Số lượng' },
        { title: 'Kích cỡ' },
        { title: 'Đơn giá' },
        { title: 'Tên nhà cung cấp' },
      ]
    }
    var tableDetail = $('#table-order-detail').DataTable(configTable);
    const totalAmount = this.utils.formatToVND(currentDataInvoiceImport.item.TotalAmount);
    this.totalFull.innerHTML = totalAmount;
  }
  exportExcelFile() {
    console.log('export');
    window.location.href = "./hoa-don-nhap-hang.xlsx";
    window.reload();
  }


  buyGoods(e) {
    const files = this.excelIpt.files;
    const latestFile = this.excelIpt.files[files.length - 1];
    if (latestFile) {
      const loadHandler = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const dataHeader = {
          idsp: 'IDSP',
          nameProduct: 'Tên sản phẩm',
          idncc: 'IDNCC',
          nameSupplier: 'Tên nhà cung cấp',
          quantity: 'Số lượng',
          size: 'Kích cỡ',
          unitPrice: 'Đơn giá',
          amount: 'Thành tiền',
          note: 'Ghi chú hóa đơn',
          paymentOption: 'Phương thức thanh toán',
        }
        const objUser = await this.userDB.querryUser(localStorage.getItem('userID'));
        const dataInvoiceImport = {
          Date: this.utils.getCurrentDay(),
          Note: sheetData[0][dataHeader.note],
          PaymentMethod: sheetData[0][dataHeader.paymentOption],
          userID: localStorage.getItem('userID'),
          userFullName: objUser.FullName,
        }
        let totalAmount = 0;
        const Items = {};
        for (const item of sheetData) {
          //if product exist, store quantity of each size in variable for both productDB to be updated and invoiceImportDB to be set
          const amount = item[dataHeader.quantity] * item[dataHeader.unitPrice];
          totalAmount += amount;
          if (item[dataHeader.idsp]) {
            // for invoice import db
            Items[`${item[dataHeader.idsp]}-${item[dataHeader.size]}`] = {
              Quantity: item[dataHeader.quantity],
              PurchasePrice: item[dataHeader.unitPrice],
              SupplierID: item[dataHeader.idncc],
              SupplierName: item[dataHeader.nameSupplier],
            }
            //for product db
            const size = {
              size: item[dataHeader.size],
              quantity: item[dataHeader.quantity],
            }
            await this.productDB.updateQuantityBasedOnSize(item[dataHeader.idsp], size);
          }
          else {
            // for invoice import db
            const nextProductID = await this.productDB.getNextProductID();
            Items[`${nextProductID}-${item[dataHeader.size]}`] = {
              Quantity: item[dataHeader.quantity],
              PurchasePrice: item[dataHeader.unitPrice],
              SupplierID: item[dataHeader.idncc],
              SupplierName: item[dataHeader.nameSupplier],
            }
            //for product db
            const Size = {
              L: 0,
              M: 0,
              S: 0,
              XL: 0,
              XXL: 0,
            }
            Size[`${item[dataHeader.size]}`] = item[dataHeader.quantity];
            const dataProduct = {
              Name: item[dataHeader.nameProduct],
              Category: '',
              Price: 0,
              PurchasePrice: item[dataHeader.unitPrice],
              Promotion: 0,
              Size: Size,
              Description: '',
              Detail: '',
              Images: '',
              CreateDate: this.utils.getCurrentDay(),
              UpdateDate: this.utils.getCurrentDay()
            }
            await this.productDB.setProduct(dataProduct);
          }
        }
        dataInvoiceImport.Items = Items;
        dataInvoiceImport.TotalAmount = totalAmount;
        await this.invoiceImportDB.addInvoiceImport(dataInvoiceImport);
      }

      if (!this.loadHandlerExcel) {
        this.loadHandlerExcel = true;
        this.reader.addEventListener('load', loadHandler);
      }
      this.reader.readAsArrayBuffer(latestFile);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const invoiceImportManager = new InvoiceImportManager();
})