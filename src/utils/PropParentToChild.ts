import HoaDonChiTietDto from '../services/ban_hang/HoaDonChiTietDto';
import PageHoaDonChiTietDto from '../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../services/ban_hang/PageHoaDonDto';
import { ChiNhanhDto } from '../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangDto } from '../services/khach-hang/dto/KhachHangDto';

export class PropModal {
    isShow = false;
    isNew = false;
    id?: string | null = '';
    item?: any = {};
    constructor({ isShow = false, isNew = false, id = '', item = {} }) {
        this.isNew = isNew;
        this.isShow = isShow;
        this.id = id;
        this.item = item;
    }
}

export class PropModal2 {
    isShow = false;
    isNew = false;
    id?: string | null = '';
    constructor({ isShow = false, isNew = false, id = '' }) {
        this.isNew = isNew;
        this.isShow = isShow;
        this.id = id;
    }
}

export class PropConfirmOKCancel {
    show = false;
    title = '';
    mes = '';
    type = 1; // ok, 0.err
    constructor({ show = false, title = '', mes = '', type = 0 }) {
        this.show = show;
        this.title = title;
        this.mes = mes;
        this.type = type;
    }
}

export class PropToChildMauIn {
    contentHtml = '';
    hoadon?: PageHoaDonDto;
    hoadonChiTiet?: PageHoaDonChiTietDto[];
    khachhang?: KhachHangDto;
    chinhanh?: ChiNhanhDto;

    constructor({
        contentHtml = '',
        hoadon = new PageHoaDonDto({ idKhachHang: null }),
        hoadonChiTiet = [new PageHoaDonChiTietDto({ soLuong: 1 })],
        chinhanh = {} as ChiNhanhDto
    }) {
        this.contentHtml = contentHtml;
        this.hoadon = hoadon;
        this.hoadonChiTiet = hoadonChiTiet;
        this.chinhanh = chinhanh;
    }
}
