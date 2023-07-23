import http from '../httpService';

class TaiKhoanNganHangServices {
    async GetAllBank() {
        const xx = await http.get(`api/services/app/NganHang/GetAll`);
        return xx.data.result;
    }
    async GetAllBankAccount_Where() {
        const xx = await http.get(`api/services/app/TaiKhoanNganHang/GetAll`);
        return xx.data.result;
    }
    async GetAllBankAccount() {
        const xx = await http.get(`api/services/app/TaiKhoanNganHang/GetAllBankAccount`);
        return xx.data.result;
    }
    CreateOrEditBankAccount = async (params: any) => {
        const xx = await http.post(`api/services/app/TaiKhoanNganHang/CreateOrEdit`, params);
        return xx.data.result;
    };
}

export default new TaiKhoanNganHangServices();
