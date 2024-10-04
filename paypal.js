// Tỷ giá chuyển đổi từ VND sang USD
const exchangeRate = 0.000040;


paypal.Buttons({
    // Thiết lập giao dịch
    createOrder: function (data, actions) {
        // Lấy giá trị từ đầu vào
        const vndAmount = 25000;
        const usdAmount = (vndAmount * exchangeRate).toFixed(2);

        const street = "Trung Mỹ Tây 13A";
        const wards = "Trung Mỹ Tây";
        const districts = "Quận 12";
        const provinces = "Hồ Chí Minh";

        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: usdAmount
                },
                shipping: {
                    address: {
                        address_line_1: street,
                        address_line_2: wards,
                        admin_area_2: districts,
                        admin_area_1: provinces,
                        postal_code: '000000', // PayPal yêu cầu mã bưu điện, bạn có thể đặt một giá trị giả định
                        country_code: 'VN' // Mã quốc gia Việt Nam
                    }
                }
            }]
        });
    },

    // Hoàn thành giao dịch
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            alert('Giao dịch hoàn tất bởi ' + details.payer.name.given_name);
        });
    }
}).render('#paypal-button-container');
