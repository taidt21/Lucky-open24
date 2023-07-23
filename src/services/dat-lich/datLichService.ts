import http from '../httpService';
import { BookingDto } from './dto/BookingDto';
import { BookingGetAllItemDto } from './dto/BookingGetAllItemDto';
import { CreateBookingDto } from './dto/CreateBookingDto';
import qs from 'qs';
import {
    BookingRequestDto,
    PagedBookingResultRequestDto
} from './dto/PagedBookingResultRequestDto';
class BookingServices {
    public async getAllBooking(
        input: PagedBookingResultRequestDto
    ): Promise<BookingGetAllItemDto[]> {
        const result = await http.get('api/services/app/Booking/GetAll', { params: input });
        return result.data.result;
    }
    public async CreateBooking(input: CreateBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateBooking', input);
        return result.data.success;
    }
    public async GetKhachHang_Booking(input: BookingRequestDto) {
        const param = qs.stringify(input);
        const xx = await http.get(`api/services/app/Booking/GetKhachHang_Booking?${param}`);
        return xx.data.result;
    }
    public async UpdateTrangThaiBooking(idBooking: string, trangthai = 1) {
        const xx = await http.get(
            `api/services/app/Booking/UpdateTrangThaiBooking?idBooking=${idBooking}&trangThai=${trangthai}`
        );
        return xx.data.result;
    }
}
export default new BookingServices();
