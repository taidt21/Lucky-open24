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
import CloseIcon from '@mui/icons-material/Close';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import { addDays, format, isDate, parse } from 'date-fns';
import AppConsts from '../../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import { TrendingUpTwoTone } from '@mui/icons-material';
import { PagedNhanSuRequestDto } from '../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import {
    TaiKhoanNganHangDto,
    NganHangDto
} from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../../services/so_quy/TaiKhoanNganHangServices';
import AutocompleteBank from '../../../../components/Autocomplete/Bank';

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
const ModalTaiKhoanNganHang = ({ show = false, idTaiKhoanNganHang = null, onClose, onOk }: any) => {
    const [allBank, setAllBank] = useState<NganHangDto[]>([]);

    const [taiKhoanNganHang, setTaiKhoanNganHang] = useState<TaiKhoanNganHangDto>({
        id: '',
        idNganHang: '',
        tenChuThe: '',
        soTaiKhoan: ''
    } as TaiKhoanNganHangDto);

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: '' //Chu the TPBank 011 022 033
    });

    const validate = yup.object().shape({
        tenChuThe: yup.string().required('Vui lòng nhập tên chủ thẻ'),
        soTaiKhoan: yup.string().required('Vui lòng nhập số tài khoản'),
        idNganHang: yup.string().required('Vui lòng chọn ngân hàng') // todo (chua check dc)
    });

    const GetAllNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBank();
        if (data != null) {
            setAllBank(data.items);
        }
    };

    const PageLoad = () => {
        GetAllNganHang();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (utils.checkNull(idTaiKhoanNganHang)) {
            // insert
            setTaiKhoanNganHang({
                ...taiKhoanNganHang,
                id: Guid.create().toString(),
                idNganHang: '',
                soTaiKhoan: '',
                tenChuThe: '',
                ghiChu: ''
            });
        } else {
            // update
            if (show) console.log(2);
        }
    }, [show]);

    const deleteAccountBank = () => {
        console.log(1);
    };

    const saveAccountBank = async () => {
        const data = await TaiKhoanNganHangServices.CreateOrEditBankAccount(taiKhoanNganHang);
        setTaiKhoanNganHang({ ...taiKhoanNganHang, id: data.id });

        const dataSave = { ...taiKhoanNganHang };
        dataSave.id = data.id;
        onOk(dataSave);
    };

    return (
        <>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteAccountBank}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Dialog open={show} fullWidth maxWidth={'sm'} onClose={onClose}>
                <DialogTitle>
                    <div className="row">
                        <Box className="col-8" sx={{ float: 'left' }}>
                            {utils.checkNull(idTaiKhoanNganHang) ? 'Thêm mới' : 'Cập nhật'} tài
                            khoản ngân hàng
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
                <DialogContent>
                    <Formik
                        initialValues={taiKhoanNganHang}
                        validationSchema={validate}
                        onSubmit={saveAccountBank}
                        enableReinitialize>
                        {(formik) => (
                            <>
                                {console.log('formik ', formik.values)}
                                <Form>
                                    <Grid container rowGap={1} columnSpacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Ngân hàng </span>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            sx={{
                                                '& label': {
                                                    display: 'none'
                                                },
                                                '& legend': {
                                                    display: 'none'
                                                }
                                            }}>
                                            <AutocompleteBank
                                                idChosed={taiKhoanNganHang?.idNganHang}
                                                listOption={allBank}
                                                handleChoseItem={(item: any) => {
                                                    {
                                                        formik.setFieldValue(
                                                            'idNganHang',
                                                            item?.id ?? null
                                                        );
                                                        setTaiKhoanNganHang({
                                                            ...taiKhoanNganHang,
                                                            idNganHang: item?.id,
                                                            tenNganHang: item?.tenNganHang
                                                        });
                                                    }
                                                }}
                                                error={
                                                    formik.touched.idNganHang &&
                                                    Boolean(formik.errors?.idNganHang)
                                                }
                                                helperText={
                                                    formik.touched.idNganHang &&
                                                    formik.errors.idNganHang
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Tên chủ thẻ </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={taiKhoanNganHang?.tenChuThe}
                                                helperText={
                                                    formik.touched.tenChuThe &&
                                                    formik.errors.tenChuThe
                                                }
                                                error={
                                                    formik.touched.tenChuThe &&
                                                    Boolean(formik.errors?.tenChuThe)
                                                }
                                                onChange={(e) => {
                                                    {
                                                        formik.setFieldValue(
                                                            'tenChuThe',
                                                            e.target.value
                                                        );
                                                        setTaiKhoanNganHang({
                                                            ...taiKhoanNganHang,
                                                            tenChuThe: e.target.value
                                                        });
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Số tài khoản</span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={taiKhoanNganHang?.soTaiKhoan}
                                                error={
                                                    formik.touched.soTaiKhoan &&
                                                    Boolean(formik.errors?.soTaiKhoan)
                                                }
                                                helperText={
                                                    formik.touched.soTaiKhoan &&
                                                    formik.errors.soTaiKhoan
                                                }
                                                onChange={(e) => {
                                                    formik.setFieldValue(
                                                        'soTaiKhoan',
                                                        e.target.value
                                                    );
                                                    setTaiKhoanNganHang({
                                                        ...taiKhoanNganHang,
                                                        soTaiKhoan: e.target.value
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Ghi chú</span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={taiKhoanNganHang?.ghiChu}
                                                onChange={(e: any) =>
                                                    setTaiKhoanNganHang({
                                                        ...taiKhoanNganHang,
                                                        ghiChu: e.target.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <DialogActions>
                                        <Button
                                            variant="contained"
                                            className="btn-container-hover"
                                            type="submit"
                                            disabled={formik.isSubmitting}>
                                            Lưu
                                        </Button>

                                        {!utils.checkNull(idTaiKhoanNganHang) && (
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
                                                                mes: `Bạn có chắc chắn muốn xóa tài khoản ${taiKhoanNganHang.tenChuThe} không?`
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
export default ModalTaiKhoanNganHang;
