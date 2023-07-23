import { Guid } from 'guid-typescript';

export interface CreateOrEditKhachHangDto {
    id: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;
    diaChi?: string;
    gioiTinh: boolean;
    email?: string;
    moTa?: string;
    trangThai?: number;
    tongTichDiem?: number;
    maSoThue?: string;
    avatar?: string;
    ngaySinh?: Date;
    kieuNgaySinh?: number;
    idLoaiKhach: number;
    idNhomKhach: string;
    idNguonKhach: string;
    idTinhThanh?: string;
    idQuanHuyen?: string;
}
