import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as AddIcon } from '../../../images/add.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { Formik, Form } from 'formik';
import { SuggestKhachHangDto } from '../../../services/suggests/dto/SuggestKhachHangDto';
import { SuggestNhanVienDichVuDto } from '../../../services/suggests/dto/SuggestNhanVienDichVuDto';
import AppConsts from '../../../lib/appconst';
import datLichService from '../../../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';
import useWindowWidth from '../../../components/StateWidth';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import { ReactComponent as IconMore } from '../../../images/iconContainer.svg';
import rules from './create-or-edit-lich-hen.validate';
import { SuggestDichVuDto } from '../../../services/suggests/dto/SuggestDichVuDto';
interface ICreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    idLichHen: string;
    suggestDichVu: SuggestDichVuDto[];
    suggestKhachHang: SuggestKhachHangDto[];
    suggestNhanVien: SuggestNhanVienDichVuDto[];
    onOk: () => void;
}

class CreateOrEditLichHenModal extends Component<ICreateOrEditProps> {
    handleSubmit = async (values: any) => {
        if (this.props.idLichHen === '') {
            const createResult = await datLichService.CreateBooking({
                idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
                idDonViQuiDoi: values.idDonViQuiDoi,
                idKhachHang: values.idKhachHang,
                idNhanVien: values.idNhanVien,
                startHours: values.startHours,
                startTime: values.startTime,
                ghiChu: values.ghiChu,
                trangThai: values.trangThai
            });
            createResult != null
                ? enqueueSnackbar('Thêm mới thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
                : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                      variant: 'error',
                      autoHideDuration: 3000
                  });
        }
        this.props.onOk();
    };
    render(): ReactNode {
        const { visible, onCancel, idLichHen, suggestDichVu, suggestKhachHang, suggestNhanVien } =
            this.props;
        const initialValues = {
            id: '',
            idChiNhanh: '',
            startTime: '',
            startHours: '',
            trangThai: 0,
            ghiChu: '',
            idKhachHang: '',
            idNhanVien: '',
            idDonViQuiDoi: ''
        };
        const options = [
            { tenKhachHang: 'Thêm mới', soDienThoai: 'add_new', id: '' },
            ...suggestKhachHang
        ];
        return (
            <div>
                <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="md">
                    <DialogTitle sx={{ borderBottom: '1px solid #E6E1E6' }}>
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            color="rgb(51, 50, 51)"
                            fontWeight="700">
                            {idLichHen ? 'Cập nhật lịch hẹn' : 'Thêm cuộc hẹn'}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pr: '0', pb: '0' }}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={this.handleSubmit}
                            validationSchema={rules}>
                            {({ errors, touched, values, handleChange, setFieldValue }) => (
                                <Form
                                    onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault(); // Prevent form submission
                                        }
                                    }}>
                                    <Grid container spacing={[8, 3]}>
                                        <Grid item xs={12} sm={5} sx={{ pr: '20px' }}>
                                            {/* <FormGroup> */}
                                            <Autocomplete
                                                sx={{ pt: '24px' }}
                                                options={options}
                                                getOptionLabel={(option) =>
                                                    `${option.tenKhachHang} (${option.soDienThoai})`
                                                }
                                                size="small"
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue(
                                                        'idKhachHang',
                                                        value ? value.id : ''
                                                    ); // Cập nhật giá trị id trong Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Tìm tên"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    {
                                                                        params.InputProps
                                                                            .startAdornment
                                                                    }
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.idKhachHang && (
                                                <small className="text-danger">
                                                    {errors.idKhachHang}
                                                </small>
                                            )}
                                            {/* </FormGroup> */}
                                            <Box
                                                textAlign="center"
                                                mt="5vw"
                                                display={useWindowWidth() < 600 ? 'none' : 'block'}>
                                                <Box>
                                                    <IconMore />
                                                </Box>
                                                <Box mt="2.7777777777777777vw">
                                                    <Typography
                                                        variant="body1"
                                                        fontSize="20px"
                                                        fontWeight="500"
                                                        color="#000">
                                                        Thêm khách hàng
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        color="#8B8D97"
                                                        fontSize="14px"
                                                        fontWeight="400"
                                                        mt="12px">
                                                        Sử dụng tìm kiếm để thêm khách hàng
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={7}
                                            rowSpacing={4}
                                            sx={{ bgcolor: '#F9FAFC', pr: '24px', mt: '16px' }}>
                                            <FormGroup className="mt-4 mb-1">
                                                <Typography
                                                    variant="body1"
                                                    className="mb-1"
                                                    fontSize="14px">
                                                    Ngày
                                                </Typography>
                                                <TextField
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            bgcolor: '#fff'
                                                        }
                                                    }}
                                                    type="date"
                                                    size="small"
                                                    name="startTime"
                                                    value={values.startTime}
                                                    onChange={handleChange}></TextField>
                                                {errors.startTime && (
                                                    <small className="text-danger">
                                                        {errors.startTime}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <Grid
                                                container
                                                item
                                                sx={{
                                                    bgcolor: '#fff',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    position: 'relative'
                                                }}>
                                                <Grid container item spacing={2}>
                                                    <Grid item md={8} sm={6} xs={12}>
                                                        <FormGroup className="mt-2 mb-1">
                                                            <Typography
                                                                variant="body1"
                                                                className="mb-2"
                                                                fontSize="14px">
                                                                Dịch vụ
                                                            </Typography>
                                                            <Autocomplete
                                                                options={suggestDichVu}
                                                                getOptionLabel={(option) =>
                                                                    `${option.tenDichVu}`
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                disablePortal
                                                                onChange={(event, value) => {
                                                                    setFieldValue(
                                                                        'idDonViQuiDoi',
                                                                        value ? value.id : ''
                                                                    ); // Cập nhật giá trị id trong Formik
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Nhập tên dịch vụ"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.idDonViQuiDoi && (
                                                                <small className="text-danger">
                                                                    {errors.idDonViQuiDoi}
                                                                </small>
                                                            )}
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormGroup className="mt-2 mb-1">
                                                            <Typography
                                                                variant="body1"
                                                                className="mb-1"
                                                                fontSize="14px">
                                                                Thời gian bắt đầu
                                                            </Typography>
                                                            <TextField
                                                                type="time"
                                                                size="small"
                                                                name="startHours"
                                                                value={values.startHours}
                                                                onChange={handleChange}></TextField>
                                                            {errors.startHours && (
                                                                <small className="text-danger">
                                                                    {errors.startHours}
                                                                </small>
                                                            )}
                                                        </FormGroup>
                                                    </Grid>
                                                </Grid>
                                                <Grid container item spacing={[4, 2]}>
                                                    <Grid item md={8} sm={6} xs={12}>
                                                        <FormGroup className="mt-2 mb-1">
                                                            <Typography
                                                                variant="body1"
                                                                className="mb-1"
                                                                fontSize="14px">
                                                                Nhân viên
                                                            </Typography>
                                                            <Autocomplete
                                                                options={suggestNhanVien}
                                                                getOptionLabel={(option) =>
                                                                    `${option.tenNhanVien}`
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                disablePortal
                                                                onChange={(event, value) => {
                                                                    setFieldValue(
                                                                        'idNhanVien',
                                                                        value ? value.id : ''
                                                                    ); // Cập nhật giá trị id trong Formik
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Nhập tên nhân viên"
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12}>
                                                        <FormGroup className="mt-2 mb-1">
                                                            <Typography
                                                                variant="body1"
                                                                className="mb-1"
                                                                fontSize="14px">
                                                                Thời gian làm
                                                            </Typography>
                                                            <TextField
                                                                type="number"
                                                                size="small"></TextField>
                                                        </FormGroup>
                                                    </Grid>
                                                </Grid>
                                                <IconButton
                                                    onClick={undefined}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: '0',
                                                        top: '0',
                                                        '& svg': {
                                                            width: '12px',
                                                            height: '12px'
                                                        }
                                                    }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Grid>

                                            <Button
                                                startIcon={<AddIcon />}
                                                variant="text"
                                                sx={{
                                                    color: 'var(--color-main)',
                                                    '& svg': {
                                                        filter: 'var(--color-hoverIcon)'
                                                    },
                                                    '& .MuiButton-startIcon': {
                                                        marginRight: '4px',
                                                        marginBottom: '3px'
                                                    }
                                                }}>
                                                Thêm dịch vụ
                                            </Button>
                                            <Grid item>
                                                <FormGroup className="mt-2 mb-1">
                                                    <Typography
                                                        variant="body1"
                                                        className="mb-1"
                                                        fontSize="14px">
                                                        Trạng thái
                                                    </Typography>
                                                    <Select
                                                        fullWidth
                                                        size="small"
                                                        name="trangThai"
                                                        value={values.trangThai}
                                                        onChange={handleChange}>
                                                        {AppConsts.trangThaiCheckIn.map((item) => (
                                                            <MenuItem
                                                                key={item.value}
                                                                value={item.value}>
                                                                {item.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            </Grid>
                                            <Grid item>
                                                <FormGroup className="mt-2 mb-4">
                                                    <Typography
                                                        variant="body1"
                                                        className="mb-1"
                                                        fontSize="14px">
                                                        Ghi chú
                                                    </Typography>
                                                    <TextField
                                                        type="text"
                                                        multiline
                                                        rows={4}
                                                        size="small"
                                                        name="ghiChu"
                                                        value={values.ghiChu}
                                                        onChange={handleChange}></TextField>
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <DialogActions
                                        sx={{
                                            pr: '0',
                                            pb: '24px',
                                            position: 'sticky',
                                            bgcolor: '#fff',
                                            bottom: '0',
                                            left: '0'
                                        }}>
                                        <Grid container>
                                            <Grid item xs={12} sx={{ bgcolor: '#F9FAFC' }}>
                                                <Box
                                                    display="flex"
                                                    justifyContent="end"
                                                    gap="8px"
                                                    sx={{
                                                        '& button': {
                                                            textTransform: 'unset!important'
                                                        }
                                                    }}>
                                                    <Button
                                                        className="btn-container-hover"
                                                        variant="contained"
                                                        size="small"
                                                        type="submit"
                                                        sx={{
                                                            backgroundColor:
                                                                'var(--color-main)!important'
                                                        }}>
                                                        Lưu
                                                    </Button>
                                                    <Button
                                                        className="btn-outline-hover"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            borderColor: '#E6E1E6',
                                                            color: 'var(--color-main)'
                                                        }}
                                                        onClick={onCancel}>
                                                        Hủy
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
export default CreateOrEditLichHenModal;
