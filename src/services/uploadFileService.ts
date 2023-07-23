import { IFileDto } from './dto/FileDto';
import http from './httpService';

class UpLoadFileService {
    async downloadImportTemplate(fileName: string): Promise<IFileDto> {
        const res = await http.get(
            `/api/upload-file/download-import-template?fileName=${fileName}`
        );
        return res.data;
    }
}

export default new UpLoadFileService();
