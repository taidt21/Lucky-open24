import { observable, makeObservable, action } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { ChietKhauDichVuItemDto } from '../services/hoa_hong/chiet_khau_dich_vu/Dto/ChietKhauDichVuItemDto';
import AppConsts from '../lib/appconst';
import Cookies from 'js-cookie';
import chietKhauDichVuService from '../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import { PagedRequestDto } from '../services/dto/pagedRequestDto';
import { CreateOrEditChietKhauDichVuDto } from '../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';

class ChietKhauDichVuStore {
    listChietKhauDichVu!: PagedResultDto<ChietKhauDichVuItemDto>;
    createOrEditDto!: CreateOrEditChietKhauDichVuDto;
    id!: string;
    constructor() {
        makeObservable(this, {
            listChietKhauDichVu: observable,
            createOrEditDto: observable,
            id: observable,
            createModel: action,
            createOrEdit: action,
            getForEdit: action,
            delete: action,
            getAccordingByNhanVien: action,
            getAll: action
        });
    }
    async createModel() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? AppConsts.guidEmpty;
        this.createOrEditDto = {
            id: AppConsts.guidEmpty,
            idChiNhanh: idChiNhanh,
            giaTri: 0,
            idDonViQuiDoi: '',
            idNhanVien: '',
            laPhanTram: false,
            loaiChietKhau: 0
        };
    }
    async createOrEdit(input: CreateOrEditChietKhauDichVuDto) {
        await chietKhauDichVuService.CreateOrEdit(input);
        await this.createModel();
    }
    async getForEdit(id: string) {
        const result = await chietKhauDichVuService.GetForEdit(id);
        this.createOrEditDto = result;
    }
    async delete(id: string) {
        await chietKhauDichVuService.Delete(id);
    }
    async getAccordingByNhanVien(input: PagedRequestDto, idNhanVien: string) {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? undefined;
        const result = await chietKhauDichVuService.GetAccordingByNhanVien(
            input,
            idNhanVien,
            idChiNhanh
        );
        this.listChietKhauDichVu = result;
    }
    async getAll(input: PagedRequestDto) {
        const result = await chietKhauDichVuService.GetAll(input);
        return result;
    }
}
export default new ChietKhauDichVuStore();
