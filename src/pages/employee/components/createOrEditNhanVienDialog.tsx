import { Component, ReactNode } from 'react';
import { CreateOrUpdateNhanSuDto } from '../../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    Grid,
    MenuItem,
    Select,
    TextField,
    TextareaAutosize,
    Typography
} from '@mui/material';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import closeIcon from '../../../images/close-square.svg';
import { SuggestChucVuDto } from '../../../services/suggests/dto/SuggestChucVuDto';
import '../employee.css';
import { Form, Formik } from 'formik';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import rules from './createOrEditNhanVien.validate';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import useWindowWidth from '../../../components/StateWidth';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: () => void;
    formRef: CreateOrUpdateNhanSuDto;
    suggestChucVu: SuggestChucVuDto[];
}

class CreateOrEditEmployeeDialog extends Component<ICreateOrEditUserProps> {
    state = {
        avatarFile: ''
    };
    onSelectAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const avatar = {
                    fileBase64: reader.result?.toString().split(',')[1],
                    fileName: file.name,
                    fileType: file.type
                };
                this.props.formRef.avatarFile = avatar;
                this.setState({ avatarFile: reader.result?.toString() });
            };
        }
    };
    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef, suggestChucVu } = this.props;
        const initValues: CreateOrUpdateNhanSuDto = formRef;

        return (
            <Dialog
                open={visible}
                onClose={onCancel}
                className="poppup-them-nhan-vien"
                sx={{
                    borderRadius: '12px',

                    width: '100%',
                    padding: '28px 24px'
                }}>
                <Box
                    sx={{
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        bgcolor: '#fff',
                        zIndex: '5',
                        paddingBottom: '8px'
                    }}>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="#333233"
                        fontWeight="700"
                        paddingLeft="24px"
                        marginTop="28px">
                        {title}
                    </Typography>
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

                <Typography
                    color="#999699"
                    fontSize="16px"
                    fontWeight="700"
                    variant="h3"
                    paddingLeft="24px"
                    marginTop="28px">
                    Thông tin chi tiết
                </Typography>

                <Formik
                    initialValues={initValues}
                    validationSchema={rules}
                    onSubmit={async (values) => {
                        values.tenNhanVien = values.ho + ' ' + values.tenLot;
                        const createOrEdit = await nhanVienService.createOrEdit(values);
                        console.log(createOrEdit);
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
                        onOk();
                    }}>
                    {({ handleChange, errors, values, setFieldValue }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent form submission
                                }
                            }}>
                            <Box
                                display="flex"
                                flexDirection={useWindowWidth() < 600 ? 'column' : 'row'}
                                justifyContent="space-between"
                                paddingRight="24px">
                                <Grid
                                    container
                                    className="form-container"
                                    spacing={3}
                                    width={useWindowWidth() > 600 ? '70%' : '100%'}
                                    paddingRight={useWindowWidth() > 600 ? '12px' : '0'}
                                    paddingBottom="5vw"
                                    marginTop="0"
                                    marginLeft="0">
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            hidden
                                            size="small"
                                            name="id"
                                            value={values.id}></TextField>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Họ nhân viên
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="ho"
                                            value={values.ho}
                                            placeholder="Họ nhân viên"
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                        {errors.ho && (
                                            <small className="text-danger">{errors.ho}</small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Tên nhân viên
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="tenLot"
                                            value={values.tenLot}
                                            placeholder="Tên nhân viên"
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                        {errors.tenLot && (
                                            <small className="text-danger">{errors.tenLot}</small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Số điện thoại
                                        </Typography>
                                        <TextField
                                            type="tel"
                                            name="soDienThoai"
                                            value={values.soDienThoai}
                                            size="small"
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                        {errors.soDienThoai && (
                                            <small className="text-danger">
                                                {errors.soDienThoai}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Địa chỉ
                                        </Typography>
                                        <TextField
                                            type="text"
                                            size="small"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ của nhân viên"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ngày sinh
                                        </Typography>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            name="ngaySinh"
                                            value={values.ngaySinh?.substring(0, 10)}
                                            onChange={handleChange}
                                            placeholder="21/04/2004"
                                            sx={{ fontSize: '16px' }}
                                            size="small"></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giới tính
                                        </Typography>
                                        <Select
                                            id="gender"
                                            fullWidth
                                            name="gioiTinh"
                                            value={values.gioiTinh}
                                            onChange={handleChange}
                                            defaultValue={0}
                                            sx={{
                                                height: '42px',
                                                backgroundColor: '#fff',
                                                padding: '0',
                                                fontSize: '16px',
                                                borderRadius: '8px',
                                                borderColor: '#E6E1E6'
                                            }}>
                                            <MenuItem value={0}>Lựa chọn</MenuItem>
                                            <MenuItem value={2}>Nữ</MenuItem>
                                            <MenuItem value={1}>Nam</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Vị trí
                                        </Typography>
                                        <Autocomplete
                                            options={suggestChucVu}
                                            getOptionLabel={(option) => `${option.tenChucVu}`}
                                            size="small"
                                            fullWidth
                                            disablePortal
                                            onChange={(event, value) => {
                                                setFieldValue(
                                                    'idChucVu',
                                                    value ? value.idChucVu : ''
                                                ); // Cập nhật giá trị id trong Formik
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Nhập tên vị trí"
                                                />
                                            )}
                                        />
                                        {errors.idChucVu && (
                                            <small className="text-danger">{errors.idChucVu}</small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ghi chú
                                        </Typography>
                                        <TextareaAutosize
                                            placeholder="Điền"
                                            name="ghiChu"
                                            value={values.ghiChu?.toString()}
                                            maxRows={4}
                                            minRows={4}
                                            style={{
                                                width: '100%',
                                                borderColor: '#E6E1E6',
                                                borderRadius: '8px',
                                                padding: '16px'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    width={useWindowWidth() > 600 ? '30%' : '100%'}
                                    paddingLeft="12px">
                                    <Grid item xs={12}>
                                        <Box
                                            height="250px"
                                            position="relative"
                                            paddingTop="5.0403vh"
                                            style={{ textAlign: 'center', borderColor: '#FFFAFF' }}>
                                            <img
                                                hidden={
                                                    this.state.avatarFile == undefined ||
                                                    this.state.avatarFile == ''
                                                }
                                                src={this.state.avatarFile}
                                                width={'220px'}
                                                height={'200px'}
                                            />
                                            <TextField
                                                onChange={this.onSelectAvatarFile}
                                                type="file"
                                                id="input-file"
                                                name="avatarFile"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    border: 'none!important',
                                                    height: '100%'
                                                }}
                                                InputProps={{
                                                    style: {
                                                        position: 'absolute',
                                                        height: '100%',
                                                        width: '100%',
                                                        top: '0',
                                                        left: '0'
                                                    }
                                                }}
                                            />
                                            <Box
                                                hidden={
                                                    this.state.avatarFile != undefined &&
                                                    this.state.avatarFile != ''
                                                }
                                                sx={{
                                                    display: 'flex',
                                                    marginTop: '34px',
                                                    justifyContent: 'center',
                                                    '& img': {
                                                        filter: 'var(--color-hoverIcon)'
                                                    }
                                                }}>
                                                <img src={fileSmallIcon} />
                                                <Typography>Tải ảnh lên</Typography>
                                            </Box>
                                            <Box
                                                style={{ color: '#999699', marginTop: '13px' }}
                                                hidden={
                                                    this.state.avatarFile != undefined &&
                                                    this.state.avatarFile != ''
                                                }>
                                                File định dạng{' '}
                                                <Typography style={{ color: '#333233' }}>
                                                    jpeg, png
                                                </Typography>{' '}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    position: 'sticky',
                                    bgcolor: '#fff',
                                    bottom: '0',
                                    display: 'flex',
                                    gap: '8px',
                                    padding: '8px 24px 8px 8px',

                                    right: '50px',
                                    justifyContent: 'end'
                                }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: '#fff',

                                        border: 'none'
                                    }}
                                    className="btn-container-hover">
                                    Lưu
                                </Button>
                                <Button
                                    onClick={onCancel}
                                    variant="outlined"
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: 'var(--color-main)'
                                    }}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        );
    }
}
export default CreateOrEditEmployeeDialog;
