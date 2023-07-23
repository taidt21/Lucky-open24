import http from '../httpService';
import { KHCheckInDto, PageKhachHangCheckInDto } from './CheckinDto';
import { PagedKhachHangResultRequestDto } from '../khach-hang/dto/PagedKhachHangResultRequestDto';
import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';

class CheckinService {
    CheckExistCusCheckin = async (idCus: string, idCheckIn?: string) => {
        if (utils.checkNull(idCheckIn)) {
            idCheckIn = Guid.EMPTY;
        }
        const xx = await http
            .post(
                `api/services/app/CheckIn/CheckExistCusCheckin?idCus=${idCus}&idCheckIn=${idCheckIn}`
            )
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    InsertCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/UpdateCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetListCustomerChecking = async (input: any): Promise<PageKhachHangCheckInDto[]> => {
        const xx = await http
            .post(`api/services/app/CheckIn/GetListCustomerChecking`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateTrangThaiCheckin = async (idCheckIn: string, trangThai = 1) => {
        if (utils.checkNull(idCheckIn) || idCheckIn === Guid.EMPTY) {
            return;
        }
        const xx = await http
            .post(
                `api/services/app/CheckIn/UpdateTrangThaiCheckin?idCheckIn=${idCheckIn}&trangThai=${trangThai}`
            )
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };

    InsertCheckInHoaDon = async (input: any) => {
        if (utils.checkNull(input?.idCheckIn) || input?.idCheckIn === Guid.EMPTY) {
            return;
        }
        if (utils.checkNull(input?.idBooking) || input?.idBooking === Guid.EMPTY) {
            input.idBooking = null;
        }
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCheckInHoaDon`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    Update_IdHoaDon_toCheckInHoaDon = async (idCheckIn: string, idHoaDon: string) => {
        if (utils.checkNull(idCheckIn) || idCheckIn === Guid.EMPTY) {
            return false;
        }
        try {
            const xx = await http.get(
                `api/services/app/CheckIn/Update_IdHoaDon_toCheckInHoaDon?idCheckIn=${idCheckIn}&idHoaDon=${idHoaDon}`
            );
            return xx.data.result;
        } catch (error) {
            return false;
        }
    };
}
export default new CheckinService();
