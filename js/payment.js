import CartPaymentController from './controllers/cartPaymentController.js';
import AddressController from './controllers/addressController.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartController = new CartPaymentController();
    await cartController.init();

    const addressController = new AddressController();

    // document.querySelectorAll('input[name="payments"]').forEach((input) => {
    //     input.addEventListener('change', function () {
    //         document.querySelectorAll('.custom-color').forEach((div) => {
    //             div.classList.remove('active');
    //         });
    //         if (this.checked) {
    //             this.closest('.custom-color').classList.add('active');
    //         }
    //     });
    // });
});
