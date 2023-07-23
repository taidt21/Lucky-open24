import { ExecuteResultDto } from '../../dto/ExecuteResultDto';
import { PagedRequestDto } from '../../dto/pagedRequestDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { ChietKhauDichVuDto } from './Dto/ChietKhauDichVuDto';
import { ChietKhauDichVuItemDto } from './Dto/ChietKhauDichVuItemDto';
import { CreateOrEditChietKhauDichVuDto } from './Dto/CreateOrEditChietKhauDichVuDto';

class ChietKhauDichVuService {
    public async CreateOrEdit(input: CreateOrEditChietKhauDichVuDto) {
        const result = await http.post('api/services/app/ChietKhauDichVu/CreateOrEdit', input);
        return result.data.result;
    }
    public async Delete(id: string): Promise<ChietKhauDichVuDto> {
        const result = await http.post('api/services/app/ChietKhauDichVu/Delete', id);
        return result.data.result;
    }
    public async GetForEdit(id: string): Promise<CreateOrEditChietKhauDichVuDto> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetForEdit', {
            params: {
                id
            }
        });
        return result.data.result;
    }
    public async GetAccordingByNhanVien(
        input: PagedRequestDto,
        idNhanVien: string,
        idChiNhanh: string | undefined
    ): Promise<PagedResultDto<ChietKhauDichVuItemDto>> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetAccordingByNhanVien', {
            params: {
                input,
                idNhanVien,
                idChiNhanh
            }
        });
        return result.data.result;
    }
    public async GetAll(input: PagedRequestDto): Promise<PagedResultDto<ChietKhauDichVuItemDto>> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetAll', {
            params: {
                input
            }
        });
        return result.data.result;
    }
}
export default new ChietKhauDichVuService();
