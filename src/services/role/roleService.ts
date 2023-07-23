import { GetAllRoleOutput } from './dto/getAllRoleOutput';
import { GetRoleAsyncInput } from './dto/getRolesAsyncInput';
import GetRoleAsyncOutput from './dto/getRoleAsyncOutput';
import { GetRoleForEditOutput } from './dto/getRoleForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedRoleResultRequestDto } from './dto/PagedRoleResultRequestDto';
import http from '../httpService';
import { PermissionTree } from './dto/permissionTree';
import { CreateOrEditRoleDto } from './dto/createOrEditRoleDto';
import { RoleDto } from './dto/roleDto';
import { permissionCheckboxTree } from './dto/permissionCheckboxTree';

class RoleService {
    public async createOrEdit(input: CreateOrEditRoleDto): Promise<RoleDto> {
        const result = await http.post('api/services/app/Role/CreateOrUpdateRole', input);
        return result.data.result;
    }
    public async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput): Promise<GetRoleAsyncOutput> {
        const result = await http.get('api/services/app/Role/GetRolesAsync', {
            params: getRoleAsyncInput
        });
        return result.data.result;
    }

    public async delete(entityDto: number) {
        const result = await http.post(`api/services/app/Role/DeleteRole`, { id: entityDto });
        return result.data;
    }

    public async getAllPermissions() {
        const result = await http.get('api/services/app/Role/GetAllPermissions');
        return result.data.result.items;
    }
    public async getAllPermissionTree(): Promise<PermissionTree[]> {
        const responsive = await http.get('api/services/app/Permission/GetAllPermissions');
        return responsive.data.result.items;
    }

    public async getRoleForEdit(id: number): Promise<CreateOrEditRoleDto> {
        const result = await http.get(`api/services/app/Role/GetRoleForEdit?Id=${id}`);
        return result.data.result;
    }

    public async get(entityDto: number) {
        const result = await http.get(`api/services/app/Role/Get?id=${entityDto}`);
        return result.data;
    }

    public async getAll(
        pagedFilterAndSortedRequest: PagedRoleResultRequestDto
    ): Promise<PagedResultDto<GetAllRoleOutput>> {
        const result = await http.get('api/services/app/Role/GetAll', {
            params: pagedFilterAndSortedRequest
        });
        return result.data.result;
    }
}

export default new RoleService();
