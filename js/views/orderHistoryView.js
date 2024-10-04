class OrderHistoryView {
    constructor() {
        this.orderHistoryTable = document.getElementById('listOrderHistory');
        this.paginationElement = document.getElementById('pagination');
        this.ordersPerPage = 5; // Số lượng đơn hàng hiển thị trên mỗi trang
        this.orders = []; // Thêm thuộc tính để lưu trữ danh sách orders
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + " VNĐ";
    }

    renderOrderHistory(orders, currentPage = 1) {
        this.orders = orders; // Lưu trữ danh sách orders để sử dụng sau này

        const startIndex = (currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const paginatedOrders = orders.slice(startIndex, endIndex);

        let orderHistoryHTML = '';

        paginatedOrders.forEach((order, index) => {
            orderHistoryHTML += `
                <tr data-order-id="${index}">
                    <th scope="row">${startIndex + index + 1}</th>
                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>${this.formatPrice(Number(order.totalAmount))}</td>
                    <td>${this.getOrderStatus(order.isIssue)}</td>
                </tr>
            `;
        });

        this.orderHistoryTable.innerHTML = orderHistoryHTML;

        // Thêm sự kiện click vào mỗi dòng
        paginatedOrders.forEach((order, index) => {
            const orderRow = document.querySelector(`tr[data-order-id="${index}"]`);
            orderRow.addEventListener('click', () => {
                this.renderOrderDetail(order);
            });
        });

        this.renderPagination(orders.length, currentPage);
    }

    renderPagination(totalOrders, currentPage) {
        const totalPages = Math.ceil(totalOrders / this.ordersPerPage);
        let paginationHTML = '';

        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;

        this.paginationElement.innerHTML = paginationHTML;

        // Thêm sự kiện click cho pagination
        const pageLinks = this.paginationElement.querySelectorAll('.page-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page > 0 && page <= totalPages) {
                    this.renderOrderHistory(this.orders, page); // Sử dụng this.orders để truy cập danh sách orders
                }
            });
        });
    }

    renderOrderDetail(order) {
        const detailSection = document.getElementById('listDetailOrderHistory');

        detailSection.innerHTML = `
            <h3 style="padding-top: 10px; padding-bottom: 10px;">CHI TIẾT HÓA ĐƠN</h3>
            <hr style="margin: 0px; padding-bottom: 10px;">
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Họ tên:&nbsp;</span><span>${order.name}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Email:&nbsp;</span><span>${order.email}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Số điện thoại:&nbsp;</span><span>${order.phone}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Địa chỉ:&nbsp;</span><span>${order.address}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Hình Thức thanh toán:&nbsp;</span><span>${order.paymentMethod}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Ngày tạo hóa đơn:&nbsp;</span><span>${new Date(order.orderDate).toLocaleDateString()}</span></div>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Ghi chú:&nbsp;</span><span>${order.note}</span></div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Sản phẩm</th>
                        <th scope="col">Kích thước</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Đơn giá</th>
                        <th scope="col">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.renderOrderItems(order.items)}
                </tbody>
            </table>
            <div style="padding-bottom: 15px;"><span style="font-weight: bold;">Tổng tiền:&nbsp;</span><span><b>${this.formatPrice(Number(order.totalAmount))}</b></span></div>
        `;
    }

    renderOrderItems(items) {
        let itemsHTML = '';
        let index = 1;

        Object.keys(items).forEach(key => {
            const item = items[key];
            console.log("item.unit_price: ", typeof (item.unit_price))
            itemsHTML += `
                <tr>
                    <td>${index++}</td>
                    <td>${item.item_name}</td>
                    <td>${item.size}</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatPrice(Number(item.unit_price))}</td>
                    <td>${this.formatPrice(Number(item.total_price))}</td>
                </tr>
            `;
        });

        return itemsHTML;
    }

    getOrderStatus(isIssue) {
        return isIssue ? 'Đã xuất kho' : 'Chưa xuất kho';
    }
}

export default OrderHistoryView;
