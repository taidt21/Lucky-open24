import { SuggestPhongBanDto } from './dto/SuggestPhongBanDto';
import http from '../httpService';
import { SuggestCaLamViecDto } from './dto/SuggestCaLamViecDto';
import { SuggestChiNhanhDto } from './dto/SuggestChiNhanhDto';
import { SuggestLoaiHangHoaDto } from './dto/SuggestLoaiHangHoa';
import { SuggestHangHoaDto } from './dto/SuggestHangHoaDto';
import { SuggestDonViQuiDoiDto } from './dto/SuggestDonViQuiDoi';
import { SuggestNguonKhachDto } from './dto/SuggestNguonKhachDto';
import { SuggestNhomKhachDto } from './dto/SuggestNhomKhachDto';
import { SuggestLoaiKhachDto } from './dto/SuggestLoaiKhachDto';
import { SuggestKhachHangDto } from './dto/SuggestKhachHangDto';
import { SuggestNhanSuDto } from './dto/SuggestNhanSuDto';
import { SuggestChucVuDto } from './dto/SuggestChucVuDto';
import { SuggestNhanVienDichVuDto } from './dto/SuggestNhanVienDichVuDto';
import Cookies from 'js-cookie';
import { SuggestDichVuDto } from './dto/SuggestDichVuDto';

class SuggestService {
    public async SuggestPhongBan(): Promise<SuggestPhongBanDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestPhongBans');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting PhongBans:', error);
            return [];
        }
    }

    public async SuggestCaLamViec(): Promise<SuggestCaLamViecDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestCaLamViecs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting CaLamViec:', error);
            return [];
        }
    }

    public async SuggestChiNhanh(): Promise<SuggestChiNhanhDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestChiNhanhs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting ChiNhanhs:', error);
            return [];
        }
    }

    public async SuggestLoaiHangHoa(): Promise<SuggestLoaiHangHoaDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestLoaiHangHoas');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting LoaiHangHoas:', error);
            return [];
        }
    }

    public async SuggestHangHoa(): Promise<SuggestHangHoaDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestHangHoas');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting HangHoas:', error);
            return [];
        }
    }
    public async SuggestDichVu(): Promise<SuggestDichVuDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestDichVu');
            return result.data.result;
        } catch (error) {
            console.error('Có lỗi sảy ra khi lấy dữ liệu:', error);
            return [];
        }
    }
    public async SuggestDonViQuiDoi(): Promise<SuggestDonViQuiDoiDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestDonViQuiDois');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting DonViQuiDois:', error);
            return [];
        }
    }

    public async SuggestNguonKhach(): Promise<SuggestNguonKhachDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestNguonKhachHangs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting NguonKhachHangs:', error);
            return [];
        }
    }

    public async SuggestNhomKhach(): Promise<SuggestNhomKhachDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestNhomKhachHangs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting NhomKhachHangs:', error);
            return [];
        }
    }

    public async SuggestLoaiKhach(): Promise<SuggestLoaiKhachDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestLoaiKhachHangs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting LoaiKhachHangs:', error);
            return [];
        }
    }

    public async SuggestKhachHang(): Promise<SuggestKhachHangDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestKhachHangs');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting KhachHangs:', error);
            return [];
        }
    }

    public async SuggestNhanSu(): Promise<SuggestNhanSuDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestNhanSus');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting NhanSus:', error);
            return [];
        }
    }

    public async SuggestChucVu(): Promise<SuggestChucVuDto[]> {
        try {
            const result = await http.post('api/services/app/Suggest/SuggestChucVus');
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting ChucVus:', error);
            return [];
        }
    }
    public async SuggestNhanVienLamDichVu(
        idNhanVien?: string
    ): Promise<SuggestNhanVienDichVuDto[]> {
        try {
            let apiUrl = `api/services/app/Suggest/SuggestNhanVienThucHienDichVu?idChiNhanh=${Cookies.get(
                'IdChiNhanh'
            )}`;

            if (idNhanVien && idNhanVien !== '') {
                apiUrl += `&idNhanVien=${idNhanVien}`;
            }

            const result = await http.post(apiUrl);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while suggesting ChucVus:', error);
            return [];
        }
    }
}

export default new SuggestService();
