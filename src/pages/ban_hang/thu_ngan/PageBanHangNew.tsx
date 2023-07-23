import * as React from 'react';
import {
    Box,
    Grid,
    Typography,
    ButtonGroup,
    Button,
    TextField,
    IconButton,
    List,
    ListItem,
    Avatar,
    ListItemIcon,
    ListItemText,
    InputAdornment,
    Link,
    RadioGroup,
    Radio,
    FormControl,
    FormLabel,
    FormControlLabel,
    Autocomplete
} from '@mui/material';
import closeIcon from '../../../images/closeSmall.svg';
import avatar from '../../../images/avatar.png';
import dotIcon from '../../../images/dotssIcon.svg';
import { Close, Add } from '@mui/icons-material';
// import { useReactToPrint } from 'react-to-print';
import { useState, useEffect, useRef, useContext } from 'react';
import { debounce } from '@mui/material/utils';
import { useReactToPrint } from 'react-to-print';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { MauInHoaDon } from '../../../components/Print/MauInHoaDon';
import DetailHoaDon from './DetailHoaDon';
import ProductService from '../../../services/product/ProductService';
import GroupProductService from '../../../services/product/GroupProductService';

import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';

import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';

import { dbDexie } from '../../../lib/dexie/dexieDB';

import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import NhanSuItemDto from '../../../services/nhan-vien/dto/nhanSuItemDto';
import { Guid } from 'guid-typescript';
import utils from '../../../utils/utils';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import CheckinService from '../../../services/check_in/CheckinService';
import { ModelNhomHangHoa } from '../../../services/product/dto';
import { PropToChildMauIn, PropModal, PropModal2 } from '../../../utils/PropParentToChild';
import ModelNhanVienThucHien from '../../nhan_vien_thuc_hien/modelNhanVienThucHien';
import ModalEditChiTietGioHang from './modal_edit_chitiet';
import NhanVienService from '../../../services/nhan-vien/nhanVienService';
import Cookies from 'js-cookie';
import logo from '../../../images/Lucky_beauty.jpg';
import { ReactComponent as IconDv } from '../../../images/icon-DV.svg';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import { ReactComponent as DeleteIcon } from '../../../images/trash.svg';
import { ReactComponent as UserIcon } from '../../../images/user.svg';
import { ReactComponent as VoucherIcon } from '../../../images/voucherIcon.svg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import Payments from './Payment';
import { PagedNhanSuRequestDto } from '../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import { DataCustomerContext } from '../../../services/khach-hang/dto/DataContext';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import CreateOrEditCustomerDialog from '../../customer/components/create-or-edit-customer-modal';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../../services/check_in/CheckinDto';
import khachHangStore from '../../../stores/khachHangStore';
import ModalAddCustomerCheckIn from '../../check_in/modal_add_cus_checkin';
import AppConsts from '../../../lib/appconst';
import { lstat } from 'fs/promises';
import { NumericFormat } from 'react-number-format';
const PageBanHang = ({ customerChosed, CoditionLayout, onPaymentChild, sendDataToParent }: any) => {
    const chiNhanhCurrent = useContext(ChiNhanhContext);
    const idChiNhanh = Cookies.get('IdChiNhanh');
    const [txtSearch, setTxtSearch] = useState('');
    const isFirstRender = useRef(true);
    const afterRender = useRef(false);
    const [clickSSave, setClickSave] = useState(false);
    const componentRef = useRef(null);
    const [isPrint, setIsPrint] = useState(false); // todo check on/off print
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);
    const [contentPrint, setContentPrint] = useState('<h1> Hello </h1>');
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState([]);

    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: utils.checkNull(chiNhanhCurrent.id) ? idChiNhanh : chiNhanhCurrent.id
        })
    );
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [lstQuyCT, setLstQuyCT] = useState<QuyChiTietDto[]>([
        new QuyChiTietDto({ hinhThucThanhToan: 1 }) // !! important: luôn set ít nhất 1 giá trị cho mảng quỹ chi tiết
    ]);

    // used to check update infor cthd
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: false })
    );

    const [propMauIn, setPropMauIn] = useState<PropToChildMauIn>(
        new PropToChildMauIn({ contentHtml: '' })
    );
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [propNVThucHien, setPropNVThucHien] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [idCTHDChosing, setIdCTHDChosing] = useState('');

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const nhomDichVu = allNhomHangHoa.filter((x) => !x.laNhomHangHoa);
    const nhomHangHoa = allNhomHangHoa.filter((x) => x.laNhomHangHoa);

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
    };

    const getInforChiNhanh_byID = async () => {
        const idChinhanh = utils.checkNull(chiNhanhCurrent.id) ? idChiNhanh : chiNhanhCurrent.id;
        const data = await chiNhanhService.GetDetail(idChinhanh ?? '');
        return data;
    };

    const PageLoad = async () => {
        await GetTreeNhomHangHoa();
        await GetListNhanVien();
        await FirstLoad_getSetDataFromCache();
        afterRender.current = true;
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // avoid load again
        }
        console.log('pageload');
        PageLoad();
    }, [customerChosed]);

    const getListHangHoa_groupbyNhom = async () => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: '',
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    React.useEffect(() => {
        if (isFirstRender.current) return;
        getListHangHoa_groupbyNhom();
    }, [idNhomHang, idLoaiHangHoa]);

    // only used when change textsearch
    const debounceDropDown = useRef(
        debounce(async (input: any) => {
            const data = await ProductService.GetDMHangHoa_groupByNhom(input);
            setListProduct(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        if (!afterRender.current) return;
        // if search, reset inhom +loaihang
        const input = {
            IdNhomHangHoas: '',
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0,
            CurrentPage: 0,
            PageSize: 50
        };

        debounceDropDown(input);
    }, [txtSearch]);

    // filter list product
    const choseNhomDichVu = async (item: any) => {
        setIdNhomHang(item.id);
        setIdLoaiHangHoa(0);
    };

    const choseLoaiHang = (type: number) => {
        setTxtSearch('');
        setIdNhomHang('');
        setIdLoaiHangHoa(type);
    };
    // end filter

    const FirstLoad_getSetDataFromCache = async () => {
        const idCus = customerChosed.idKhachHang;
        if (!utils.checkNull(idCus)) {
            const data = await dbDexie.hoaDon.where('idKhachHang').equals(idCus).toArray();

            if (data.length === 0) {
                const dataHD: PageHoaDonDto = {
                    ...hoadon,
                    id: Guid.create().toString(),
                    idChiNhanh: utils.checkNull(chiNhanhCurrent.id)
                        ? idChiNhanh
                        : chiNhanhCurrent.id,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang ?? 'Khách lẻ',
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
                await dbDexie.hoaDon.add(dataHD);
                setHoaDon(dataHD);
            } else {
                // get hoadon + cthd
                const hdctCache = data[0].hoaDonChiTiet ?? [];
                setHoaDon(data[0]);
                setHoaDonChiTiet(hdctCache);

                setPropMauIn((old: any) => {
                    return {
                        ...old,
                        // contentHtml: content,
                        hoadon: { ...data[0] },
                        khachhang: { ...customerChosed },
                        hoadonChiTiet: [...hdctCache],
                        chinhanh: {
                            ...old.chinhanh,
                            tenChiNhanh: 'CTCP SSOFT VIỆT NAM',
                            soDienThoai: '0973474985',
                            logo: logo
                        }
                    };
                });
            }
        } else {
            // asisgn hoadon
            setHoaDon((old) => {
                return {
                    ...old,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang ?? 'Khách lẻ',
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
            });
        }
        setTriggerAddCheckIn({ ...triggerAddCheckIn, id: customerChosed?.idCheckIn });
    };

    const updateCurrentInvoice = async () => {
        let tongTienHangChuaCK = 0,
            tongChietKhau = 0,
            tongThueChiTiet = 0,
            tongTienHang = 0,
            thanhtiensauVAT = 0;

        for (let i = 0; i < hoaDonChiTiet.length; i++) {
            const itFor = hoaDonChiTiet[i];
            tongTienHangChuaCK += itFor.soLuong * itFor.donGiaTruocCK;
            tongTienHang += itFor.thanhTienSauCK ?? 0;
            tongChietKhau += (itFor.tienChietKhau ?? 0) * itFor.soLuong;
            tongThueChiTiet += (itFor.tienThue ?? 0) * itFor.soLuong;
            thanhtiensauVAT += itFor.thanhTienSauVAT ?? 0;
        }
        const dataHD = {
            ...hoadon,
            tongTienHangChuaChietKhau: tongTienHangChuaCK,
            tongChietKhauHangHoa: tongChietKhau,
            tongTienHang: tongTienHang,
            tongTienThue: tongThueChiTiet,
            tongTienHDSauVAT: thanhtiensauVAT,
            tongThanhToan: thanhtiensauVAT,
            hoaDonChiTiet: hoaDonChiTiet
        };
        setHoaDon((old: any) => {
            return {
                ...old,
                idChiNhanh: utils.checkNull(old.idChiNhanh) ? idChiNhanh : old.idChiNhanh,
                tongTienHangChuaChietKhau: tongTienHangChuaCK,
                tongTienHang: tongTienHang,
                tongChietKhauHangHoa: tongChietKhau,
                tongTienHDSauVAT: thanhtiensauVAT,
                tongThanhToan: thanhtiensauVAT,
                hoaDonChiTiet: hoaDonChiTiet
            };
        });

        UpdateCacheHD(dataHD);

        setPropMauIn((old: any) => {
            return {
                ...old,
                // contentHtml: content,
                hoadon: { ...dataHD },
                khachhang: { ...customerChosed },
                hoadonChiTiet: [...hoaDonChiTiet],
                chinhanh: {
                    ...old.chinhanh,
                    tenChiNhanh: 'CTCP SSOFT VIỆT NAM',
                    soDienThoai: '0973474985',
                    logo: logo
                }
            };
        });
    };

    const UpdateCacheHD = async (dataHD: any) => {
        const id = dataHD.id ?? Guid.create().toString();
        const data = await dbDexie.hoaDon.where('id').equals(id).toArray();

        if (data.length > 0) {
            const rowDelete = await dbDexie.hoaDon.where('id').equals(id).delete();
            if (rowDelete > 0) {
                await dbDexie.hoaDon.add(dataHD);
            }
        }
    };

    useEffect(() => {
        if (!afterRender.current) return;
        updateCurrentInvoice();
    }, [hoaDonChiTiet]);

    const deleteChiTietHoaDon = (item: any) => {
        setHoaDonChiTiet(hoaDonChiTiet.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi));
    };

    const choseChiTiet = async (item: any, index: any) => {
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item.idDonViQuyDoi,
            maHangHoa: item.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            giaBan: item.giaBan,
            idNhomHangHoa: item.idNhomHangHoa,
            idHangHoa: item.id,
            soLuong: 1,
            expanded: false
        });

        const checkCT = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (checkCT.length === 0) {
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...olds];
            });
        } else {
            newCT.id = checkCT[0].id; // get ID old --> check update nvThucHien + chietkhau
            newCT.soLuong = checkCT[0].soLuong + 1;
            newCT.nhanVienThucHien = checkCT[0].nhanVienThucHien;

            // remove & unshift but keep infor old cthd
            const arrOld = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...arrOld];
            });
        }
        setCTHDDoing(newCT);
    };

    // auto update cthd
    useEffect(() => {
        if (!afterRender.current) return;
        Update_HoaDonChiTiet();
        UpdateHoaHongDichVu_forNVThucHien();
    }, [cthdDoing]);

    const UpdateHoaHongDichVu_forNVThucHien = () => {
        // update for all nvth thuoc ctDoing
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.map((nv) => {
                            if (nv.ptChietKhau > 0) {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.ptChietKhau * (x.thanhTienSauCK ?? 0)) / 100
                                };
                            } else {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.chietKhauMacDinh ?? 0) * x.soLuong
                                };
                            }
                        })
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const Update_HoaDonChiTiet = () => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        tienChietKhau:
                            (x.ptChietKhau ?? 0) > 0
                                ? (x.donGiaTruocCK * (x.ptChietKhau ?? 0)) / 100
                                : x.tienChietKhau,
                        tienThue:
                            (x.ptThue ?? 0) > 0
                                ? ((x.donGiaSauCK ?? 0) * (x.ptThue ?? 0)) / 100
                                : x.tienThue
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const showPopNhanVienThucHien = (item: HoaDonChiTietDto) => {
        setPropNVThucHien((old) => {
            return { ...old, isShow: true, isNew: true, item: item, id: item.id };
        });
    };
    const AgreeNVThucHien = (lstNVChosed: any) => {
        // update cthd + save to cache
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (propNVThucHien.item.id === x.id) {
                    return { ...x, nhanVienThucHien: lstNVChosed };
                } else {
                    return x;
                }
            })
        );
    };
    const RemoveNVThucHien = (cthd: any, nv: any) => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthd.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.filter(
                            (nvth) => nvth.idNhanVien !== nv.idNhanVien
                        )
                    };
                } else {
                    return x;
                }
            })
        );
    };

    // modal chitiet giohang
    const showPopChiTietGioHang = (item: HoaDonChiTietDto) => {
        setIsShowEditGioHang(true);
        setIdCTHDChosing(item?.id);
    };

    const AgreeGioHang = (ctUpdate: PageHoaDonChiTietDto) => {
        setIsShowEditGioHang(false);
        // assign ctdoing --> used to update hoadhong dichvu of nhanvien
        setCTHDDoing({
            ...cthdDoing,
            soLuong: ctUpdate.soLuong,
            donGiaTruocCK: ctUpdate.donGiaTruocCK,
            laPTChietKhau: ctUpdate.laPTChietKhau,
            ptChietKhau: ctUpdate.ptChietKhau,
            tienChietKhau: ctUpdate.tienChietKhau,
            donGiaSauCK: ctUpdate.donGiaSauCK,
            donGiaSauVAT: ctUpdate.donGiaSauVAT,
            thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
            thanhTienSauCK: ctUpdate.thanhTienSauCK,
            thanhTienSauVAT: ctUpdate.thanhTienSauVAT
        });
        // update cthd + save to cache
        setHoaDonChiTiet(
            hoaDonChiTiet.map((item: any) => {
                if (item.id === ctUpdate.id) {
                    return {
                        ...item,
                        soLuong: ctUpdate.soLuong,
                        donGiaTruocCK: ctUpdate.donGiaTruocCK,
                        laPTChietKhau: ctUpdate.laPTChietKhau,
                        ptChietKhau: ctUpdate.ptChietKhau,
                        tienChietKhau: ctUpdate.tienChietKhau,
                        donGiaSauCK: ctUpdate.donGiaSauCK,
                        donGiaSauVAT: ctUpdate.donGiaSauVAT,
                        thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                        thanhTienSauCK: ctUpdate.thanhTienSauCK,
                        thanhTienSauVAT: ctUpdate.thanhTienSauVAT
                    };
                } else {
                    return item;
                }
            })
        );
    };

    // end modal chi tiet

    const RemoveCache = async () => {
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon.id)
            .delete()
            .then((deleteCount: any) =>
                console.log('idhoadondelete ', hoadon.id, 'deletecount', deleteCount)
            );
        await dbDexie.khachCheckIn
            .where('idCheckIn')
            .equals(triggerAddCheckIn.id as string)
            .delete()
            .then((deleteCount: any) =>
                console.log('idcheckindelete ', triggerAddCheckIn.id, 'deletecount', deleteCount)
            );
    };

    // customer: add/remove
    const dataContext_ofCustomer = useContext(DataCustomerContext);
    const listNguonKhach = dataContext_ofCustomer.listNguonKhach;
    const listNhomKhach = dataContext_ofCustomer.listNhomkhach;
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    const onChangeInputAtModalCustomer = (event: any) => {
        const { name, value } = event.target;
        setNewCus({
            ...newCus,
            [name]: value
        });
    };

    const changeCustomer = async (item: any = null) => {
        const cusChecking = new PageKhachHangCheckInDto({
            idKhachHang: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0
        });
        if (item !== null) {
            setIsShowModalAddCus(false);
            cusChecking.idKhachHang = item?.id;
            cusChecking.tenKhachHang = item?.tenKhachHang;
            cusChecking.maKhachHang = item?.maKhachHang;
            cusChecking.soDienThoai = item?.soDienThoai;

            const objCheckIn: KHCheckInDto = new KHCheckInDto({
                idKhachHang: cusChecking.idKhachHang as string,
                idChiNhanh: utils.checkNull(chiNhanhCurrent.id) ? idChiNhanh : chiNhanhCurrent.id
            });
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
            cusChecking.idCheckIn = dataCheckIn.id;
            cusChecking.dateTimeCheckIn = dataCheckIn.dateTimeCheckIn;

            await dbDexie.khachCheckIn.add(cusChecking);
            setTriggerAddCheckIn({ ...triggerAddCheckIn, id: dataCheckIn.id });
        }

        await updateCache_IfChangeCus(cusChecking);
    };

    const showModalAddCustomer = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            id: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            idNhomKhach: '',
            idNguonKhach: '',
            gioiTinh: false,
            moTa: '',
            idLoaiKhach: 1
        } as CreateOrEditKhachHangDto);
    };

    const updateCache_IfChangeCus = async (dataCheckIn: any) => {
        const idCheckInOld = triggerAddCheckIn.id as string; // always get state Id_Old
        // remove checkin DB
        await CheckinService.UpdateTrangThaiCheckin(idCheckInOld, 0);

        // remove cache khcheckin
        await dbDexie.khachCheckIn
            .where('idCheckIn')
            .equals(idCheckInOld)
            .delete()
            .then((deleteCount: any) =>
                console.log('idcheckindelete ', idCheckInOld, 'deletecount', deleteCount)
            );

        // update cache hoadon with new {idcus, cusName,..}
        const cacheHD = await dbDexie.hoaDon.where('id').equals(hoadon?.id).toArray();
        if (cacheHD.length > 0) {
            await dbDexie.hoaDon.update(hoadon?.id, {
                idKhachHang: dataCheckIn?.idKhachHang,
                tenKhachHang: dataCheckIn?.tenKhachHang,
                maKhachHang: dataCheckIn?.maKhachHang,
                soDienThoai: dataCheckIn?.soDienThoai
            });
        }
        // set state hoadon
        setHoaDon({
            ...hoadon,
            idKhachHang: dataCheckIn?.idKhachHang as unknown as null,
            maKhachHang: dataCheckIn?.maKhachHang,
            tenKhachHang: dataCheckIn?.tenKhachHang,
            soDienThoai: dataCheckIn?.soDienThoai
        });
    };

    const showModalCheckIn = async () => {
        setTriggerAddCheckIn({ ...triggerAddCheckIn, isShow: true, id: customerChosed?.idCheckIn });
    };

    const saveCheckInOK = async (dataCheckIn: any) => {
        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn.idKhachHang,
            idCheckIn: dataCheckIn.idCheckIn,
            maKhachHang: dataCheckIn.maKhachHang,
            tenKhachHang: dataCheckIn.tenKhachHang,
            soDienThoai: dataCheckIn.soDienThoai,
            tongTichDiem: dataCheckIn.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn
        });
        await dbDexie.khachCheckIn.add(cusChecking);
        setTriggerAddCheckIn({ ...triggerAddCheckIn, id: dataCheckIn.idCheckIn, isShow: false });

        await updateCache_IfChangeCus(cusChecking);
    };

    // end cutomer
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const checkSave = async () => {
        if (hoaDonChiTiet.length === 0) {
            setObjAlert({
                show: true,
                type: 2,
                mes: 'Vui lòng nhập chi tiết hóa đơn '
            });
            return false;
        }
        if (utils.checkNull(hoadon?.idKhachHang) || hoadon?.idKhachHang === Guid.EMPTY) {
            if (sumTienKhachTra < hoadon?.tongThanhToan) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Là khách lẻ. Không cho phép nợ'
                });
                return false;
            }
        }
        // if (lstQuyCT.length === 0) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn hình thức thanh toán '
        //     });
        //     return false;
        // }

        // const itemPos = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 2);
        // if (itemPos.length > 0 && utils.checkNull(itemPos[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản POS'
        //     });
        //     return false;
        // }

        // const itemCK = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 3);
        // if (itemCK.length > 0 && utils.checkNull(itemCK[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản chuyển khoản'
        //     });
        //     return false;
        // }

        return true;
    };

    const [hasTip, setHasTip] = useState(false); // mac dinh cua hang khong co Tip
    const [formShow, setFormShow] = useState(0);
    const [showPayment, setShowPayment] = useState(false);

    const onPrevPayment = () => {
        let formPrev = formShow - 1;
        if (!hasTip) {
            formPrev = formPrev - 1;
        }
        setFormShow(formPrev);
        setShowPayment(formPrev > 0);
        onPaymentChild(formPrev > 0);
    };

    const handleCheckNext = () => {
        let formNext = formShow + 1;
        if (!hasTip) {
            formNext += 1;
        }
        setFormShow(formNext);
        setShowPayment(true);
        onPaymentChild(true);
        if (formNext < 3) return false;
        return true;
    };

    const assignThongTinThanhToan = (arrQCT: QuyChiTietDto[]) => {
        setLstQuyCT([...arrQCT]);

        const tienKhachTra = utils.RoundDecimal(
            arrQCT.reduce((currentValue: number, item: QuyChiTietDto) => {
                return item.tienThu + utils.formatNumberToFloat(currentValue);
            }, 0)
        );

        setSumTienKhachTra(tienKhachTra);
        setTienThuaTraKhach(tienKhachTra - hoadon?.tongThanhToan);
    };

    const editInforHoaDon_atPayment = (
        ptGiamGiaHD: number,
        tongGiamGiaHD: number,
        khachPhaiTra: number,
        ghichuHD: string
    ) => {
        setHoaDon({
            ...hoadon,
            pTGiamGiaHD: ptGiamGiaHD,
            tongGiamGiaHD: tongGiamGiaHD,
            tongThanhToan: khachPhaiTra,
            ghiChuHD: ghichuHD
        });
    };

    // click thanh toan---> chon hinh thucthanhtoan--->   luu hoadon + phieuthu
    const saveHoaDon = async () => {
        setShowDetail(false);

        // const nextIsSave = handleCheckNext();
        // if (!nextIsSave) return;

        const check = await checkSave();
        if (!check) {
            return;
        }

        // assign again STT of cthd before save
        const dataSave = { ...hoadon };
        dataSave?.hoaDonChiTiet?.map((x: PageHoaDonChiTietDto, index: number) => {
            x.stt = index + 1;
        });
        const hodaDonDB = await HoaDonService.CreateHoaDon(dataSave);

        //checkout + update idHoadon (to checkin_hoadon)
        await CheckinService.UpdateTrangThaiCheckin(triggerAddCheckIn.id as string, 2);
        await CheckinService.Update_IdHoaDon_toCheckInHoaDon(
            triggerAddCheckIn.id as string,
            hodaDonDB.id
        );

        // again again if tra thua tien
        const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet(
            lstQuyCT,
            sumTienKhachTra,
            hoadon?.tongThanhToan ?? 0
        );

        // save soquy (Mat, POS, ChuyenKhoan)
        const tongThu = lstQCT_After.reduce((currentValue: number, item: any) => {
            return currentValue + item.tienThu;
        }, 0);
        if (tongThu > 0) {
            const quyHD: QuyHoaDonDto = new QuyHoaDonDto({
                idChiNhanh: utils.checkNull(chiNhanhCurrent.id) ? idChiNhanh : chiNhanhCurrent.id,
                idLoaiChungTu: 11,
                ngayLapHoaDon: hoadon.ngayLapHoaDon,
                tongTienThu: tongThu
            });
            // assign idHoadonLienQuan, idKhachHang for quyCT
            lstQCT_After.map((x: QuyChiTietDto) => {
                x.idHoaDonLienQuan = hodaDonDB.id;
                x.idKhachHang = hoadon.idKhachHang == Guid.EMPTY ? null : hoadon.idKhachHang;
            });
            quyHD.quyHoaDon_ChiTiet = lstQCT_After;
            await SoQuyServices.CreateQuyHoaDon(quyHD); // todo hoahong NV hoadon
        }

        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thanh toán hóa đơn thành công'
        });

        // print
        const chinhanh = await getInforChiNhanh_byID();
        setPropMauIn((old: PropToChildMauIn) => {
            return {
                ...old,
                hoadon: {
                    ...old.hoadon,
                    maHoaDon: hodaDonDB.maHoaDon,
                    daThanhToan: tongThu,
                    conNo: hoadon.tongThanhToan - tongThu
                },
                chinhanh: {
                    ...old.chinhanh,
                    tenChiNhanh: 'Spa',
                    soDienThoai: '1111' as unknown as null
                }
            } as PropToChildMauIn;
        });

        // if (chinhanh !== null) {
        //     // why not update chinhanh at mauin??
        //     setPropMauIn((old: any) => {
        //         return {
        //             ...old,
        //             chinhanh: {
        //                 ...old.chinhanh,
        //                 tenChiNhanh: chinhanh?.tenChiNhanh,
        //                 soDienThoai: chinhanh?.soDienThoai,
        //                 logo: logo // todo logo
        //             }
        //         };
        //     });
        // }

        handlePrint();

        // reset after save
        setClickSave(false);
        setFormShow(0);
        setShowPayment(false);

        setHoaDonChiTiet([]);
        setHoaDon(
            new PageHoaDonDto({
                id: Guid.create().toString(),
                idKhachHang: null,
                tenKhachHang: 'Khách lẻ'
            })
        );
        setTriggerAddCheckIn({ ...triggerAddCheckIn, id: '' });
        await RemoveCache();
    };

    // thêm 2 nút điều hướng cho phần cuộn ngang
    const containerRef = useRef<HTMLUListElement>(null);
    const [isScrollable, setIsScrollable] = useState<boolean>(false);

    const handleNextClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 150;
        }
    };

    const handlePrevClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 150;
        }
    };
    const handleScroll = () => {
        if (containerRef.current) {
            setIsScrollable(containerRef.current.scrollWidth > containerRef.current.clientWidth);
        }
    };

    // xử lý next và prev khi cuộn dọc
    const handleWheel = (event: React.WheelEvent<HTMLUListElement>) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += event.deltaY;
        }
    };

    useEffect(() => {
        const containerElement = containerRef.current;
        if (containerElement) {
            handleScroll();

            const resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(containerElement);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [CoditionLayout]);

    // start: page thanhtoan new
    const [showDetail, setShowDetail] = useState(false);
    const handleShowDetail = () => {
        setShowDetail(!showDetail);
        sendDataToParent(!showDetail);
    };

    const changeHinhThucThanhToan = (item: any) => {
        setLstQuyCT(
            lstQuyCT.map((itemCT: QuyChiTietDto) => {
                return { ...itemCT, hinhThucThanhToan: item.value, sHinhThucThanhToan: item?.text };
            })
        );
    };

    useEffect(() => {
        if (!afterRender.current) return;
        setLstQuyCT(
            lstQuyCT.map((itemCT: QuyChiTietDto) => {
                return { ...itemCT, tienThu: hoadon.tongThanhToan };
            })
        );
        setSumTienKhachTra(hoadon?.tongThanhToan ?? 0);
        setTienThuaTraKhach(0);
    }, [hoadon.tongThanhToan]);

    // end thanhtoan new
    return (
        <>
            <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={changeCustomer}
                handleChange={onChangeInputAtModalCustomer}
                title="Thêm mới khách hàng"
                formRef={newCus}
                suggestNguonKhach={listNguonKhach}
                suggestNhomKhach={listNhomKhach}
            />
            <ModelNhanVienThucHien triggerModal={propNVThucHien} handleSave={AgreeNVThucHien} />
            <ModalEditChiTietGioHang
                formType={1}
                isShow={isShowEditGioHang}
                hoadonChiTiet={hoaDonChiTiet.filter((x: any) => x.id === idCTHDChosing)}
                handleSave={AgreeGioHang}
                handleClose={() => setIsShowEditGioHang(false)}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <div style={{ display: 'none' }}>
                <MauInHoaDon ref={componentRef} props={propMauIn} />
            </div>
            <Grid
                container
                spacing={3}
                marginTop={showPayment ? '0' : '21px'}
                paddingLeft="16px"
                ml="0"
                sx={{
                    height: '100%',
                    '& > div:not(.normal)': {
                        paddingTop: '0!important'
                    }
                }}>
                {!showDetail ? (
                    <Grid
                        item
                        container
                        md={7}
                        spacing={3}
                        height="fit-content"
                        marginTop={CoditionLayout ? '-83px' : '-24px'}
                        paddingBottom="0"
                        bgcolor="#F8F8F8">
                        <Grid
                            item
                            md={CoditionLayout ? 12 : 4}
                            sx={{
                                paddingLeft: '0!important',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                            {CoditionLayout && (
                                <TextField
                                    fullWidth
                                    sx={{
                                        borderColor: '#CFD3D4!important',
                                        borderWidth: '1px!important',
                                        maxWidth: '55%',
                                        mr: '24px',
                                        boxShadow: ' 0px 20px 100px 0px #0000000D',
                                        maxHeight: '37px',
                                        marginLeft: 'auto',
                                        '& .MuiInputBase-root': {
                                            bgcolor: '#fff'
                                        },
                                        '& input': {
                                            color: '#3D475C!important'
                                        }
                                    }}
                                    size="small"
                                    className="search-field no-minWidth"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm kiếm"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            <Box
                                sx={{
                                    scrollBehavior: 'smooth',
                                    backgroundColor: CoditionLayout ? 'transparent' : '#fff',
                                    borderRadius: '8px',
                                    boxShadow: CoditionLayout
                                        ? 'unset'
                                        : ' 0px 20px 100px 0px #0000000D',
                                    padding: '16px 24px',
                                    height: CoditionLayout ? 'unset' : '100vh',
                                    overflowX: 'hidden',
                                    maxHeight: CoditionLayout ? 'unset' : '88.5vh',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '8px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}>
                                <Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <Typography
                                            variant="h3"
                                            fontSize="18px"
                                            color="#4C4B4C"
                                            fontWeight="700"
                                            onClick={() => choseLoaiHang(2)}>
                                            Nhóm dịch vụ
                                        </Typography>
                                        {isScrollable && (
                                            <Box
                                                sx={{
                                                    '& button': {
                                                        minWidth: 'unset',
                                                        bgcolor: 'unset!important'
                                                    }
                                                }}>
                                                <Button
                                                    variant="text"
                                                    onClick={handlePrevClick}
                                                    sx={{
                                                        '&:hover svg': {
                                                            color: 'var(--color-main)'
                                                        }
                                                    }}>
                                                    <ArrowBackIosIcon
                                                        sx={{
                                                            color: 'rgba(49, 157, 255, 0.5)'
                                                        }}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    onClick={handleNextClick}
                                                    sx={{
                                                        '&:hover svg': {
                                                            color: 'var(--color-main)'
                                                        }
                                                    }}>
                                                    <ArrowForwardIosIcon
                                                        sx={{
                                                            color: 'rgba(49, 157, 255, 0.5)'
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    <List
                                        onScroll={handleScroll}
                                        ref={containerRef}
                                        onWheel={handleWheel}
                                        sx={{
                                            display: CoditionLayout ? 'flex' : 'block',
                                            columnGap: '12px',
                                            flexWrap: CoditionLayout ? 'nowrap' : 'wrap',
                                            overflowX: 'auto',
                                            scrollBehavior: 'smooth',
                                            '&::-webkit-scrollbar': {
                                                width: '7px',
                                                height: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb:horizontal': {
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '8px'
                                            }
                                        }}>
                                        {nhomDichVu.map((nhomDV, index) => (
                                            <ListItem
                                                component="a"
                                                href={'#' + nhomDV.id}
                                                key={index}
                                                // onClick={() => choseNhomDichVu(nhomDV)}
                                                sx={{
                                                    gap: '6px',
                                                    padding: '8px 10px ',
                                                    overflow: 'hidden',
                                                    backgroundColor: nhomDV.color,
                                                    borderRadius: '8px',
                                                    marginTop: '12px',
                                                    cursor: 'pointer',
                                                    transition: '.4s',
                                                    minWidth: CoditionLayout ? '200px' : 'unset',
                                                    maxWidth: CoditionLayout ? '200px' : 'unset',
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        height: '100%',
                                                        width: '100%',
                                                        left: '0',
                                                        bottom: '0',
                                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                                        zIndex: '0',
                                                        opacity: '0',
                                                        transition: '.4s'
                                                    },
                                                    '&:hover::after': {
                                                        opacity: '1'
                                                    }
                                                }}>
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: '0',
                                                        position: 'relative',
                                                        zIndex: '2'
                                                    }}>
                                                    <IconDv style={{ color: '#F1FAFF' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    sx={{
                                                        '& .MuiTypography-root': {
                                                            color: '#F1FAFF',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%',
                                                            fontSize: '14px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontWeight: '600',
                                                            position: 'relative',
                                                            zIndex: '2'
                                                        }
                                                    }}
                                                    title={nhomDV.tenNhomHang}>
                                                    {nhomDV.tenNhomHang}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                        {nhomHangHoa.map((nhomHH, index) => (
                                            <ListItem
                                                component="a"
                                                href={'#' + nhomHH.id}
                                                key={index}
                                                sx={{
                                                    gap: '6px',
                                                    padding: '8px 10px',
                                                    overflow: 'hidden',
                                                    bgcolor: nhomHH.color,
                                                    borderRadius: '8px',
                                                    marginTop: '12px',
                                                    minWidth: CoditionLayout ? '200px' : 'unset',
                                                    maxWidth: CoditionLayout ? '200px' : 'unset',
                                                    cursor: 'pointer',
                                                    transition: '.4s',

                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        height: '100%',
                                                        width: '100%',
                                                        left: '0',
                                                        bottom: '0',
                                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                                        zIndex: '0',
                                                        opacity: '0',
                                                        transition: '.4s'
                                                    },
                                                    '&:hover::after': {
                                                        opacity: '1'
                                                    }
                                                }}
                                                // onClick={() => choseNhomDichVu(nhomHH)}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: '0',
                                                        position: 'relative',
                                                        zIndex: '2'
                                                    }}>
                                                    <IconDv style={{ color: '#F1FAFF' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    sx={{
                                                        '& .MuiTypography-root': {
                                                            color: '#F1FAFF',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%',
                                                            fontWeight: '600',
                                                            fontSize: '14px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            position: 'relative',
                                                            zIndex: '2'
                                                        }
                                                    }}
                                                    title={nhomHH.tenNhomHang}>
                                                    {nhomHH.tenNhomHang}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={CoditionLayout ? 12 : 8} sx={{ marginTop: '-58px' }}>
                            <Box display="flex" flexDirection="column">
                                {!CoditionLayout && (
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderColor: '#CFD3D4!important',
                                            borderWidth: '1px!important',

                                            boxShadow: ' 0px 20px 100px 0px #0000000D',

                                            margin: 'auto',
                                            '& input': {
                                                color: '#3D475C!important'
                                            }
                                        }}
                                        size="small"
                                        className="search-field"
                                        variant="outlined"
                                        type="search"
                                        placeholder="Tìm kiếm"
                                        value={txtSearch}
                                        onChange={(event) => {
                                            setTxtSearch(event.target.value);
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="24px"
                                    padding="16px"
                                    marginTop="16px"
                                    sx={{
                                        width: '100%',
                                        backgroundColor: CoditionLayout ? 'transparent' : '#fff',
                                        borderRadius: '8px',
                                        height:
                                            CoditionLayout && innerHeight > 600
                                                ? '74vh'
                                                : CoditionLayout && innerHeight < 605
                                                ? '32vh'
                                                : '88.5vh',
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        scrollBehavior: 'smooth',
                                        '&::-webkit-scrollbar': {
                                            width: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            bgcolor: 'var(--color-bg)'
                                        }
                                    }}>
                                    {listProduct.map((nhom: any, index: any) => (
                                        <Box key={index} id={nhom.idNhomHangHoa}>
                                            <Typography
                                                variant="h4"
                                                fontSize="16px"
                                                color="#000"
                                                pt="5px"
                                                fontWeight="700"
                                                marginBottom="11px">
                                                {nhom.tenNhomHang}
                                            </Typography>

                                            <Grid container spacing={1.5}>
                                                {nhom.hangHoas.map((item: any) => (
                                                    <Grid
                                                        item
                                                        xs={CoditionLayout ? 2.4 : 4}
                                                        key={item.id}>
                                                        <Box
                                                            minHeight="104px"
                                                            padding="8px 12px 9px 12px"
                                                            display="flex"
                                                            flexDirection="column"
                                                            justifyContent="space-between"
                                                            gap="16px"
                                                            borderRadius="4px"
                                                            sx={{
                                                                border: '1px solid transparent',
                                                                cursor: 'pointer',
                                                                transition: '.4s',
                                                                backgroundColor: 'var(--color-bg)',
                                                                '&:hover': {
                                                                    borderColor: 'var(--color-main)'
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                choseChiTiet(item, index);
                                                            }}>
                                                            <Typography
                                                                variant="h5"
                                                                fontSize="12px"
                                                                fontWeight="700"
                                                                color="#333233"
                                                                title={item.tenHangHoa}
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitBoxOrient: 'vertical',
                                                                    WebkitLineClamp: 2,
                                                                    maxHeight: '32px'
                                                                }}>
                                                                {item.tenHangHoa}
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize="14px"
                                                                color="#333233">
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    item.giaBan
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid
                        item
                        md={7}
                        className="normal"
                        sx={{
                            pt: '0!important',
                            marginTop: '-24px'
                        }}>
                        {/* <Payments
                            tongPhaiTra={hoadon?.tongThanhToan}
                            handleClickPrev={onPrevPayment}
                            passToParent={assignThongTinThanhToan}
                        /> */}
                        <DetailHoaDon
                            toggleDetail={handleShowDetail}
                            hinhThucTT={lstQuyCT.length === 1 ? lstQuyCT[0].hinhThucThanhToan : 0}
                            tongTienHang={hoadon?.tongTienHang}
                            onChangeQuyChiTiet={assignThongTinThanhToan}
                            onChangeHoaDon={editInforHoaDon_atPayment}
                            onClickThanhToan={saveHoaDon}
                        />
                    </Grid>
                )}
                <Grid item md={5} sx={{ paddingRight: '0' }}>
                    <Box
                        sx={{
                            mt: showDetail ? '-21px' : '-75px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',

                            height: '98vh',
                            padding: '16px',
                            marginRight: CoditionLayout ? '16px' : '0px',
                            paddingBottom: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            '&::after': {
                                content: "''",
                                pointerEvents: 'none',
                                position: 'absolute',
                                left: '0',
                                width: '100%',
                                height: '40px',
                                bottom: '-15px',
                                bgcolor: '#fff'
                            }
                        }}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                radius: '8px',
                                borderBottom: '1px solid #F2F2F2',
                                paddingBottom: '16px'
                            }}>
                            <Box display="flex" gap="8px" alignItems="center">
                                {hoadon?.tenKhachHang !== 'Khách lẻ' ? (
                                    <>
                                        <Avatar
                                            src={
                                                utils.checkNull(hoadon?.idKhachHang) ||
                                                hoadon?.idKhachHang === Guid.EMPTY
                                                    ? ''
                                                    : avatar
                                            }
                                            sx={{ width: 40, height: 40 }}
                                        />

                                        <Box onClick={showModalCheckIn}>
                                            <Typography
                                                variant="body2"
                                                fontSize="14px"
                                                color="#3D475C">
                                                {hoadon?.tenKhachHang}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize="12px"
                                                color="#525F7A">
                                                {hoadon?.soDienThoai}
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{ flexGrow: '1' }}>
                                        <Autocomplete
                                            sx={{
                                                '& .MuiAutocomplete-paper::-webkit-scrollbar': {
                                                    width: '8px'
                                                }
                                            }}
                                            fullWidth
                                            options={allNhanVien}
                                            getOptionLabel={(option) => option.tenNhanVien}
                                            renderOption={(props, option) => (
                                                <Box
                                                    component="li"
                                                    {...props}
                                                    sx={{ display: 'flex', gap: '8px' }}>
                                                    <Box>
                                                        <Avatar
                                                            sx={{ width: 24, height: 24 }}
                                                            src={option.avatar}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="body1"
                                                            fontSize="12px"
                                                            color="#3D475C">
                                                            {option.tenNhanVien}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            color="#667799"
                                                            fontSize="12px">
                                                            {option.soDienThoai}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    placeholder="Tìm kiếm"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                <SearchIcon />
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                )}
                                <Box sx={{ marginLeft: 'auto' }}>
                                    {utils.checkNull(hoadon?.idKhachHang) ||
                                    hoadon?.idKhachHang === Guid.EMPTY ? (
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                border: '1px solid var(--color-main)',
                                                bgcolor: '#fff',
                                                minWidth: 'unset',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px'
                                            }}>
                                            <Add onClick={showModalAddCustomer} />
                                        </Button>
                                    ) : (
                                        <>
                                            <IconButton>
                                                <VisibilityIcon
                                                    sx={{
                                                        color: '#8492AE',
                                                        width: '16px',
                                                        height: '16px'
                                                    }}
                                                />
                                            </IconButton>
                                            <IconButton>
                                                <Close
                                                    sx={{
                                                        color: '#8492AE',
                                                        width: '16px',
                                                        height: '16px'
                                                    }}
                                                    onClick={() => changeCustomer(null)}
                                                />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        {/* 1 row chi tiet */}
                        <Box
                            sx={{
                                scrollBehavior: 'smooth',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '7px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px'
                                },
                                '&::-webkit-scrollbar-track': {
                                    bgcolor: 'var(--color-bg)'
                                }
                            }}>
                            {hoaDonChiTiet?.map((ct: PageHoaDonChiTietDto, index) => (
                                <Box
                                    padding="8px 12px"
                                    borderBottom="1px solid #E0E4EB"
                                    marginTop="16px"
                                    key={index}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <Box width="55%" paddingRight="20px">
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                color="var(--color-main)"
                                                fontWeight="400"
                                                lineHeight="20px"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '1',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer'
                                                }}
                                                title={ct.tenHangHoa}
                                                onClick={() => showPopNhanVienThucHien(ct)}>
                                                {ct.tenHangHoa}
                                            </Typography>
                                            {/* nhan vien thuc hien */}
                                            {ct?.nhanVienThucHien !== undefined &&
                                                ct?.nhanVienThucHien.length > 0 && (
                                                    <>
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            flexWrap="wrap"
                                                            gap="8px">
                                                            {ct.nhanVienThucHien.map(
                                                                (nv: any, index3: number) => (
                                                                    <Typography
                                                                        key={index3}
                                                                        variant="body1"
                                                                        fontSize="10px"
                                                                        lineHeight="16px"
                                                                        color="#4C4B4C"
                                                                        alignItems="center"
                                                                        sx={{
                                                                            maxWidth:
                                                                                ct.nhanVienThucHien !==
                                                                                    undefined &&
                                                                                ct.nhanVienThucHien
                                                                                    .length === 1
                                                                                    ? '100%'
                                                                                    : ct.nhanVienThucHien !==
                                                                                          undefined &&
                                                                                      ct
                                                                                          .nhanVienThucHien
                                                                                          .length >
                                                                                          2
                                                                                    ? 'calc(50% - 23px)'
                                                                                    : 'calc(50% - 4px)',
                                                                            backgroundColor:
                                                                                'var(--color-bg)',
                                                                            padding: '4px 8px',
                                                                            gap: '4px',
                                                                            borderRadius: '100px',
                                                                            '& .remove-NV:hover img':
                                                                                {
                                                                                    filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                                                },
                                                                            display:
                                                                                index3 > 1
                                                                                    ? 'none'
                                                                                    : 'flex',
                                                                            width: 'auto'
                                                                        }}>
                                                                        <Box
                                                                            sx={{
                                                                                width: '100%',
                                                                                whiteSpace:
                                                                                    'nowrap',
                                                                                textOverflow:
                                                                                    'ellipsis',
                                                                                overflow: 'hidden'
                                                                            }}
                                                                            title={nv.tenNhanVien}>
                                                                            {nv.tenNhanVien}
                                                                        </Box>
                                                                        <span
                                                                            className="remove-NV"
                                                                            style={{
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() =>
                                                                                RemoveNVThucHien(
                                                                                    ct,
                                                                                    nv
                                                                                )
                                                                            }>
                                                                            <img
                                                                                src={closeIcon}
                                                                                alt="close"
                                                                            />
                                                                        </span>
                                                                    </Typography>
                                                                )
                                                            )}
                                                            {ct.nhanVienThucHien.length > 2 ? (
                                                                <Box
                                                                    sx={{
                                                                        fontSize: '10px',
                                                                        color: '#525F7A',
                                                                        padding: '4px 8px',
                                                                        borderRadius: '100px',
                                                                        bgcolor: 'var(--color-bg)',
                                                                        cursor: 'pointer'
                                                                    }}>
                                                                    {ct.nhanVienThucHien.length - 2}
                                                                    +
                                                                </Box>
                                                            ) : undefined}
                                                        </Box>
                                                    </>
                                                )}

                                            {/* {ct?.nhanVienThucHien.length > 0 && (
                                                
                                            )} */}
                                        </Box>
                                        <Box width="20%">
                                            <Typography
                                                color="#000"
                                                variant="body1"
                                                fontSize="14px"
                                                fontWeight="400"
                                                sx={{
                                                    display: 'flex',
                                                    gap: '8px',

                                                    transition: '.4s',
                                                    '& .price': {
                                                        fontSize: '14px',
                                                        color: 'var(--color-main)'
                                                    },
                                                    '& .price:hover': {
                                                        cursor: 'pointer'
                                                    },
                                                    '& .quantity': {
                                                        color: '#667799'
                                                    }
                                                }}>
                                                <Box component="span" className="quantity">
                                                    {' '}
                                                    {ct.soLuong + 'x'}{' '}
                                                </Box>
                                                <Box>
                                                    <Box
                                                        component="span"
                                                        onClick={() => showPopChiTietGioHang(ct)}
                                                        className="price">
                                                        {Intl.NumberFormat('vi-VN').format(
                                                            ct.donGiaTruocCK
                                                        )}
                                                    </Box>
                                                    {ct?.tienChietKhau !== undefined &&
                                                        ct?.tienChietKhau > 0 && (
                                                            <Typography
                                                                textAlign="center"
                                                                variant="body1"
                                                                color="#8492AE"
                                                                fontSize="10px"
                                                                fontStyle="italic">
                                                                <span>Giảm</span>{' '}
                                                                <span>
                                                                    {new Intl.NumberFormat(
                                                                        'vi-VN'
                                                                    ).format(
                                                                        ct?.tienChietKhau ?? 0
                                                                    )}
                                                                </span>
                                                            </Typography>
                                                        )}
                                                </Box>
                                            </Typography>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            width="25%"
                                            justifyContent="end">
                                            <Box
                                                sx={{
                                                    marginLeft: '8px',
                                                    display: 'flex',
                                                    gap: '10px'
                                                }}>
                                                <Typography
                                                    variant="body1"
                                                    color="#3D475C"
                                                    fontWeight="500"
                                                    fontSize="14px">
                                                    {' '}
                                                    {Intl.NumberFormat('vi-VN').format(
                                                        ct?.thanhTienSauCK ?? 0
                                                    )}
                                                </Typography>
                                                <Button
                                                    sx={{
                                                        minWidth: '0',
                                                        padding: '0',
                                                        '&:hover svg': {
                                                            filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                        }
                                                    }}>
                                                    <DeleteIcon
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: '#999699'
                                                        }}
                                                        onClick={() => {
                                                            deleteChiTietHoaDon(ct);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box marginTop="auto">
                            <Box pt="8px" display="none">
                                <Typography
                                    variant="h3"
                                    color="#333233"
                                    fontSize="14px"
                                    fontWeight="500"
                                    mb="8px">
                                    Mã giảm giá
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Nhập mã"
                                    value={hoadon?.ghiChuHD}
                                    onChange={(e) =>
                                        setHoaDon({ ...hoadon, ghiChuHD: e.target.value })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VoucherIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <Button
                                                variant="text"
                                                sx={{
                                                    padding: '0',
                                                    transition: '.4s',
                                                    bgcolor: 'transparent!important',
                                                    color: '#4C4B4C',
                                                    '&:hover': {
                                                        color: 'var(--color-main)'
                                                    }
                                                }}>
                                                Áp dụng
                                            </Button>
                                        )
                                    }}
                                    sx={{ '& input': { fontSize: '14px' } }}
                                />
                            </Box>

                            <Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    pt="16px"
                                    pb="16px"
                                    borderRadius="12px"
                                    paddingX="16px"
                                    bgcolor="#F9F9F9">
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography
                                            variant="h6"
                                            fontSize="16px"
                                            fontWeight="700"
                                            color="#3B4758">
                                            Tổng thanh toán
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="700"
                                            fontSize="16px"
                                            color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(
                                                hoadon?.tongThanhToan
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box display="none" justifyContent="space-between">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Giảm giá
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontSize="12px"
                                            color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(
                                                hoadon?.tongChietKhauHangHoa
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="none"
                                        justifyContent="space-between"
                                        borderBottom="1px solid #CBADC2"
                                        pb="8px">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Tổng giảm giá
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontSize="12px"
                                            color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(
                                                hoadon?.tongChietKhauHangHoa
                                            )}
                                        </Typography>
                                    </Box>
                                    <Grid container justifyContent="space-between">
                                        <Grid
                                            item
                                            xs="auto"
                                            sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                color="#3D475C"
                                                fontWeight="500">
                                                Tiền khách trả
                                            </Typography>
                                        </Grid>
                                        <Grid item xs="auto">
                                            {lstQuyCT.length > 1 ? (
                                                <Box
                                                    sx={{
                                                        mb: '8px',
                                                        display: 'flex',
                                                        gap: '16px',
                                                        '& .item': {
                                                            fontSize: '14px',
                                                            color: '#525F7A'
                                                        },
                                                        '& > div': {
                                                            display: 'flex',
                                                            gap: '5px'
                                                        }
                                                    }}>
                                                    {lstQuyCT.map(
                                                        (ctQuy: QuyChiTietDto, index3: number) => (
                                                            <Box key={index3}>
                                                                <Box className="label item">
                                                                    {ctQuy.sHinhThucThanhToan}:
                                                                </Box>
                                                                <Box className="value item">
                                                                    {new Intl.NumberFormat(
                                                                        'vi-VN'
                                                                    ).format(ctQuy.tienThu)}
                                                                </Box>
                                                            </Box>
                                                        )
                                                    )}
                                                </Box>
                                            ) : (
                                                <RadioGroup
                                                    sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    {AppConsts.hinhThucThanhToan.map(
                                                        (item, index) => (
                                                            <FormControlLabel
                                                                sx={{
                                                                    '& .MuiFormControlLabel-label':
                                                                        {
                                                                            fontSize: '14px'
                                                                        },

                                                                    marginRight:
                                                                        index === 2 ? '0' : '16px'
                                                                }}
                                                                key={index}
                                                                label={item?.text}
                                                                checked={
                                                                    lstQuyCT.length == 1 &&
                                                                    lstQuyCT[0]
                                                                        .hinhThucThanhToan ===
                                                                        item.value
                                                                }
                                                                onChange={() => {
                                                                    changeHinhThucThanhToan(item);
                                                                }}
                                                                control={
                                                                    <Radio
                                                                        value={item.value}
                                                                        size="small"
                                                                    />
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </RadioGroup>
                                            )}
                                        </Grid>
                                        <Grid xs={12} item>
                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={sumTienKhachTra}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                sx={{
                                                    '& input': {
                                                        textAlign: 'right',
                                                        fontWeight: '700',
                                                        color: '#3D475C',
                                                        fontSize: '16px',
                                                        padding: '14px'
                                                    }
                                                }}
                                                customInput={TextField}
                                                onChange={(event) =>
                                                    setLstQuyCT(
                                                        lstQuyCT.map((itemQuy: QuyChiTietDto) => {
                                                            return {
                                                                ...itemQuy,
                                                                tienThu: utils.formatNumberToFloat(
                                                                    event.target.value
                                                                )
                                                            };
                                                        })
                                                    )
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box
                                        display={tienThuaTraKhach != 0 ? 'flex' : 'none'}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt="8px">
                                        <Typography
                                            variant="h5"
                                            fontWeight="400"
                                            fontSize="14px"
                                            color="#3B4758">
                                            {tienThuaTraKhach > 0
                                                ? 'Tiền thừa'
                                                : 'Tiên khách thiếu'}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="700"
                                            fontSize="16px"
                                            color="#3B4758">
                                            {new Intl.NumberFormat('vi-VN').format(
                                                Math.abs(tienThuaTraKhach)
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'stretch',
                                        mt: '24px',
                                        gap: '8px'
                                    }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ minWidth: 'unset' }}
                                        onClick={handleShowDetail}>
                                        <MoreHorizIcon sx={{ color: '#525F7A' }} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#fff',
                                            textTransform: 'unset!important',
                                            backgroundColor: 'var(--color-main)!important',
                                            paddingY: '12px',
                                            transition: '.3s',
                                            opacity: showDetail ? '0.2' : '1',
                                            pointerEvents: showDetail ? 'none' : 'all'
                                        }}
                                        className="btn-container-hover"
                                        onClick={saveHoaDon}>
                                        Thanh Toán
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default PageBanHang;
