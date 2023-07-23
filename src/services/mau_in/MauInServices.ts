import http from '../httpService';

class MauInServices {
    GetFileMauIn = async (fileName: string) => {
        const xx = await http
            .get(`api/services/app/MauIn/GetFileMauIn?file=${fileName}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
}

export default new MauInServices();
