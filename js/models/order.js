class Order {
    constructor(userID, name, phone, email, address, note, paymentMethod, orderDate, totalAmount, items, isIssue) {
        this.userID = userID;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.note = note;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.items = items;
        this.isIssue = isIssue;
    }
}

export default Order;
