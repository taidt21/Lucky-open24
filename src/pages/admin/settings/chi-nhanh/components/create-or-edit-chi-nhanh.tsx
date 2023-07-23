import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
    Box
} from '@mui/material';
import { Component, ReactNode } from 'react';

import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { CreateOrEditChiNhanhDto } from '../../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import { Form, Formik } from 'formik';
import chiNhanhService from '../../../../../services/chi_nhanh/chiNhanhService';
interface ChiNhanhProps {
    isShow: boolean;
    onSave: () => void;
    onCLose: () => void;
    formRef: CreateOrEditChiNhanhDto;
    title: React.ReactNode;
}
class CreateOrEditChiNhanhModal extends Component<ChiNhanhProps> {
    render(): ReactNode {
        const { formRef, onSave, onCLose, title, isShow } = this.props;
        const initValues: CreateOrEditChiNhanhDto = formRef;
        return (
            <Dialog open={isShow} onClose={onCLose} fullWidth maxWidth={'md'}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onCLose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            '&:hover svg': {
                                filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values) => {
                            await chiNhanhService.CreateOrEdit(values);
                            onSave();
                        }}>
                        {({ handleChange, values, errors }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Mã chi nhánh
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="maChiNhanh"
                                            placeholder="Nhập mã chi nhánh"
                                            value={values.maChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Tên chi nhánh
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder="Nhập tên chi nhánh"
                                            name="tenChiNhanh"
                                            value={values.tenChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Số điện thoại
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="soDienThoai"
                                            placeholder="Nhập số điện thoại"
                                            value={values.soDienThoai}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Địa chỉ
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder="Nhập địa chỉ"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ngày áp dụng
                                        </Typography>
                                        <TextField
                                            size="small"
                                            type="date"
                                            name="ngayApDung"
                                            value={values.ngayApDung}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ngày hết hạn
                                        </Typography>
                                        <TextField
                                            size="small"
                                            type="date"
                                            name="ngayHetHan"
                                            value={values.ngayHetHan}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ghi chú
                                        </Typography>
                                        <TextField
                                            size="small"
                                            rows={4}
                                            multiline
                                            placeholder="Ghi chú"
                                            name="ghiChu"
                                            value={values.ghiChu}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        paddingRight: '0!important',
                                        position: 'sticky',
                                        bottom: '0',
                                        left: '0',
                                        bgcolor: '#fff'
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            height: '32px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff'
                                            }}
                                            type="submit"
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: 'var(--color-main)'
                                            }}
                                            onClick={this.props.onCLose}
                                            className="btn-outline-hover">
                                            Hủy
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default CreateOrEditChiNhanhModal;
