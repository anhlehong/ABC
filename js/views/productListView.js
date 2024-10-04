class ProductListView {
    constructor() {
        this.listProductHTML = document.getElementById('listProduct');
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + "đ";
    }
 
    renderProducts(products) {
        console.log(" renderProducts(products): ", products)
        this.listProductHTML.innerHTML = '';

        // Lặp qua các giá trị của đối tượng products
        Object.values(products).forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;

            newProduct.innerHTML = `
                <a href="detail.html?id=${product.id}">
                    <img class="card-img-top" src="${product.imgURL}" alt="${product.name}">
                </a>
                <h2>${product.name}</h2>
                <div class="price" style="font-weight: bold;">${this.formatPrice(product.price)}</div>
            `;
            this.listProductHTML.appendChild(newProduct);
        });
    }
}

export default ProductListView;
