import http from '../httpService';

class NhanVienThucHienService {
    UpdateNVThucHienDichVu = async (input: any) => {
        const result = await http.post(
            'api/services/app/NhanVienThucHien/UpdateNVThucHienDichVu',
            input
        );
        return result.data;
    };
}

export default new NhanVienThucHienService();
