import { ParamSearchDto } from '../../dto/ParamSearchDto';

export interface PagedBookingResultRequestDto {
    idChiNhanh: string;
    dateSelected: Date;
    typeView: string;
    idNhanVien?: string;
}

export class BookingRequestDto extends ParamSearchDto {
    trangThaiBook = 3; // 3.all, 1.chua xacnha, 2.da xacnhan, 0.xoa

    constructor({ currentPage = 0, pageSize = 10, textSearch = '', trangThaiBook = 3 }) {
        super({ currentPage, pageSize, textSearch });
        this.trangThaiBook = trangThaiBook;
    }
}
