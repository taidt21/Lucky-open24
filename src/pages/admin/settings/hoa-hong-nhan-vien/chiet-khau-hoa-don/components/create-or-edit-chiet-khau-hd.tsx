import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem,
    ListItemText
} from '@mui/material';
import Select from '@mui/material/Select';
import { ReactComponent as CloseIcon } from '../../../../../../images/close-square.svg';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import { Form, Formik } from 'formik';
import chietKhauHoaDonStore from '../../../../../../stores/chietKhauHoaDonStore';
import { enqueueSnackbar } from 'notistack';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    formRef: CreateOrEditChietKhauHoaDonDto;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
const loaiChungTu = [
    'Hóa đơn bán lẻ',
    'Gói dịch vụ',
    'Báo giá',
    'Phiếu nhập kho nhà cung cấp',
    'Phiếu xuất kho',
    'Khách trả hàng',
    'Thẻ giá trị',
    'Phiếu kiểm kê',
    'Chuyển hàng',
    'Phiếu thu',
    'Phiếu chi',
    'Điều chỉnh giá vốn',
    'Nhận hàng'
];
class CreateOrEditChietKhauHoaDonModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited, formRef } = this.props;
        const initValues: CreateOrEditChietKhauHoaDonDto = formRef;
        return (
            <Dialog open={visited} fullWidth maxWidth="md" onClose={onClose}>
                <DialogTitle sx={{ fontSize: '24px', fontWeight: '700' }}>
                    {title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values) => {
                            const createOrEdit = await chietKhauHoaDonStore.createOrEdit(values);
                            enqueueSnackbar(createOrEdit.message, {
                                variant: createOrEdit.status,
                                autoHideDuration: 3000
                            });
                            await onSave();
                        }}>
                        {({ handleChange, errors, values }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={4} rowSpacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Chứng từ áp dụng
                                        </Typography>
                                        <Select
                                            size="small"
                                            name="chungTuApDung"
                                            multiple
                                            onChange={handleChange}
                                            value={values.chungTuApDung}
                                            renderValue={(selected: any) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                            {loaiChungTu.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                        checked={values.chungTuApDung.includes(
                                                            name
                                                        )}
                                                    />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Loại chiết khấu
                                        </Typography>
                                        <RadioGroup
                                            name="loaiChietKhau"
                                            value={values.loaiChietKhau}
                                            onChange={handleChange}
                                            sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                value={1}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                    />
                                                }
                                                label="Theo % thực thu"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                    />
                                                }
                                                label=" Theo % doanh thu"
                                            />
                                            <FormControlLabel
                                                value={3}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                    />
                                                }
                                                label="Theo VNĐ"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giá trị
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="giaTriChietKhau"
                                            value={values.giaTriChietKhau}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ paddingRight: '0' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            className="btn-container-hover"
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',

                                                border: 'none'
                                            }}
                                            type="submit">
                                            Lưu
                                        </Button>
                                        <Button
                                            className="btn-outline-hover"
                                            variant="outlined"
                                            onClick={onClose}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: 'var(--color-main)',
                                                borderColor: '#965C85'
                                            }}>
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
export default CreateOrEditChietKhauHoaDonModal;
