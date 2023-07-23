import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack,
    debounce
} from '@mui/material';

import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../../components/Autocomplete/Customer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import { addDays, format, isDate, parse } from 'date-fns';
import AppConsts, { ISelect } from '../../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import { TrendingUpTwoTone } from '@mui/icons-material';
import { PagedNhanSuRequestDto } from '../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import ModalTaiKhoanNganHang from './modal_tai_khoan_ngan_hang';
import AutocompleteAccountBank from '../../../../components/Autocomplete/AccountBank';
import TaiKhoanNganHangServices from '../../../../services/so_quy/TaiKhoanNganHangServices';
import {
    NganHangDto,
    TaiKhoanNganHangDto
} from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';

interface SoQuyDialogProps {
    visiable: boolean;
    onClose: () => void;
    onOk: (dataSave: any, type: number) => void;
    idQuyHD: string | null;
}

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    minWidth: '100%'
                }
            }
        }
    }
});
const CreateOrEditSoQuyDialog = ({
    visiable = false,
    idQuyHD = null,
    onClose,
    onOk
}: SoQuyDialogProps) => {
    const doiTuongNopTien = [
        { value: 1, text: 'Khách hàng' },
        // { id: 2, text: 'Nhà cung cấp' },
        { value: 3, text: 'Nhân viên' }
    ];
    console.log('CreateOrEditSoQuyDialog ');

    const formRef = useRef();
    const chinhanh = useContext(ChiNhanhContext);
    const [errMaHoadon, setErrMaHoaDon] = useState('');
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [bankAccount, setBankAccount] = useState<TaiKhoanNganHangDto[]>([]);
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [isShowModalAccountBank, setIsShowModalAccountBank] = useState(false);

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: chinhanh.id,
            idLoaiChungTu: 11,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );
    const sLoai = quyHoaDon?.idLoaiChungTu === 11 ? 'thu' : 'chi';

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetForEdit(idQuyHD ?? '');
        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;

            if (quyCT !== undefined && quyCT?.length > 0) {
                setQuyHoaDon({
                    ...quyHoaDon,
                    id: data.id,
                    idChiNhanh: data.idChiNhanh,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? 3 : 1,
                    idDoiTuongNopTien:
                        quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: quyCT[0].hinhThucThanhToan,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    idTaiKhoanNganHang: quyCT[0].idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT
                });
            }
        }
    };
    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien(data.items);
    };

    const GetAllBankAcount = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        if (data != null) {
            setBankAccount(data);
        }
    };

    const PageLoad = () => {
        GetListNhanVien();
        GetAllBankAcount();
    };

    useEffect(() => {
        PageLoad();
    }, []);
    useEffect(() => {
        if (utils.checkNull(idQuyHD)) {
            // insert
            setQuyHoaDon({
                ...quyHoaDon,
                id: Guid.create().toString(),
                idChiNhanh: chinhanh.id,
                idLoaiChungTu: 11,
                tongTienThu: 0,
                idDoiTuongNopTien: null,
                maHoaDon: '',
                loaiDoiTuong: 1,
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm'),
                noiDungThu: '',
                hinhThucThanhToan: 1,
                idKhoanThuChi: null,
                idTaiKhoanNganHang: null,
                hachToanKinhDoanh: true
            });
        } else {
            // update
            if (visiable) getInforQuyHoaDon();
        }
    }, [visiable]);

    const deleteSoQuy = () => {
        setinforDelete({ ...inforDelete, show: false });
        onOk(quyHoaDon, 3);
    };

    const saveSoQuy = async () => {
        const myData = { ...quyHoaDon };
        const idKhachHang = (
            quyHoaDon.loaiDoiTuong == 3 ? null : quyHoaDon.idDoiTuongNopTien
        ) as null;
        const idNhanVien = (
            quyHoaDon.loaiDoiTuong == 3 ? quyHoaDon.idDoiTuongNopTien : null
        ) as null;

        if (utils.checkNull(idQuyHD)) {
            // insert
            const quyCT = new QuyChiTietDto({
                idKhachHang: idKhachHang,
                hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                tienThu: quyHoaDon.tongTienThu,
                idNhanVien: idNhanVien,
                idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang as null
            });
            myData.quyHoaDon_ChiTiet = [quyCT];
            const data = await SoQuyServices.CreateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            onOk(quyHoaDon, 1);
        } else {
            // update
            // assign again ctquy
            myData.quyHoaDon_ChiTiet = quyHoaDon.quyHoaDon_ChiTiet?.map((x: any) => {
                return {
                    id: x.id,
                    idQuyHoaDon: x.idQuyHoaDon,
                    idKhachHang: idKhachHang,
                    hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                    tienThu: quyHoaDon.tongTienThu,
                    idNhanVien: idNhanVien,
                    idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                    diemThanhToan: x.diemThanhToan,
                    chiPhiNganHang: x.chiPhiNganHang,
                    idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang,
                    laPTChiPhiNganHang: x.laPTChiPhiNganHang,
                    thuPhiTienGui: x.thuPhiTienGui
                } as QuyChiTietDto;
            });
            const data = await SoQuyServices.UpdateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            onOk(quyHoaDon, 2);
        }
    };

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            loaiPhieu: quyHoaDon.idLoaiChungTu === 11 ? 'Phiếu thu' : 'Phiếu chi'
        });
    }, [quyHoaDon.idLoaiChungTu]);

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            sHinhThucThanhToan: AppConsts.hinhThucThanhToan.filter(
                (x: ISelect) => x.value === quyHoaDon.hinhThucThanhToan
            )[0]?.text
        });
    }, [quyHoaDon.hinhThucThanhToan]);

    // todo validate ngaylapHoaDon
    const validate = yup.object().shape({
        hinhThucThanhToan: yup.number(),
        // check dc mã, nhưng call API quá nhiều lần
        maHoaDon: yup.string().test('maHoaDon', 'Mã phiếu đã tồn tại', async () => {
            if (!utils.checkNull(quyHoaDon?.maHoaDon)) {
                const response = await SoQuyServices.CheckExistsMaPhieuThuChi(
                    quyHoaDon?.maHoaDon ?? '',
                    idQuyHD
                );
                return !response;
            }
            return true;
        }),
        tongTienThu: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền'),
        idDoiTuongNopTien: yup.string().required('Vui lòng chọn đối tượng nộp tiền')
        // idTaiKhoanNganHang: yup
        //     .string()
        //     .when('hinhThucThanhToan', ([hinhThucThanhToan], schema) => {
        //         if (hinhThucThanhToan !== 1)
        //             return yup.string().required('Vui lòng chọn tài khoản ngân hàng');
        //         return schema;
        //     })
    });

    const saveOKAccountBank = (dataSave: any) => {
        setQuyHoaDon({
            ...quyHoaDon,
            idTaiKhoanNganHang: dataSave.id,
            tenNganHang: dataSave.tenNganHang,
            tenChuThe: dataSave.tenChuThe
        });
        setIsShowModalAccountBank(false);

        setBankAccount([dataSave, ...bankAccount]);

        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thêm tài khoản ngân hàng thành công'
        });
    };

    return (
        <>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <ModalTaiKhoanNganHang
                show={isShowModalAccountBank}
                onClose={() => {
                    setIsShowModalAccountBank(false);
                }}
                onOk={saveOKAccountBank}
            />
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onClose}>
                <DialogTitle>
                    <div className="row">
                        <Box
                            className="col-8"
                            sx={{ float: 'left', fontSize: '24px', fontWeight: '700' }}>
                            {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} sổ quỹ
                        </Box>
                        <Box
                            className="col-4"
                            sx={{
                                float: 'right',
                                '& svg:hover': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon
                                style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                                onClick={onClose}
                            />
                        </Box>
                    </div>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '0' }}>
                    <Formik
                        initialValues={quyHoaDon}
                        validationSchema={validate}
                        onSubmit={saveSoQuy}
                        enableReinitialize>
                        {(formik) => (
                            <>
                                <Form
                                    onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault(); // Prevent form submission
                                        }
                                    }}>
                                    <Grid container rowGap={1} columnSpacing={2}>
                                        <Grid item xs={12} sm={12} lg={12}>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Radio
                                                        color="secondary"
                                                        value={11}
                                                        checked={quyHoaDon.idLoaiChungTu === 11}
                                                        onChange={() =>
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idLoaiChungTu: 11
                                                            })
                                                        }
                                                    />
                                                }
                                                label="Phiếu thu"
                                            />
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Radio
                                                        color="secondary"
                                                        name="idLoaiChungTu"
                                                        value={12}
                                                        checked={quyHoaDon.idLoaiChungTu === 12}
                                                        onChange={() =>
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idLoaiChungTu: 12
                                                            })
                                                        }
                                                    />
                                                }
                                                label="Phiếu chi"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Ngày </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <ThemeProvider theme={themeDate}>
                                                <DateTimePickerCustom
                                                    defaultVal={quyHoaDon.ngayLapHoaDon}
                                                    handleChangeDate={(dt: string) => {
                                                        formik.setFieldValue('ngayLapHoaDon', dt);
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            ngayLapHoaDon: dt
                                                        });
                                                    }}
                                                    helperText={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        formik.errors.idDoiTuongNopTien
                                                    }
                                                />
                                            </ThemeProvider>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack direction="column" rowGap={1}>
                                                <span className="modal-lable">Mã phiếu </span>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={quyHoaDon.maHoaDon}
                                                    onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'maHoaDon',
                                                            e.target.value
                                                        );
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            maHoaDon: e.target.value
                                                        });
                                                    }}
                                                    helperText={
                                                        formik.touched.maHoaDon &&
                                                        formik.errors.maHoaDon
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack
                                                direction="column"
                                                rowGap={1}
                                                sx={{
                                                    '& legend': {
                                                        display: 'none'
                                                    }
                                                }}>
                                                <span className="modal-lable">Hình thức </span>
                                                <SelectWithData
                                                    data={AppConsts.hinhThucThanhToan}
                                                    idChosed={quyHoaDon?.hinhThucThanhToan}
                                                    handleChange={(item: ISelect) =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            hinhThucThanhToan: item.value
                                                        })
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack
                                                direction="column"
                                                rowGap={1}
                                                sx={{
                                                    '& legend': {
                                                        display: 'none'
                                                    }
                                                }}>
                                                <span className="modal-lable">
                                                    {utils.FirstChar_UpperCase(sLoai)}{' '}
                                                    {quyHoaDon?.idLoaiChungTu == 11 ? 'của' : 'cho'}
                                                </span>
                                                <SelectWithData
                                                    data={doiTuongNopTien}
                                                    idChosed={quyHoaDon?.loaiDoiTuong}
                                                    handleChange={(item: any) =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            loaiDoiTuong: item.value
                                                        })
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            pt={{ xs: 2, sm: '28px', lg: '28px' }}>
                                            {quyHoaDon.loaiDoiTuong !== 3 && (
                                                <>
                                                    <AutocompleteCustomer
                                                        idChosed={quyHoaDon?.idDoiTuongNopTien}
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idDoiTuongNopTien',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idDoiTuongNopTien: item?.id,
                                                                    maNguoiNop: item?.maKhachHang,
                                                                    tenNguoiNop: item?.tenKhachHang
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            Boolean(
                                                                formik.errors?.idDoiTuongNopTien
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            formik.errors.idDoiTuongNopTien
                                                        }
                                                    />
                                                </>
                                            )}
                                            {quyHoaDon.loaiDoiTuong === 3 && (
                                                <>
                                                    <AutocompleteNhanVien
                                                        idChosed={quyHoaDon?.idDoiTuongNopTien}
                                                        dataNhanVien={allNhanVien}
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idDoiTuongNopTien',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idDoiTuongNopTien: item?.id,
                                                                    maNguoiNop: item?.maNhanVien,
                                                                    tenNguoiNop: item?.tenNhanVien
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            Boolean(
                                                                formik.errors?.idDoiTuongNopTien
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            formik.errors.idDoiTuongNopTien
                                                        }
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Tiền {sLoai} </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                name="tongTienThu"
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={quyHoaDon?.tongTienThu}
                                                customInput={TextField}
                                                onChange={(e: any) => {
                                                    formik.setFieldValue(
                                                        'tongTienThu',
                                                        e.target.value
                                                    );
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        tongTienThu: utils.formatNumberToFloat(
                                                            e.target.value
                                                        )
                                                    });
                                                }}
                                                error={
                                                    formik.touched?.tongTienThu &&
                                                    Boolean(formik.errors?.tongTienThu)
                                                }
                                                helperText={
                                                    formik.touched.tongTienThu &&
                                                    formik.errors.tongTienThu
                                                }
                                            />
                                        </Grid>
                                        {/*  không cần chọn tài khoản ngân hàng*/}
                                        {quyHoaDon?.hinhThucThanhToan === 0 && (
                                            <>
                                                <Grid item xs={12} sm={12}>
                                                    <span className="modal-lable">
                                                        Tài khoản {sLoai}{' '}
                                                    </span>
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <AutocompleteAccountBank
                                                        listOption={bankAccount}
                                                        idChosed={quyHoaDon.idTaiKhoanNganHang}
                                                        handleClickBtnAdd={() =>
                                                            setIsShowModalAccountBank(true)
                                                        }
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idTaiKhoanNganHang',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idTaiKhoanNganHang: item?.id,
                                                                    tenNganHang: item.tenNganHang,
                                                                    tenChuThe: item.tenChuThe
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idTaiKhoanNganHang &&
                                                            Boolean(
                                                                formik.errors?.idTaiKhoanNganHang
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.idTaiKhoanNganHang &&
                                                            formik.errors.idTaiKhoanNganHang
                                                        }
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Nội dung {sLoai} </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={quyHoaDon?.noiDungThu}
                                                onChange={(e: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        noiDungThu: e.target.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} style={{ display: 'none' }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    value="end"
                                                    control={
                                                        <Checkbox
                                                            name="ckHachToanKinhDoanh"
                                                            checked={
                                                                quyHoaDon.hachToanKinhDoanh === true
                                                            }
                                                            onChange={(e: any) => {
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    hachToanKinhDoanh:
                                                                        e.target.checked
                                                                });
                                                            }}
                                                            value="true"
                                                            sx={{
                                                                color: '#7C3367!important'
                                                            }}
                                                        />
                                                    }
                                                    label="Hạch toán vào kết quả hoạt động kinh doanh"
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                    <DialogActions
                                        sx={{
                                            paddingRight: '0!important',
                                            position: 'sticky',
                                            bottom: '0',
                                            bgcolor: '#fff',
                                            left: '0'
                                        }}>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: '#7C3367' }}
                                            className="btn-container-hover"
                                            type="submit"
                                            disabled={formik.isSubmitting}>
                                            Lưu
                                        </Button>

                                        {!utils.checkNull(idQuyHD) && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: 'red' }}
                                                    className="btn-container-hover"
                                                    onClick={() => {
                                                        setinforDelete(
                                                            new PropConfirmOKCancel({
                                                                show: true,
                                                                title: 'Xác nhận xóa',
                                                                mes: `Bạn có chắc chắn muốn xóa ${
                                                                    quyHoaDon?.loaiPhieu ?? ' '
                                                                }  ${
                                                                    quyHoaDon?.maHoaDon ?? ' '
                                                                } không?`
                                                            })
                                                        );
                                                    }}>
                                                    Xóa
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            variant="outlined"
                                            sx={{ color: 'var(--color-main)' }}
                                            className="btn-outline-hover"
                                            onClick={onClose}>
                                            Hủy
                                        </Button>
                                    </DialogActions>
                                </Form>
                            </>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default CreateOrEditSoQuyDialog;
