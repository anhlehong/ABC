class CartView {
    constructor() {
        this.listCartHTML = document.querySelector('.listCart');
        this.iconCartSpan = document.querySelector('.icon-cart span');
        this.iconCart = document.querySelector('.icon-cart');
        this.closeBtn = document.querySelector('.cartTab .close');
        this.checkoutBtn = document.querySelector('.cartTab .makePayment')
        this.body = document.querySelector('body');
        this.alertPlaceholder = document.getElementById('alertPlaceholder');

        this.closeBtn.addEventListener('click', this.closeCart.bind(this));
        this.checkoutBtn.addEventListener('click', this.openPayment.bind(this))
    }


    showAlert(message, type) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML =
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        const alertElement = wrapper.firstElementChild;
        this.alertPlaceholder.append(alertElement);

        // Remove the alert after 3 seconds
        setTimeout(() => {
            alertElement.classList.remove('show');
            alertElement.classList.add('fade');
            setTimeout(() => alertElement.remove(), 150); // Wait for fade out transition
        }, 3000);
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + "đ";
    }

    renderCart(cartItems, products) {
        this.listCartHTML.innerHTML = '';
        let totalQuantity = 0;

        cartItems.forEach(cart => {
            totalQuantity += cart.quantity;
            let product = null;
            let [proID, size] = cart.productID.split("-")

            product = products[proID]
            if (!product) return;

            const newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.productID;
            newCart.style.marginTop = "5px"

            newCart.innerHTML = `
            <div class="image">
                <img src="${product.imgURL}" alt="${product.name}" style="width: 50px">
            </div>
            <div class="name" style = "width:130px;">
                <a href="detail.html?id=${proID}" style="color: #eeeeee; text-decoration: none;">
                    ${product.name} <br> Size: ${size}
                </a>
            </div>
            <div class="totalPrice" style = "margin-left: -15px; font-weight: bold;">${this.formatPrice(product.price * cart.quantity)}</div>
            <div class="quantity" style="width: 170px;">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
            this.listCartHTML.appendChild(newCart);
        });
        this.iconCartSpan.innerText = totalQuantity;
    }

    toggleCart() {
        this.body.classList.toggle('showCart');
    }

    closeCart() {
        this.body.classList.remove('showCart');
    }

    openPayment() {
        window.location.href = './pageCart.html'
    }

    bindChangeQuantity(handler) {
        this.listCartHTML.addEventListener('click', (event) => {
            if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
                const productId = event.target.closest('.item').dataset.id;
                const type = event.target.classList.contains('plus') ? 'plus' : 'minus';
                handler(productId, type);
            }
        });
    }
}

export default CartView;
