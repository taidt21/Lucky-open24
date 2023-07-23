import { Component, ReactNode } from 'react';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    MenuItem,
    Select,
    TextField,
    TextareaAutosize,
    Typography,
    Dialog
} from '@mui/material';
import useWindowWidth from '../../../components/StateWidth';
import fileIcon from '../../../images/file.svg';
import closeIcon from '../../../images/close-square.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import React from 'react';
import { Form, Formik } from 'formik';
import khachHangService from '../../../services/khach-hang/khachHangService';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import { SuggestNhomKhachDto } from '../../../services/suggests/dto/SuggestNhomKhachDto';
import { SuggestNguonKhachDto } from '../../../services/suggests/dto/SuggestNguonKhachDto';
export interface ICreateOrEditCustomerProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: ({ dataSave }: any) => void;
    handleChange: (event: any) => void;
    formRef: CreateOrEditKhachHangDto;
    suggestNhomKhach: SuggestNhomKhachDto[];
    suggestNguonKhach: SuggestNguonKhachDto[];
}
class CreateOrEditCustomerDialog extends Component<ICreateOrEditCustomerProps> {
    state = {
        errorPhoneNumber: false,
        errorTenKhach: false
    };

    render(): ReactNode {
        const {
            visible,
            onCancel,
            title,
            onOk,
            formRef,
            handleChange,
            suggestNguonKhach,
            suggestNhomKhach
        } = this.props;
        const initValues: CreateOrEditKhachHangDto = formRef;
        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="lg" fullWidth>
                <Box sx={{ padding: '24px' }}>
                    <div className="poppup-title">{title}</div>
                    <div className="poppup-des">Thông tin chi tiết</div>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values) => {
                            formRef.idNhomKhach = values.idNhomKhach;
                            formRef.idNguonKhach = values.idNguonKhach;
                            const isValidPhoneNumber = AppConsts.phoneRegex.test(
                                formRef.soDienThoai
                            );
                            console.log(isValidPhoneNumber);
                            if (isValidPhoneNumber == false) {
                                this.setState({ errorPhoneNumber: true });
                            }
                            if (formRef.tenKhachHang === '' || formRef.tenKhachHang === null) {
                                this.setState({ errorTenKhach: true });
                            }
                            if (formRef.tenKhachHang && isValidPhoneNumber) {
                                const createOrEdit = await khachHangService.createOrEdit(formRef);
                                createOrEdit != null
                                    ? formRef.id === AppConsts.guidEmpty
                                        ? enqueueSnackbar('Thêm mới thành công', {
                                              variant: 'success',
                                              autoHideDuration: 3000
                                          })
                                        : enqueueSnackbar('Cập nhật thành công', {
                                              variant: 'success',
                                              autoHideDuration: 3000
                                          })
                                    : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                                          variant: 'error',
                                          autoHideDuration: 3000
                                      });
                                this.setState({ errorPhoneNumber: false, errorTenKhach: false });
                                onOk(createOrEdit);
                            }
                        }}>
                        {({ setFieldValue }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Box
                                    className="form-add"
                                    sx={{
                                        '& .text-danger': {
                                            fontSize: '12px'
                                        }
                                    }}>
                                    <Grid container className="form-container" spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                name="id"
                                                value={formRef.id}
                                                fullWidth
                                                hidden></TextField>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Họ và tên
                                            </Typography>
                                            <TextField
                                                size="small"
                                                placeholder="Họ và tên"
                                                name="tenKhachHang"
                                                value={formRef.tenKhachHang}
                                                onChange={handleChange}
                                                helperText={
                                                    this.state.errorTenKhach ? (
                                                        <small className="text-danger">
                                                            Tên khách hàng không được để trống
                                                        </small>
                                                    ) : null
                                                }
                                                fullWidth
                                                sx={{
                                                    fontSize: '16px',
                                                    color: '#4c4b4c'
                                                }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Số điện thoại
                                            </Typography>
                                            <TextField
                                                type="tel"
                                                size="small"
                                                name="soDienThoai"
                                                value={formRef.soDienThoai}
                                                onChange={handleChange}
                                                placeholder="Số điện thoại"
                                                fullWidth
                                                helperText={
                                                    this.state.errorPhoneNumber ? (
                                                        <small className="text-danger">
                                                            Số điện thoại không hợp lệ
                                                        </small>
                                                    ) : null
                                                }
                                                sx={{ fontSize: '16px' }}></TextField>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Địa chỉ
                                            </Typography>
                                            <TextField
                                                type="text"
                                                size="small"
                                                placeholder="Nhập địa chỉ của khách hàng"
                                                name="diaChi"
                                                value={formRef.diaChi}
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{ fontSize: '16px' }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Ngày sinh
                                            </Typography>
                                            <TextField
                                                type="date"
                                                fullWidth
                                                placeholder="21/04/2004"
                                                name="ngaySinh"
                                                value={
                                                    formRef.ngaySinh != null
                                                        ? formRef.ngaySinh
                                                              ?.toString()
                                                              .substring(0, 10)
                                                        : ''
                                                }
                                                onChange={handleChange}
                                                sx={{ fontSize: '16px' }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Giới tính
                                            </Typography>
                                            <Select
                                                id="gender"
                                                fullWidth
                                                value={formRef.gioiTinh ? 'true' : 'false'}
                                                name="gioiTinh"
                                                onChange={handleChange}
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#fff',
                                                    padding: '0',
                                                    fontSize: '16px',
                                                    borderColor: '#E6E1E6'
                                                }}>
                                                <MenuItem value="">Lựa chọn</MenuItem>
                                                <MenuItem value="false">Nữ</MenuItem>
                                                <MenuItem value="true">Nam</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Nhóm khách
                                            </Typography>
                                            <Autocomplete
                                                options={suggestNhomKhach}
                                                getOptionLabel={(option) =>
                                                    `${option.tenNhomKhach}`
                                                }
                                                size="small"
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue(
                                                        'idNhomKhach',
                                                        value ? value.id : undefined
                                                    );
                                                    // Cập nhật giá trị id trong Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Nhập nhóm khách"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Nguồn khách
                                            </Typography>
                                            <Autocomplete
                                                options={suggestNguonKhach}
                                                getOptionLabel={(option) =>
                                                    `${option.tenNguonKhach}`
                                                }
                                                size="small"
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue(
                                                        'idNguonKhach',
                                                        value ? value.id : undefined
                                                    ); // Cập nhật giá trị id trong Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Nhập nguồn khách"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography color="#4C4B4C" variant="subtitle2">
                                                Ghi chú
                                            </Typography>
                                            <TextareaAutosize
                                                placeholder="Điền"
                                                name="moTa"
                                                value={formRef.moTa}
                                                onChange={handleChange}
                                                maxRows={4}
                                                minRows={4}
                                                style={{
                                                    width: '100%',
                                                    borderColor: '#E6E1E6',
                                                    borderRadius: '8px',
                                                    padding: '16px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        sx={{ width: useWindowWidth() > 600 ? '350px' : '100%' }}
                                        className=" box-1">
                                        <Grid item xs={12} className="position-relative">
                                            <div
                                                className=" inner-box"
                                                style={{ textAlign: 'center' }}>
                                                <img src={fileIcon} />
                                                <TextField
                                                    type="file"
                                                    name="avatar"
                                                    value={formRef.avatar}
                                                    onChange={handleChange}
                                                    id="input-file"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        marginTop: '34px',
                                                        justifyContent: 'center',
                                                        '& img': {
                                                            filter: 'var(--color-hoverIcon)'
                                                        }
                                                    }}>
                                                    <img src={fileSmallIcon} />
                                                    <div>Tải ảnh lên</div>
                                                </Box>
                                                <div
                                                    style={{ color: '#999699', marginTop: '13px' }}>
                                                    File định dạng{' '}
                                                    <span style={{ color: '#333233' }}>
                                                        jpeg, png
                                                    </span>{' '}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}></Grid>
                                        <Grid item xs={6}></Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '8px',
                                        padding: '8px',
                                        justifyContent: 'end',
                                        marginTop: useWindowWidth() > 600 ? '0' : '24px',
                                        bgcolor: '#fff',
                                        position: useWindowWidth() > 600 ? 'static' : 'sticky',
                                        bottom: '0',
                                        left: '0'
                                    }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#fff',

                                            border: 'none'
                                        }}
                                        type="submit"
                                        className="btn-container-hover">
                                        Lưu
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#666466'
                                        }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                    <Button
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            top: '32px',
                            right: '28px',
                            padding: '0',
                            maxWidth: '24px',
                            minWidth: '0',
                            '&:hover img': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <img src={closeIcon} />
                    </Button>
                </Box>
            </Dialog>
        );
    }
}
export default CreateOrEditCustomerDialog;
