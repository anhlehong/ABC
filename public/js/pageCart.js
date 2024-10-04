document.addEventListener('DOMContentLoaded', function () {

    const provincesSelect = document.getElementById('provinces');
    const districtsSelect = document.getElementById('districts');
    const wardsSelect = document.getElementById('wards');

    function fetchProvinces() {
        fetch('public/PDW/provinces.json')
            .then(response => response.json())
            .then(data => populateSelect(provincesSelect, data, 'PROVINCE_ID', 'PROVINCE_NAME', fetchDistricts))
            .catch(error => console.error('Error fetching provinces:', error));
    }

    function fetchDistricts(provinceId) {
        fetch('public/PDW/districts.json')
            .then(response => response.json())
            .then(data => {
                const filteredDistricts = data.filter(district => district.PROVINCE_ID == provinceId);
                populateSelect(districtsSelect, filteredDistricts, 'DISTRICT_ID', 'DISTRICT_NAME', fetchWards);
                districtsSelect.disabled = false;
            })
            .catch(error => console.error('Error fetching districts:', error));
    }

    function fetchWards(districtId) {
        fetch('public/PDW/wards.json')
            .then(response => response.json())
            .then(data => {
                const filteredWards = data.filter(ward => ward.DISTRICT_ID == districtId);
                populateSelect(wardsSelect, filteredWards, 'WARDS_ID', 'WARDS_NAME');
                wardsSelect.disabled = false;
            })
            .catch(error => console.error('Error fetching wards:', error));
    }

    function populateSelect(selectElement, data, valueField, textField, nextFetchFunction) {
        let defaultText = '-- Chọn --';

        selectElement.innerHTML = `<option selected>${defaultText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });

        if (nextFetchFunction) {
            selectElement.addEventListener('change', function () {
                nextFetchFunction(this.value);
            });
        }
    }

    fetchProvinces();

    provincesSelect.addEventListener('change', function () {
        resetSelect(districtsSelect, '-- Chọn Quận/Huyện --');
        resetSelect(wardsSelect, '-- Chọn Phường/Xã --');
        if (this.value) {
            fetchDistricts(this.value);
        }
    });

    districtsSelect.addEventListener('change', function () {
        resetSelect(wardsSelect, '-- Chọn Phường/Xã --');
        if (this.value) {
            fetchWards(this.value);
        }
    });

    function resetSelect(selectElement, defaultText) {
        selectElement.innerHTML = `<option selected>${defaultText}</option>`;
        selectElement.disabled = true;
    }

    document.querySelectorAll('input[name="payments"]').forEach((input) => {
        input.addEventListener('change', function () {
            document.querySelectorAll('.custom-color').forEach((div) => {
                div.classList.remove('active');
            });
            if (this.checked) {
                this.closest('.custom-color').classList.add('active'); 
            }
        });
    });

    function addErrorMessage(element, message) {
        let errorMessage = document.querySelector(`#${element.id} + .error-message`);
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = message;
            element.parentNode.appendChild(errorMessage);
        }
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "15px"; // Chỉnh sửa cách thêm kiểu chữ
    }

    function removeErrorMessage(element) {
        const errorMessage = document.querySelector(`#${element.id} + .error-message`);
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function validateFormPayment() {
        const requiredFields = [
            { id: 'name_recipient', message: 'Chưa nhập Họ và tên' },
            { id: 'phoneNumber_recipient', message: 'Chưa nhập Số điện thoại' },
            { id: 'email_recipient', message: 'Chưa nhập Email' },
            { id: 'street', message: 'Chưa nhập Địa chỉ' },
            { id: 'provinces', message: 'Chưa chọn Tỉnh' },
            { id: 'districts', message: 'Chưa chọn Quận/Huyện' },
            { id: 'wards', message: 'Chưa chọn Phường/Xã' }
        ];

        let isValid = true;
        let firstInvalidElement = null;

        requiredFields.forEach(({ id, message }) => {
            const element = document.getElementById(id);

            if (element.tagName === 'SELECT') {
                const isDefaultValue = element.value.startsWith('-- Chọn');
                if (isDefaultValue) {
                    element.classList.add('error');
                    addErrorMessage(element, message);
                    isValid = false;
                    if (!firstInvalidElement) firstInvalidElement = element;
                } else {
                    element.classList.remove('error');
                    removeErrorMessage(element);
                }
            } else {
                if (element.value.trim() === '') {
                    element.classList.add('error');
                    addErrorMessage(element, message);
                    isValid = false;
                    if (!firstInvalidElement) firstInvalidElement = element;
                } else {
                    element.classList.remove('error');
                    removeErrorMessage(element);
                }
            }
        });

        const paymentMethodHeader = document.getElementById('paymentMethod');
        let paymentSelected = document.querySelector('input[name="payments"]:checked');
        let paymentErrorMessage = document.querySelector('#paymentMethod + .error-message');

        if (paymentSelected) {
            if (paymentErrorMessage) {
                paymentErrorMessage.remove();
            }
        } else {
            if (!paymentErrorMessage) {
                paymentErrorMessage = document.createElement('div');
                paymentErrorMessage.className = 'error-message';
                paymentErrorMessage.textContent = 'Chưa chọn hình thức thanh toán';
                paymentErrorMessage.style.color = "red";
                paymentErrorMessage.style.fontSize = "15px"; // Chỉnh sửa cách thêm kiểu chữ
                paymentMethodHeader.parentNode.appendChild(paymentErrorMessage);
            }
            if (!firstInvalidElement) firstInvalidElement = paymentMethodHeader;
        }

        if (!isValid || !paymentSelected) {
            if (firstInvalidElement) {
                scrollToElement(firstInvalidElement);
            }
        }
    }

    let checkBtn = document.getElementById("btnMakePayment");
    checkBtn.addEventListener('click', validateFormPayment);
});