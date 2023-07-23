import { makeAutoObservable } from 'mobx';
import { BookingGetAllItemDto } from '../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../services/dat-lich/datLichService';
import Cookies from 'js-cookie';

class BookingStore {
    selectedDate: Date = new Date();
    listBooking!: BookingGetAllItemDto[];
    typeView!: string;
    idNhanVien!: string;
    idService!: string;
    constructor() {
        makeAutoObservable(this);
        this.selectedDate = new Date();
        this.typeView = 'week';
    }
    async getData() {
        const result = await datLichService.getAllBooking({
            dateSelected: this.selectedDate,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            typeView: this.typeView,
            idNhanVien: this.idNhanVien
        });
        this.listBooking = result;
    }
    async onChangeTypeView(type: string) {
        this.typeView = type;
        await this.getData();
    }
    async onChangeDate(date: Date) {
        this.selectedDate = date;
        await this.getData();
    }
    async onChangeEmployee(idNhanVien: string) {
        this.idNhanVien = idNhanVien;
        await this.getData();
    }
    async onChangeService(idService: string) {
        this.idService = idService;
        await this.getData();
    }
}
export default new BookingStore();
