class AddressService {
    static async fetchProvinces() {
        const response = await fetch('../../public/PDW/provinces.json');
        return response.json();
    }

    static async fetchDistricts() {
        const response = await fetch('../../public/PDW/districts.json');
        return response.json();
    }

    static async fetchWards() {
        const response = await fetch('../../public/PDW/wards.json');
        return response.json();
    }
}

export default AddressService;
