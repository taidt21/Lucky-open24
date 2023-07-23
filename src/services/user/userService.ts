import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from './dto/PagedUserResultRequestDto';
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { ProfileDto } from './dto/ProfileDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

class UserService {
    public async create(createUserInput: CreateOrUpdateUserInput) {
        try {
            const result = await http.post('api/services/app/User/Create', createUserInput);
            return result.data.result;
        } catch (error) {
            // Handle the error here
            console.error('Error occurred while creating user:', error);
            throw error; // Optional: Rethrow the error to the caller
        }
    }

    public async update(updateUserInput: UpdateUserInput) {
        try {
            const result = await http.post('api/services/app/User/UpdateUser', updateUserInput);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while updating user:', error);
            throw error;
        }
    }

    public async delete(entityDto: number) {
        try {
            const result = await http.delete(`api/services/app/User/Delete?id=${entityDto}`);
            return result.data;
        } catch (error) {
            console.error('Error occurred while deleting user:', error);
            throw error;
        }
    }

    public async getRoles() {
        try {
            const result = await http.get('api/services/app/User/GetRoles');
            return result.data.result.items;
        } catch (error) {
            console.error('Error occurred while retrieving roles:', error);
            throw error;
        }
    }

    public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
        try {
            const result = await http.post(
                'api/services/app/User/ChangeLanguage',
                changeLanguageInput
            );
            return result.data;
        } catch (error) {
            console.error('Error occurred while changing language:', error);
            throw error;
        }
    }

    public async get(entityDto: number): Promise<CreateOrUpdateUserInput> {
        try {
            const result = await http.get(`api/services/app/User/Get?Id=${entityDto}`);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving user:', error);
            throw error;
        }
    }
    public async getForUpdateProfile(): Promise<ProfileDto> {
        const response = await http.get('api/services/app/User/GetForUpdateProfile');
        return response.data.result;
    }

    public async updateProfile(input: ProfileDto): Promise<boolean> {
        const response = await http.post('api/services/app/User/UpdateProfile', input);
        return response.data.result;
    }
    public async updatePassword(input: ChangePasswordDto) {
        const response = await http.post('api/services/app/User/ChangePassword', input);
        return response.data.result;
    }
    public async getAll(
        pagedFilterAndSortedRequest: PagedUserResultRequestDto
    ): Promise<PagedResultDto<GetAllUserOutput>> {
        try {
            const result = await http.get('api/services/app/User/GetAll', {
                params: pagedFilterAndSortedRequest
            });
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving all users:', error);
            throw error;
        }
    }
}

export default new UserService();
