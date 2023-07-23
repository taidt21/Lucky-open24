import { makeAutoObservable } from 'mobx';
import { CreateOrEditKhachHangDto } from '../services/khach-hang/dto/CreateOrEditKhachHangDto';
import khachHangService from '../services/khach-hang/khachHangService';
import AppConsts from '../lib/appconst';

class KhachHangSrore {
    createEditKhachHangDto: CreateOrEditKhachHangDto = {
        id: AppConsts.guidEmpty,
        maKhachHang: '',
        tenKhachHang: '',
        soDienThoai: '',
        gioiTinh: false,
        idLoaiKhach: 0,
        idNhomKhach: '',
        idNguonKhach: '',
        diaChi: '',
        moTa: ''
    };
    constructor() {
        makeAutoObservable(this);
    }
    async getForEdit(id: string) {
        const result = await khachHangService.getKhachHang(id);
        this.createEditKhachHangDto = result;
    }
    async createKhachHangDto() {
        this.createEditKhachHangDto = {
            id: AppConsts.guidEmpty,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            gioiTinh: false,
            idLoaiKhach: 0,
            idNhomKhach: '',
            idNguonKhach: '',
            diaChi: '',
            moTa: ''
        };
    }
}
export default new KhachHangSrore();
