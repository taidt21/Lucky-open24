import { makeAutoObservable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { LichLamViecNhanVienDto } from '../services/nhan-vien/lich_lam_viec/dto/LichLamViecNhanVienDto';
import { PagedRequestLichLamViecDto } from '../services/nhan-vien/lich_lam_viec/dto/PagedRequsetLichLamViec';
import lichLamViecService from '../services/nhan-vien/lich_lam_viec/lichLamViecService';
import Cookies from 'js-cookie';
import { CreateOrEditLichLamViecDto } from '../services/nhan-vien/lich_lam_viec/dto/CreateOrEditLichLamViecDto';
import AppConsts from '../lib/appconst';

class LichLamViecStore {
    listLichLamViec!: PagedResultDto<LichLamViecNhanVienDto>;
    createLichLamViecDto: CreateOrEditLichLamViecDto = {
        id: AppConsts.guidEmpty,
        giaTriLap: 0,
        idCaLamViec: '',
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idNhanVien: '',
        kieuLapLai: 0,
        lapLai: false,
        ngayLamViec: [],
        tuNgay: '',
        denNgay: ''
    };
    dateFrom: Date = new Date();
    idNhanVien!: string;
    totalCount!: number;
    totalPage!: number;
    skipCount!: number;
    maxResultCount!: number;
    constructor() {
        makeAutoObservable(this);
        this.totalCount = 0;
        this.totalPage = 0;
        this.skipCount = 1;
        this.maxResultCount = 10;
    }
    async getLichLamViecNhanVienWeek(input: PagedRequestLichLamViecDto) {
        const result = await lichLamViecService.getAllLichLamViecWeek({
            ...input,
            skipCount: this.skipCount,
            maxResultCount: this.maxResultCount,
            dateFrom: this.dateFrom,
            dateTo: this.dateFrom,
            idNhanVien: this.idNhanVien == '' ? undefined : this.idNhanVien
        });
        this.listLichLamViec = result;
        this.totalCount = result.totalCount;
        this.totalPage = Math.ceil(result.totalCount / this.maxResultCount);
    }
    async updateIdNhanVien(id: string) {
        this.idNhanVien = id;
    }
    async updateDate(date: Date) {
        this.dateFrom = date;
    }
    async updatePageChange(page: number) {
        this.skipCount = page;
    }
    async updatePerPageChange(page: number) {
        this.maxResultCount = page;
    }
}
export default new LichLamViecStore();
