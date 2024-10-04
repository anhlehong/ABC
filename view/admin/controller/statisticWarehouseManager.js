import Utils from "./utils.js";
import Product from "../model/product.js";
class Statistic {
  constructor() {
    this.productDB = new Product();
    this.lineChart = document.getElementById('invetoryChart');
    const utils = new Utils();
    this.utils = utils;
    this.currentMonth = new Date().getMonth() + 1;
    this.currentYear = new Date().getFullYear();
    this.arrDays = utils.getArrAllDaysInMonth(this.currentMonth, this.currentYear);
    this.addInventoryChart();
    const excel = document.getElementById('exportExcel');
    excel.addEventListener('click', this.exportDetailInventory.bind(this));
  }
  async addInventoryChart() {
    const ctx = this.lineChart.getContext('2d');
    const productQuantities = [];
    const lstProduct = await this.productDB.getProductList();
    const productNames = [];
    lstProduct.forEach(product => {
      productNames.push(product.item.Name);
      const productSize = product.item.Size;
      let totalQuantityProduct = 0;
      for (let size in productSize) {
        totalQuantityProduct += productSize[size];
      }
      productQuantities.push(totalQuantityProduct);
    });

    //Free api from https://www.csscolorsapi.com/
    const getColorsFromAPI = async () => {
      const response = await fetch('https://www.csscolorsapi.com/api/colors', {
        method: 'GET',
      })
      const dataColors = await response.json();
      const colors = dataColors.colors.map(color => '#' + color.hex);
      return colors;
    }
    const initiateChart = async () => {
      const colors = await getColorsFromAPI();
      const salesChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: productNames,

          datasets: [{
            label: 'Số lượng sản phẩm',
            data: productQuantities,
            backgroundColor: colors,
          }]
        },
        options: {
          responsive: true,
          aspectRatio: 1.8,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Biểu đồ số lượng sản phẩm trong kho'
            }
          }
        }
      });
    }
    initiateChart();

    const graph = document.getElementById('exportGraph');
    graph.addEventListener('click', () => {
      var link = document.createElement('a');
      link.href = salesChart.toBase64Image();
      link.download = 'inventory-chart.png';
      link.click();

    });
  }

  async exportDetailInventory() {
    let dataSet = [];
    const allProductList = await this.productDB.getProductList();
    allProductList.forEach((product) => {
      for (let key in product.item.Size) {
        if (product.item.Size[key] !== 0) {
          let dataProduct = [product.key, product.item.Name, key, product.item.PurchasePrice || 0, product.item.Price];
          dataProduct.push(product.item.Size[key]);
          dataSet.push(dataProduct);
        }
      }
    })
    const matrix = [
      ["Mã sản phẩm", "Tên sản phẩm", "Kích cỡ", "Giá mua", "Giá bán", "Tồn kho"]
    ];
    matrix.push(...dataSet);
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MatrixSheet");

    XLSX.writeFile(workbook, "inventory.xlsx");
  }


  exportGraph() {
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const statistic = new Statistic();
})