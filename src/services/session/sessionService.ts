import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';
import Cookies from 'js-cookie';
declare let abp: any;

class SessionService {
    public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations> {
        const result = await http.get('api/services/app/Session/GetCurrentLoginInformations', {
            headers: {
                'Abp.TenantId': Cookies.get('Abp.TenantId')
            }
        });

        return result.data.result;
    }
}

export default new SessionService();
