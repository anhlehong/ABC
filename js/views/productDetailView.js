class ProductDetailView {
    constructor() {
        this.productWrapper = document.getElementById('product-single-wrapper');
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + "đ";
    }
    
    renderProductDetails(product) {
        let imagesHtml = '';
        if (product.imgURL) {
            imagesHtml = `<img class="card-img-top" src="${product.imgURL}" alt="${product.name}">`;
        }

        let sizesHtml = '';
        if (product.size) {
            for (let size in product.size) {
                if (product.size[size]) {
                    sizesHtml += `<li class="size-item" data-size="${size}">${size}</li>`;
                }
                else {
                    sizesHtml += `<li class="size-item" data-size="${size}" style="pointer-events: none; color: white;">${size}</li>`;
                }
            }
        }
        const productHTML = `
            <div class="product-image card">
                ${imagesHtml}
            </div>
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <div class="price">${this.formatPrice(product.price)}</div>
                <div class="size-product d-flex flex-column">
                    <div class="size-top d-flex justify-content-between">
                        <p class="card-subtitle">Kích thước:</p>
                        <a href="#" id="showSizeGuide">Hướng dẫn chọn size</a>
                    </div>
                    <div class="size-option">
                        <ul id="sizeList" style="margin: 10px; padding: 0px;">
                            ${sizesHtml}
                        </ul>
                        <div style="color: red; display: none;" id="requestChoseSize">
                            Vui lòng chọn kích thước
                        </div>
                    </div>
                </div>
                <div class="addCart d-flex product-detail" data-id="${product.id}"  style="cursor: pointer;" id="addCart">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/>
                    </svg>                              
                    <p class="card-text">Thêm vào giỏ hàng</p>
                </div>
                <div class="d-flex aftee">
                    <div class="col-2 align-self-center">Trả sau với</div>
                    <div class="col-6"><a href="#" class="af-logo"><img src="images/AFTEE_logo_no_space.png" alt=""></a></div>
                </div>
                <hr>
                <div class="product-chat">
                    <a href="#"><img src="images/Logo-zalo.svg" alt="" style="width: 40px;height: 40px;margin-right: 5px;"><b>Chat để được FishBig tư vấn <b>&#40</b>8:30 - 22:00 <b>&#41</b></b></a>
                </div>
                <div class="d-flex product-policy">
                    <div class="d-flex row">
                        <div class="row">
                            <div class="col-3 policy-icon"><img src="images/Policy/return.svg" alt="Đổi trả với số điện thoại"></div>
                            <div class="col-9 policy-title">Đổi trả cực dễ chỉ cần <br> số điện thoại</div>
                        </div>
                        <div class="row">
                            <div class="col-3 policy-icon"><img src="images/Policy/return-60.svg" alt="Đổi hàng trong 60 ngày"></div>
                            <div class="col-9 policy-title">60 ngày đổi trả vì bất kỳ lý do gì</div>
                        </div>
                    </div>
                    <div class="d-flex row">
                        <div class="row">
                            <div class="col-3 policy-icon"><img src="images/Policy/phone.svg" alt="Hotline: 0123456789"></div>
                            <div class="col-9 policy-title">Hotline 0123456789 hỗ <br>trợ từ 8h30 - 22h mỗi ngày</div>
                        </div>
                        <div class="row">
                            <div class="col-3 policy-icon"><img src="images/Policy/location.svg" alt="Trả hàng tận nơi"></div>
                            <div class="col-9 policy-title">Đến tận nơi nhận hàng trả, <br> hoàn tiền trong 24h</div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="product-features">
                    <div class="features">
                        <p class="features-heading">Đặc điểm nổi bật</p>
                        <div class="features-listing">
                           ${product.description}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.productWrapper.innerHTML = productHTML;
    }
}

export default ProductDetailView;
