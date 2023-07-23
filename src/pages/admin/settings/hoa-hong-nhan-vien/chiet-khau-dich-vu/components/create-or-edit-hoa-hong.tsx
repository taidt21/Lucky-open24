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
    Select,
    Box,
    MenuItem
} from '@mui/material';

import { ReactComponent as CloseIcon } from '../../../../../../images/close-square.svg';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../../services/suggests/dto/SuggestDonViQuiDoi';
import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import chietKhauDichVuService from '../../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import AppConsts from '../../../../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    idNhanVien: string;
    formRef: CreateOrEditChietKhauDichVuDto;
    suggestDonViQuiDoi: SuggestDonViQuiDoiDto[];
}
class CreateOrEditChietKhauDichVuModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited, formRef, suggestDonViQuiDoi, idNhanVien } =
            this.props;
        const initialValues: CreateOrEditChietKhauDichVuDto = formRef;
        const rules = Yup.object().shape({
            idDonViQuiDoi: Yup.string()
                .min(3, 'Dịch vụ là bắt buộc')
                .required('Dịch vụ là bắt buộc')
        });
        return (
            <Dialog open={visited} fullWidth maxWidth="md">
                <DialogTitle
                    sx={{
                        fontSize: '24px',
                        fontWeight: '700'
                    }}>
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
                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            values.id = values.id ?? AppConsts.guidEmpty;
                            values.idNhanVien = idNhanVien;
                            values.idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
                            values.idDonViQuiDoi = values.idDonViQuiDoi ?? suggestDonViQuiDoi[0].id;
                            const createOrEdit = await chietKhauDichVuService.CreateOrEdit(values);
                            enqueueSnackbar(createOrEdit.message, {
                                variant: createOrEdit.status,
                                autoHideDuration: 3000
                            });
                            await onSave();
                        }}>
                        {({ values, handleChange, errors, setFieldValue }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={4} rowSpacing={2}>
                                    <TextField
                                        hidden
                                        name="idNhanVien"
                                        value={idNhanVien}></TextField>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Dịch vụ
                                        </Typography>
                                        <Select
                                            size="small"
                                            name="idDonViQuiDoi"
                                            value={values.idDonViQuiDoi}
                                            defaultValue={suggestDonViQuiDoi[0].id}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                            {suggestDonViQuiDoi.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.tenDonVi}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idDonViQuiDoi && (
                                            <small className="text-danger">
                                                {errors.idDonViQuiDoi}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Loại chiết khấu
                                        </Typography>
                                        <RadioGroup
                                            value={values.loaiChietKhau}
                                            defaultValue={values.loaiChietKhau}
                                            name="loaiChietKhau"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                value={1}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#7C3367',
                                                            '&.Mui-checked': {
                                                                color: '#7C3367'
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="Thực hiện"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#7C3367',
                                                            '&.Mui-checked': {
                                                                color: '#7C3367'
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="Yêu cầu"
                                            />
                                            <FormControlLabel
                                                value={3}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#7C3367',
                                                            '&.Mui-checked': {
                                                                color: '#7C3367'
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="Tư vấn"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giá trị
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="giaTri"
                                            value={values.giaTri}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            label={'Là phần trăm'}
                                            value={values.laPhanTram == true ? true : false}
                                            //checked={values.laPhanTram == true ? true : false}
                                            onChange={(e, checked) => {
                                                setFieldValue('laPhanTram', checked);
                                            }}
                                            name="laPhanTram"
                                            control={
                                                <Checkbox
                                                    // checked={values.laPhanTram ? true : false}
                                                    sx={{
                                                        color: '#7C3367',
                                                        '&.Mui-checked': {
                                                            color: '#7C3367'
                                                        }
                                                    }}
                                                />
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ pr: '0!important' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#7C3367',
                                                border: 'none'
                                            }}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85',
                                                borderColor: '#965C85'
                                            }}
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
export default CreateOrEditChietKhauDichVuModal;
