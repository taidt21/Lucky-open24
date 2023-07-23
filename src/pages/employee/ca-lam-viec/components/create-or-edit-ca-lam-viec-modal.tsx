import { Component, ReactNode } from 'react';
import { CreateOrEditCaLamViecDto } from '../../../../services/nhan-vien/ca_lam_viec/dto/createOrEditCaLamViecDto';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormLabel,
    FormControlLabel,
    Checkbox,
    Grid,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Field, Form, Formik } from 'formik';
import caLamViecService from '../../../../services/nhan-vien/ca_lam_viec/caLamViecService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../../lib/appconst';
interface CreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditCaLamViecDto;
}
class CreateOrEditCaLamViecDialog extends Component<CreateOrEditProps> {
    render(): ReactNode {
        const { visible, onCancel, title, createOrEditDto } = this.props;
        const initValues = createOrEditDto;
        const handleSubmit = async (values: CreateOrEditCaLamViecDto) => {
            const createOrEdit = await caLamViecService.ceateOrEdit(values);
            createOrEdit != null
                ? values.id === AppConsts.guidEmpty || values.id === ''
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
            onCancel();
        };
        const date = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <div className="row">
                        <Box
                            className="col-8"
                            sx={{ float: 'left', fontWeight: '500', fontSize: '24px' }}>
                            {title}
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
                                onClick={onCancel}
                            />
                        </Box>
                    </div>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '0' }}>
                    <Formik initialValues={initValues} onSubmit={handleSubmit}>
                        {({ values, handleChange }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Field as={TextField} type="text" name="id" hidden />
                                <TextField
                                    className="mt-2"
                                    value={values.maCa}
                                    type="text"
                                    name="maCa"
                                    size="small"
                                    disabled
                                    hidden
                                />
                                <FormGroup>
                                    <FormLabel className="modal-lable">Tên ca</FormLabel>
                                    <TextField
                                        className="mt-2"
                                        value={values.tenCa}
                                        type="text"
                                        name="tenCa"
                                        size="small"
                                        onChange={handleChange}
                                        placeholder="Nhập tên ca"
                                    />
                                </FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{
                                                color: 'var(--color-main)!important'
                                            }}
                                        />
                                    }
                                    label="Không cố định thời gian"
                                />
                                <Grid
                                    container
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    className="mt-2">
                                    <Grid item xs={12} sm={6}>
                                        <FormGroup>
                                            <FormLabel className="modal-lable">
                                                Bắt đầu ca
                                            </FormLabel>
                                            <TextField
                                                className="mt-2"
                                                type="time"
                                                size="small"
                                                name="gioVao"
                                                value={values.gioVao}
                                                onChange={handleChange}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormGroup>
                                            <FormLabel className="modal-lable">
                                                Kết thúc ca
                                            </FormLabel>
                                            <TextField
                                                type="time"
                                                className="mt-2"
                                                size="small"
                                                name="gioRa"
                                                value={values.gioRa}
                                                onChange={handleChange}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormGroup
                                            sx={{
                                                '& textarea': {
                                                    height: '100px',
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                    borderRadius: '8px'
                                                }
                                            }}>
                                            <FormLabel className="modal-lable">Mô tả</FormLabel>
                                            <textarea className="mt-2"></textarea>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormLabel className="modal-lable">Lặp lại</FormLabel>
                                        <Select
                                            className="mt-2"
                                            defaultValue="1"
                                            fullWidth
                                            sx={{
                                                '& .MuiSelect-select': {
                                                    paddingY: '12.5px'
                                                }
                                            }}>
                                            <MenuItem value="1">Hàng tuần</MenuItem>
                                            <MenuItem value="2">Hàng ngày</MenuItem>
                                            <MenuItem value="3">Hàng tháng</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {date.map((item, index) => (
                                            <FormControlLabel
                                                sx={{
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '14px!important'
                                                    }
                                                }}
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                    />
                                                }
                                                label={item}
                                            />
                                        ))}
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        paddingRight: '0',
                                        position: 'sticky',
                                        bottom: '0',
                                        left: '0',
                                        bgcolor: '#fff',
                                        zIndex: '5'
                                    }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        className="btn-container-hover">
                                        Lưu
                                    </Button>
                                    <Button
                                        sx={{
                                            color: 'var(--color-main)!important',
                                            bgcolor: '#fff!important'
                                        }}
                                        variant="outlined"
                                        type="button"
                                        onClick={onCancel}
                                        className="btn-cancel-dialog btn-outline-hover">
                                        Hủy
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default CreateOrEditCaLamViecDialog;
