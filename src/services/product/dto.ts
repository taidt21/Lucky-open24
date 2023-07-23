import Utils from '../../utils/utils';
import { ParamSearchDto } from '../dto/ParamSearchDto';

export class ModelHangHoaDto {
    id?: string | null = Utils.GuidEmpty;
    tenHangHoa?: string = '';
    tenHangHoa_KhongDau?: string = '';
    idNhomHangHoa?: string | null = '';
    idLoaiHangHoa?: number = 2;
    soPhutThucHien?: number | string = '0';
    moTa?: string = '';
    trangThai?: number = 1;
    tenNhomHang?: string = '';
    tenLoaiHangHoa?: string = 'Dịch vụ';
    txtTrangThaiHang?: string = 'Đang kinh doanh';

    idDonViQuyDoi?: string;
    tenDonViTinh?: string = '';
    maHangHoa?: string = '';
    giaBan?: string | number = 0;
    tyLeChuyenDoi?: number = 1;
    laDonViTinhChuan?: number = 1;
    idHangHoa?: string;
    laHangHoa?: boolean;

    donViQuiDois:
        | any[]
        | {
              id: string;
              maHangHoa: string;
              tenDonViTinh: string;
              tyLeChuyenDoi: number;
              giaBan: string | number;
              laDonViTinhChuan: number;
          }[];

    constructor(
        id = Utils.GuidEmpty,
        idLoaiHangHoa = 2,
        tenHangHoa = '',
        idNhomHangHoa = '',
        moTa = '',
        donViQuiDois: any = []
    ) {
        this.id = id;
        this.tenHangHoa = tenHangHoa;
        this.idLoaiHangHoa = idLoaiHangHoa;
        this.idNhomHangHoa = idNhomHangHoa;
        this.moTa = moTa;
        this.donViQuiDois = donViQuiDois;
        this.laHangHoa = this.idLoaiHangHoa === 1;
    }
}

/* group product */
export class ModelNhomHangHoa {
    id?: string | null = Utils.GuidEmpty;

    maNhomHang? = '';
    tenNhomHang? = '';
    moTa? = '';
    idParent: string | null = null;
    color = '';
    laNhomHangHoa = false;
    children?: ModelNhomHangHoa[] = [];
    sLoaiNhomHang?: string;

    constructor({
        id = Utils.GuidEmpty,
        maNhomHang = '',
        tenNhomHang = '',
        laNhomHangHoa = false,
        color = '#D2691E'
    }) {
        this.id = id;
        if (maNhomHang == '') this.maNhomHang = Utils.getFirstLetter(this.tenNhomHang) ?? '';
        else this.maNhomHang = maNhomHang;
        this.tenNhomHang = tenNhomHang;
        this.laNhomHangHoa = laNhomHangHoa;
        this.color = color;
        this.children = [];
        Object.defineProperties(this, {
            sLoaiNhomHang: {
                get() {
                    return this.laNhomHangHoa ? 'nhóm hàng hóa' : 'nhóm dịch vụ';
                }
            }
        });
    }

    get tenNhomHang_KhongDau() {
        return Utils.strToEnglish(this.tenNhomHang ?? '');
    }
}

/* search */
export class PagedProductSearchDto extends ParamSearchDto {
    idNhomHangHoas?: string | null = '';
}
