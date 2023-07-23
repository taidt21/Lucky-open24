import Dexie, { Table } from 'dexie';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';

export class SubClassDexie extends Dexie {
    hoaDon!: Table<PageHoaDonDto>;
    khachCheckIn!: Table<PageKhachHangCheckInDto>;

    constructor() {
        super('DBTest');
        this.version(1).stores({
            hoaDon: '&id, idKhachHang',
            khachCheckIn: '&idCheckIn, idKhachHang'
        });
    }
}
export const dbDexie = new SubClassDexie();
