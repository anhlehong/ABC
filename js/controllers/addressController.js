import AddressService from '../services/addressService.js';
import AddressView from '../views/addressView.js';

class AddressController {
    constructor() {
        this.view = new AddressView();
        this.init();
    }

    async init() {
        this.fetchProvinces();

        this.view.provincesSelect.addEventListener('change', (event) => {
            this.view.resetSelect(this.view.districtsSelect, '-- Chọn Quận/Huyện --');
            this.view.resetSelect(this.view.wardsSelect, '-- Chọn Phường/Xã --');
            if (event.target.value) {
                this.fetchDistricts(event.target.value);
            }
        });

        this.view.districtsSelect.addEventListener('change', (event) => {
            this.view.resetSelect(this.view.wardsSelect, '-- Chọn Phường/Xã --');
            if (event.target.value) {
                this.fetchWards(event.target.value);
            }
        });
    }

    async fetchProvinces() {
        try {
            const data = await AddressService.fetchProvinces();
            this.view.populateSelect(this.view.provincesSelect, data, 'PROVINCE_ID', 'PROVINCE_NAME', (provinceId) => this.fetchDistricts(provinceId));
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    }

    async fetchDistricts(provinceId) {
        try {
            const data = await AddressService.fetchDistricts();
            const filteredDistricts = data.filter(district => district.PROVINCE_ID == provinceId);
            this.view.populateSelect(this.view.districtsSelect, filteredDistricts, 'DISTRICT_ID', 'DISTRICT_NAME', (districtId) => this.fetchWards(districtId));
            this.view.districtsSelect.disabled = false;
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    }

    async fetchWards(districtId) {
        try {
            const data = await AddressService.fetchWards();
            const filteredWards = data.filter(ward => ward.DISTRICT_ID == districtId);
            this.view.populateSelect(this.view.wardsSelect, filteredWards, 'WARDS_ID', 'WARDS_NAME');
            this.view.wardsSelect.disabled = false;
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    }
}

export default AddressController;
