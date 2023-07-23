export interface BookingGetAllItemDto {
    sourceId: string;
    startTime: string;
    endTime: string;
    customer: string;
    employee: string;
    services: string;
    dayOfWeek: string;
    color: string;
    bookingDate: string;
}
export class BookingDetailDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;

    // constructor({ maHangHoa = '', tenHangHoa = '', giaBan = 0 }) {
    //     this.maHangHoa = maHangHoa;
    //     this.tenHangHoa = tenHangHoa;
    //     this.giaBan = giaBan;
    // }
}

export class BookingDetail_ofCustomerDto {
    idBooking = '';
    idKhachHang = '';
    startTime = '';
    endTime = '';
    bookingDate = '';
    trangThai = 1;

    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    txtTrangThaiBook = '';

    details: BookingDetailDto[] = [];
}
