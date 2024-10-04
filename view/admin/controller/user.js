class User{
    constructor(){
        this.ROLE = {
            USER: 1,
            ADMIN: 2,
            WAREHOUSE: 3,
            CASHIER: 4
        }
        this.defaultPassword = '12345678';
    }
    getRoleName(role){
        switch(role){
            case this.ROLE.USER:
                return 'User';
            case this.ROLE.ADMIN:
                return 'Admin';
            case this.ROLE.WAREHOUSE:
                return 'Warehouse';
        }
    }
    transRoleKeyToName(role){
        switch(role){
            case 'USER':
                return 'Người dùng';
            case 'ADMIN':
                return 'Quản trị viên';
            case 'WAREHOUSE':
                return 'Thủ kho';
            case 'CASHIER':
                return 'Thu ngân';
        }
    }
}
export default User;