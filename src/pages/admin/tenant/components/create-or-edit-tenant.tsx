import { Component } from 'react';
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
    IconButton,
    TextField,
    Typography
} from '@mui/material';

import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Form, Formik } from 'formik';
import CreateTenantInput from '../../../../services/tenant/dto/createTenantInput';
import tenantService from '../../../../services/tenant/tenantService';
import rules from './createOrUpdateTenant.validation';
import { enqueueSnackbar } from 'notistack';
export interface ICreateOrEditTenantProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    tenantId: number;
    onOk: () => void;
    formRef: CreateTenantInput;
}
class CreateOrEditTenantModal extends Component<ICreateOrEditTenantProps> {
    state = {
        isHostDatabase: false
    };
    handleSubmit = async (values: CreateTenantInput) => {
        try {
            if (this.props.tenantId === 0) {
                await tenantService.create(values);
                enqueueSnackbar('Thêm mới thành công', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            } else {
                await tenantService.update({
                    id: this.props.tenantId,
                    isActive: values.isActive,
                    name: values.name,
                    tenancyName: values.tenancyName
                });
                enqueueSnackbar('Cập nhật thông tin thành công', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            }
            this.props.onOk();
        } catch (error) {
            enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };
    handleFormKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
        }
    };
    render(): React.ReactNode {
        const { visible, onCancel, modalType, tenantId, formRef } = this.props;
        const { isHostDatabase } = this.state;
        const initialValues = {
            name: formRef.name,
            tenancyName: formRef.tenancyName,
            adminEmailAddress: formRef.adminEmailAddress,
            connectionString: formRef.connectionString,
            isActive: formRef.isActive
        };
        return (
            <>
                <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
                    <DialogTitle>
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            color="rgb(51, 50, 51)"
                            fontWeight="700">
                            {modalType}
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
                        <DialogContent sx={{ padding: '0!important' }}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={rules}
                                onSubmit={(e) => {
                                    console.log(e);
                                }}>
                                {({ handleChange, values, errors, touched }) => (
                                    <Form onKeyPress={this.handleFormKeyPress}>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            gap="16px"
                                            marginTop="16px"
                                            sx={{
                                                '& label': {
                                                    fontSize: '14px'
                                                }
                                            }}>
                                            <FormGroup>
                                                <label>
                                                    Id Tenant
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginLeft: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    disabled={
                                                        this.props.tenantId == 0 ? false : true
                                                    }
                                                    type="text"
                                                    size="small"
                                                    name="tenancyName"
                                                    value={values.tenancyName}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                                {touched.tenancyName && errors.tenancyName && (
                                                    <div>{errors.tenancyName}</div>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label htmlFor="name2">
                                                    Tên cửa hàng
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginLeft: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    type="text"
                                                    size="small"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                                {touched.name && errors.name && (
                                                    <div>{errors.name}</div>
                                                )}
                                            </FormGroup>
                                            {tenantId !== 0 ? null : (
                                                <>
                                                    <FormGroup>
                                                        <label htmlFor="email">
                                                            Email quản trị
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '3px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                        <TextField
                                                            type="email"
                                                            size="small"
                                                            name="adminEmailAddress"
                                                            value={values.adminEmailAddress}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        />
                                                        {touched.adminEmailAddress &&
                                                            errors.adminEmailAddress && (
                                                                <div>
                                                                    {errors.adminEmailAddress}
                                                                </div>
                                                            )}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            sx={{
                                                                '& .MuiTypography-root': {
                                                                    fontSize: '14px'
                                                                }
                                                            }}
                                                            value={isHostDatabase}
                                                            checked={isHostDatabase}
                                                            onChange={async (e) => {
                                                                await this.setState({
                                                                    isHostDatabase:
                                                                        !this.state.isHostDatabase
                                                                });
                                                            }}
                                                            control={
                                                                <Checkbox
                                                                    sx={{
                                                                        color: 'var(--color-main)!important'
                                                                    }}
                                                                />
                                                            }
                                                            label="Dùng chung cơ sở dữ liệu với Host"
                                                        />
                                                    </FormGroup>
                                                </>
                                            )}
                                            {isHostDatabase || tenantId !== 0 ? null : (
                                                <FormGroup>
                                                    <label htmlFor="chuoi-ket-noi">
                                                        Chuỗi kết nối
                                                    </label>
                                                    <TextField
                                                        id="chuoi-ket-noi"
                                                        type="text"
                                                        size="small"
                                                        name="connectionString"
                                                        value={values.connectionString}
                                                        onChange={handleChange}
                                                        fullWidth
                                                    />
                                                    {touched.connectionString &&
                                                        errors.connectionString && (
                                                            <div>{errors.connectionString}</div>
                                                        )}
                                                </FormGroup>
                                            )}
                                            {tenantId !== 0 ? null : (
                                                <Typography
                                                    variant="body1"
                                                    fontSize="14px"
                                                    textAlign="center">
                                                    Mật khẩu mặc định là : 123qwe
                                                </Typography>
                                            )}
                                            <FormGroup>
                                                <FormControlLabel
                                                    sx={{
                                                        '& .MuiTypography-root': {
                                                            fontSize: '14px'
                                                        }
                                                    }}
                                                    name="isActive"
                                                    value={values.isActive}
                                                    onChange={handleChange}
                                                    checked={values.isActive}
                                                    control={
                                                        <Checkbox
                                                            sx={{
                                                                color: 'var(--color-main)!important'
                                                            }}
                                                        />
                                                    }
                                                    label="IsActive"
                                                />
                                            </FormGroup>
                                        </Box>
                                        <DialogActions sx={{ paddingRight: '0!important' }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    color: 'var(--color-main)'
                                                }}
                                                onClick={onCancel}
                                                className="btn-outline-hover">
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    this.handleSubmit(values);
                                                }}
                                                className="btn-container-hover">
                                                Lưu
                                            </Button>
                                        </DialogActions>
                                    </Form>
                                )}
                            </Formik>
                        </DialogContent>
                    </DialogTitle>
                </Dialog>
            </>
        );
    }
}
export default CreateOrEditTenantModal;
