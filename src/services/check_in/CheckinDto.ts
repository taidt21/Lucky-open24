import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import { format } from 'date-fns';

export class KHCheckInDto {
    idKhachHang = '';
    idChiNhanh = '';
    dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    ghiChu = '';
    constructor({
        idKhachHang = '',
        idChiNhanh = '',
        dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')
    }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.dateTimeCheckIn = dateTimeCheckIn;
    }
}

export class PageKhachHangCheckInDto {
    idKhachHang: string | null = null;
    idChiNhanh = null;
    idCheckIn = Guid.EMPTY;
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    tongTichDiem = 0;
    dateTimeCheckIn = new Date().toLocaleString();
    ghiChu? = '';
    txtTrangThaiCheckIn? = '';

    constructor({
        idKhachHang = Guid.EMPTY,
        idChiNhanh = null,
        idCheckIn = Guid.EMPTY,
        dateTimeCheckIn = new Date(),
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        ghiChu = '',
        txtTrangThaiCheckIn = 'Đang chờ'
    }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idCheckIn = idCheckIn;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.dateTimeCheckIn = dateTimeCheckIn.toLocaleString();
        this.ghiChu = ghiChu;
        this.txtTrangThaiCheckIn = txtTrangThaiCheckIn;
    }
    get dateCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'dd/MM/yyyy');
    }
    get timeCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'hh:mm a');
    }
    get tenKhach_KiTuDau() {
        return utils.getFirstLetter(this.tenKhachHang);
    }
}
