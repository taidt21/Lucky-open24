import http from '../httpService';
import { ModelHangHoaDto, ModelNhomHangHoa, PagedProductSearchDto } from './dto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';

class GroupProductService {
    GetNhomHangHoa_byID = async (id: string) => {
        const xx = await http
            .get(`api/services/app/NhomHangHoa/GetNhomHangHoa_byID?id=${id}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetDM_NhomHangHoa = async () => {
        const xx = await http
            .get(`api/services/app/NhomHangHoa/GetNhomDichVu`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetTreeNhomHangHoa = async (): Promise<PagedResultDto<ModelNhomHangHoa>> => {
        const xx = await http
            .get(`api/services/app/NhomHangHoa/GetTreeNhomHangHoa`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    InsertNhomHangHoa = async (param: ModelNhomHangHoa) => {
        const xx = await http
            .post(`api/services/app/NhomHangHoa/CreateNhomHangHoa`, param)
            .then((res) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateNhomHangHoa = async (param: ModelNhomHangHoa) => {
        const xx = await http
            .post(`api/services/app/NhomHangHoa/UpdateNhomHangHoa`, param)
            .then((res) => {
                return res.data.result;
            });
        return xx;
    };
    XoaNhomHangHoa = async (idNhomHangHoa: string) => {
        const xx = await http
            .post(`api/services/app/NhomHangHoa/XoaNhomHangHoa?id=${idNhomHangHoa}`)
            .then((res) => {
                return res.data.result;
            });
        return xx;
    };
}
export default new GroupProductService();
