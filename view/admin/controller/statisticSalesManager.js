import Order from "./order.js"
import Utils from "./utils.js";
class Statistic {
  constructor() {
    this.lineChart = document.getElementById('salesChart');
    const utils = new Utils();
    this.order = new Order();
    this.currentMonth = new Date().getMonth() + 1;
    this.currentYear = new Date().getFullYear();
    this.arrDays = utils.getArrAllDaysInMonth(this.currentMonth, this.currentYear);
    this.getSalesData();

    const excel = document.getElementById('exportExcel');
    excel.addEventListener('click', this.exportDetailSales);
  }
  async getSalesData() {
    try {
      const salesData = await this.order.getArrSalesOnEachDayInOneMonth(this.currentMonth, this.currentYear);

      this.addSalesChart(salesData);
    } catch (err) {
      console.log(err);
    }
  }
  addSalesChart(data) {
    const ctx = this.lineChart.getContext('2d');


    const salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.arrDays,
        datasets: [{
          label: 'Doanh thu',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Biểu đồ doanh thu theo ngày tại ${this.currentMonth}/${this.currentYear}`,
          }
        }

      }
    });

    const graph = document.getElementById('exportGraph');
    graph.addEventListener('click', () => {
      var link = document.createElement('a');
      link.href = salesChart.toBase64Image();
      link.download = 'sales-chart.png';
      link.click();

    });
  }

  async exportDetailSales() {
    //get data from order
    //BUG this.order is not recognized
    // console.log(this.order)
    const orders = new Order();
    const data = await orders.getArrProduct();
    const matrix = [
      ["Mã sản phẩm", "Tên sản phẩm", "Số lượng", "Tổng tiền"]
    ];
    for (let item in data.arrProduct) {
      const key = item;
      const value = data.arrProduct[item];
      matrix.push([key, value[0], value[1], value[2]]);
    }
    matrix.push(["Tổng doanh thu", data.totalSales]);
    matrix.push(["Sản phẩm có tổng doanh thu cao nhất:", data.highestSaleOnProduct.id, data.highestSaleOnProduct.name, data.highestSaleOnProduct.total_price]);
    matrix.push(["Sản phẩm có số lượng bán cao nhất:", data.highestSaleQuantityOnProduct.id, data.highestSaleQuantityOnProduct.name, data.highestSaleQuantityOnProduct.quantity]);
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MatrixSheet");

    XLSX.writeFile(workbook, "sales.xlsx");
  }


  exportGraph() {
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const statistic = new Statistic();
})