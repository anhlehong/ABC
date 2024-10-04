class Utils {
    constructor() {
        this.ROLE = {
            USER: 1,
            ADMIN: 2,
            WAREHOUSE: 3
        }
    }
    formatToVND(money) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
    }
    /**
     * 
     * @returns {String} current day in format DD-MM-YYYY
     */
    getCurrentDayBinh(){
        function formatDateToYYYYMMDD(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        }
        const today = new Date();
        const formattedDate = formatDateToYYYYMMDD(today);
        return formattedDate;
    }
    getRoleName(role) {
        switch (role) {
            case this.ROLE.USER:
                return 'User';
            case this.ROLE.ADMIN:
                return 'Admin';
            case this.ROLE.WAREHOUSE:
                return 'Warehouse';
        }
    }
    getArrAllDaysInMonth(month, year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }
    getDayMonthYearInOrder(orderDate) {
        //2024-07-24
        const [year, month, day] = orderDate.split('-');
        const actualMonth = parseInt(month, 10);
        const actualDay = parseInt(day, 10);
        const actualYear = parseInt(year, 10);
        return {
            year: actualYear,
            month: actualMonth,
            day: actualDay
        }
    }
    /**
     * 
     * @param {Number} year 
     * @param {Number} month 
     * @returns {Boolean} true if the year and month is current
     */
    getIsRightMonthYear(year, month) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        return year === currentYear && month === currentMonth;
    }
    formatCounter(counter) {
        return counter.toString().padStart(5, '0');
    }
    /**
     * 
     * @param {Date} date {YYY-MM-DD}
     * @returns 
     */
    formatDateToDDMMYYYY(date) {
        let {year, month, day} = this.getDayMonthYearInOrder(date);   
        if(day < 10) {
            day = `0${day}`;
        }
        if(month < 10) {
            month = `0${month}`;
        }
        return `${day}-${month}-${year}`;
    }
    /**
     * 
     * @param {Array} snapshot 
     * @returns {Array} array of objects {key, Date, Note, PaymentMethod, Supplier} 
     */
    snapshotToArray(snapshot) {
        const result = [];
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            const key = childSnapshot.key;
            result.push({key: key,item });
        });
        return result;
    }
    getCurrentDay() {
        function formatDateToYYYYMMDD(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        const today = new Date();
        const formattedDate = formatDateToYYYYMMDD(today);
        return formattedDate;
    }
}
export default Utils;