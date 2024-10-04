class User {
    constructor(id, address, birth, cart, createDate, email, fullName, phone, role, updateDate) {
        this.id = id;
        this.address = address;
        this.birth = birth;
        this.cart = cart || {};  // Giỏ hàng, mặc định là object rỗng nếu không có
        this.createDate = createDate;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.updateDate = updateDate;
    }

    // Phương thức để thêm sản phẩm vào giỏ hàng
    addToCart(productId, quantity = 1) {
        if (this.cart[productId]) {
            this.cart[productId] += quantity;
        } else {
            this.cart[productId] = quantity;
        }
    }

    // Phương thức để cập nhật số lượng sản phẩm trong giỏ hàng
    updateCart(productId, quantity) {
        if (quantity <= 0) {
            delete this.cart[productId];
        } else {
            this.cart[productId] = quantity;
        }
    }
}

export default User;
