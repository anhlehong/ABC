class AddressView {
    constructor() {
        this.provincesSelect = document.getElementById('provinces');
        this.districtsSelect = document.getElementById('districts');
        this.wardsSelect = document.getElementById('wards');
    }

    populateSelect(selectElement, data, valueField, textField, nextFetchFunction) {
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

    resetSelect(selectElement, defaultText) {
        selectElement.innerHTML = `<option selected>${defaultText}</option>`;
        selectElement.disabled = true;
    }
}

export default AddressView;
