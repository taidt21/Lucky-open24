import { StringSchema } from 'yup';
import { RequestFromToDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import QuyHoaDonDto from '../so_quy/QuyHoaDonDto';
import { PagedQuyHoaDonRequestDto } from './Dto/PagedQuyHoaDonRequest';
import { GetAllQuyHoaDonItemDto } from './Dto/QuyHoaDonViewItemDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IFileDto } from '../dto/FileDto';
import QuyChiTietDto from './QuyChiTietDto';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
    UpdateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/UpdateQuyHoaDon', input);
        return result.data.result;
    };
    DeleteSoQuy = async (id: string) => {
        const result = await http.get('api/services/app/QuyHoaDon/Delete?id=' + id);
        return result.data.result;
    };
    GetNhatKyThanhToan_ofHoaDon = async (idHoaDonLienQuan: string): Promise<QuyHoaDonDto[]> => {
        if (utils.checkNull(idHoaDonLienQuan)) return [];
        const result = await http.get(
            `api/services/app/QuyHoaDon/GetNhatKyThanhToan_ofHoaDon?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        console.log('GetNhatKyThanhToan_ofHoaDon ', result.data.result);
        return result.data.result;
    };
    HuyPhieuThuChi_ofHoaDonLienQuan = async (idHoaDonLienQuan: string) => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/HuyPhieuThuChi_ofHoaDonLienQuan?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        return result.data.result;
    };
    async getAll(input: RequestFromToDto): Promise<PagedResultDto<GetAllQuyHoaDonItemDto>> {
        const response = await http.get('api/services/app/QuyHoaDon/GetAll', {
            params: input
        });
        return response.data.result;
    }

    async ExportToExcel(input: RequestFromToDto): Promise<IFileDto> {
        const response = await http.post('api/services/app/QuyHoaDon/ExportExcelQuyHoaDon', input);
        return response.data.result;
    }
    async GetForEdit(idQuyHD: string): Promise<QuyHoaDonDto> {
        const response = await http.get(`api/services/app/QuyHoaDon/GetForEdit?id=${idQuyHD}`);
        return response.data.result;
    }
    CheckExistsMaPhieuThuChi = async (maHoaDon: string, idQuy: string | null = null) => {
        if (utils.checkNull(maHoaDon)) {
            return false;
        } else {
            if (utils.checkNull(idQuy)) {
                idQuy = Guid.EMPTY;
            }
            const response = await http.get(
                `api/services/app/QuyHoaDon/CheckExistsMaPhieuThuChi?maphieu=${maHoaDon}&id=${idQuy}`
            );
            return response.data.result;
        }
    };
    ShareMoney_QuyHD = (
        phaiTT: number,
        tienDiem: number,
        tienmat: number,
        tienPOS: number,
        chuyenkhoan: number,
        thegiatri: number,
        tiencoc: number
    ) => {
        // thutu uutien: 1.coc, 2.diem, 3.thegiatri, 4.mat, 5.pos, 6.chuyenkhoan
        if (tiencoc >= phaiTT) {
            return {
                TienCoc: phaiTT,
                TTBangDiem: 0,
                TienMat: 0,
                TienPOS: 0,
                TienChuyenKhoan: 0,
                TienTheGiaTri: 0
            };
        } else {
            phaiTT = phaiTT - tiencoc;
            if (tienDiem >= phaiTT) {
                return {
                    TienCoc: tiencoc,
                    TTBangDiem: phaiTT,
                    TienMat: 0,
                    TienPOS: 0,
                    TienChuyenKhoan: 0,
                    TienTheGiaTri: 0
                };
            } else {
                phaiTT = phaiTT - tienDiem;
                if (thegiatri >= phaiTT) {
                    return {
                        TienCoc: tiencoc,
                        TTBangDiem: tienDiem,
                        TienMat: 0,
                        TienPOS: 0,
                        TienChuyenKhoan: 0,
                        TienTheGiaTri: Math.abs(phaiTT)
                    };
                } else {
                    phaiTT = phaiTT - thegiatri;
                    if (tienmat >= phaiTT) {
                        return {
                            TienCoc: tiencoc,
                            TTBangDiem: tienDiem,
                            TienMat: Math.abs(phaiTT),
                            TienPOS: 0,
                            TienChuyenKhoan: 0,
                            TienTheGiaTri: thegiatri
                        };
                    } else {
                        phaiTT = phaiTT - tienmat;
                        if (tienPOS >= phaiTT) {
                            return {
                                TienCoc: tiencoc,
                                TTBangDiem: tienDiem,
                                TienMat: tienmat,
                                TienPOS: Math.abs(phaiTT),
                                TienChuyenKhoan: 0,
                                TienTheGiaTri: thegiatri
                            };
                        } else {
                            phaiTT = phaiTT - tienPOS;
                            if (chuyenkhoan >= phaiTT) {
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: Math.abs(phaiTT),
                                    TienTheGiaTri: thegiatri
                                };
                            } else {
                                phaiTT = phaiTT - chuyenkhoan;
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: chuyenkhoan,
                                    TienTheGiaTri: thegiatri
                                };
                            }
                        }
                    }
                }
            }
        }
    };
    AssignAgainQuyChiTiet = (
        lstQuyCT: QuyChiTietDto[],
        sumTienKhachTra: number,
        tongPhaiTra: number
    ) => {
        let lstQuyCT_After: QuyChiTietDto[] = [];
        console.log('lstQuyCT_After ', lstQuyCT_After);
        let tienMat = 0,
            tienPos = 0,
            tienCK = 0;
        let idTaiKhoanPos = null,
            idTaiKhoanCK = null;
        const itemPos = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 2);
        const itemCK = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 3);
        if (itemPos.length > 0) {
            idTaiKhoanPos = itemPos[0].idTaiKhoanNganHang;
        }
        if (itemCK.length > 0) {
            idTaiKhoanCK = itemCK[0].idTaiKhoanNganHang;
        }

        for (let i = 0; i < lstQuyCT.length; i++) {
            const itFor = lstQuyCT[i];
            switch (itFor.hinhThucThanhToan) {
                case 1:
                    tienMat += itFor.tienThu;
                    break;
                case 2:
                    tienPos += itFor.tienThu; // tienPos = tienCK (DB)
                    break;
                case 3:
                    tienCK += itFor.tienThu;
                    break;
            }
        }
        if (sumTienKhachTra > tongPhaiTra) {
            const shareMoney = this.ShareMoney_QuyHD(
                tongPhaiTra,
                0,
                tienMat,
                tienPos,
                tienCK,
                0,
                0
            );
            const tienMatNew = shareMoney.TienMat,
                tienPosNew = shareMoney.TienPOS,
                tienCKNew = shareMoney.TienChuyenKhoan;

            if (tienMatNew > 0) {
                const newQCT = new QuyChiTietDto({ hinhThucThanhToan: 1, tienThu: tienMatNew });
                lstQuyCT_After.push(newQCT);
            }
            if (tienPosNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: 2,
                    tienThu: tienPosNew,
                    idTaiKhoanNganHang: idTaiKhoanPos as null
                });
                lstQuyCT_After.push(newQCT);
            }
            if (tienCKNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: 3,
                    tienThu: tienCKNew,
                    idTaiKhoanNganHang: idTaiKhoanCK as null
                });
                lstQuyCT_After.push(newQCT);
            }
        } else {
            lstQuyCT_After = [...lstQuyCT];
        }
        return lstQuyCT_After;
    };
}

export default new SoQuyServices();
