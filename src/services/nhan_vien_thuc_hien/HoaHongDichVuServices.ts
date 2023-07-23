import http from '../httpService';

class HoaHongDichVuServices {
    GetHoaHongNV_theoDichVu = async (idNhanVien: any, idDonViQuyDoi: string) => {
        const result = await http.get(
            `api/services/app/ChietKhauDichVu/GetHoaHongNV_theoDichVu?idNhanVien=${idNhanVien}&idDonViQuyDoi=${idDonViQuyDoi}`
        );
        return result.data.result;
    };
    GetAllHoaHong_theoNhanVien = async (idNhanVien: string) => {
        const result = await http.get(
            `api/services/app/ChietKhauDichVu/GetAllHoaHong_theoNhanVien?idNhanVien=${idNhanVien}`
        );
        return result.data.result;
    };
    GetAllHoaHong_theoDichVu = async (idDonViQuyDoi: string) => {
        const result = await http.get(
            `api/services/app/ChietKhauDichVu/GetAllHoaHong_theoDichVu?idNhanVien=${idDonViQuyDoi}`
        );
        return result.data.result;
    };
}

export default new HoaHongDichVuServices();
