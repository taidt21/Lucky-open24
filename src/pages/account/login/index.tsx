import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton
} from '@mui/material';
import './login.css';
import LoginModel from '../../../models/Login/loginModel';
import LoginService from '../../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../../images/logoNew.svg';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const loginModel = new LoginModel();
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            tenant: Cookies.get('TenantName') ?? '',
            userNameOrEmail: '',
            password: '',
            remember: true
        },
        validationSchema: Yup.object({
            tenant: Yup.string(),
            userNameOrEmail: Yup.string().required('Tài khoản không được để trống.'),
            password: Yup.string().required('Mật khẩu không được để trống.')
        }),
        onSubmit: async (values) => {
            loginModel.tenancyName = values.tenant;
            loginModel.userNameOrEmailAddress = values.userNameOrEmail;
            loginModel.password = values.password;
            loginModel.rememberMe = values.remember;

            const checkTenant = await LoginService.CheckTenant(loginModel.tenancyName);
            if (checkTenant.state !== 1) {
                formik.setFieldError('tenant', 'Id cửa hàng không tồn tại hoặc hết hạn.');
            } else {
                const login = await LoginService.Login(loginModel);
                if (login === true) {
                    const userId = Cookies.get('userId') ?? '0';
                    const remember = Cookies.get('isRememberMe') === 'true' ? true : false;
                    await LoginService.GetPermissionByUserId(parseInt(userId, 0), remember);
                    navigate('/home');
                    window.location.reload();
                } else {
                    formik.setFieldError('userNameOrEmail', 'Tài khoản hoặc mật khẩu không đúng');
                    formik.setFieldError('password', 'Tài khoản hoặc mật khẩu không đúng');
                }
            }
        }
    });

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            formik.handleSubmit();
        }
    };

    return (
        <div className="login-page">
            <Grid container className="align-items-center justify-content-center mt-2 h-100">
                <Grid xs={12}>
                    <div className="login-page-inner">
                        <div className="logo-login">
                            <div className="logo-image">
                                <img src={logo} alt="Lucky Beauty" />
                            </div>
                            <div className="logo-text">Lucky Beauty</div>
                        </div>
                        <h1 className="login-label">Đăng nhập</h1>
                        <form className="login-form" onSubmit={formik.handleSubmit}>
                            <Grid container>
                                <span className="login-label">ID đăng nhập</span>
                                <Grid xs={12} item className="form-item">
                                    <TextField
                                        {...formik.getFieldProps('tenant')}
                                        error={
                                            formik.touched.tenant && formik.errors.tenant
                                                ? true
                                                : false
                                        }
                                        helperText={formik.touched.tenant && formik.errors.tenant}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="tenant"
                                        value={formik.values.tenant}
                                        placeholder="ID đăng nhập"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none!important'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <span className="login-label">Tên đăng nhập</span>
                                <Grid xs={12} item className="form-item">
                                    <TextField
                                        {...formik.getFieldProps('userNameOrEmail')}
                                        error={
                                            formik.touched.userNameOrEmail &&
                                            formik.errors.userNameOrEmail
                                                ? true
                                                : false
                                        }
                                        helperText={
                                            formik.touched.userNameOrEmail &&
                                            formik.errors.userNameOrEmail
                                        }
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="userNameOrEmail"
                                        placeholder="Nhập email hoặc tên tài khoản"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: formik.errors.userNameOrEmail
                                                        ? '1px solid red!important'
                                                        : 'none!important'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <span className="login-label">Mật khẩu</span>
                                <Grid xs={12} item className="form-item">
                                    <TextField
                                        {...formik.getFieldProps('password')}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        error={
                                            formik.touched.password && formik.errors.password
                                                ? true
                                                : false
                                        }
                                        helperText={
                                            formik.touched.password && formik.errors.password
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                display: 'block',
                                                paddingRight: '0',
                                                '& fieldset': {
                                                    border: formik.errors.password
                                                        ? '1px solid red!important'
                                                        : 'none!important'
                                                }
                                            },
                                            '& .MuiInputBase-root ': {
                                                background: '#f2f6fa'
                                            },
                                            '& button': {
                                                position: 'absolute',
                                                right: '0',
                                                top: '0'
                                            }
                                        }}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword}>
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} item className="form-item_checkBox">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...formik.getFieldProps('remember')}
                                                checked={formik.values.remember}
                                                sx={{
                                                    color: 'var(--color-main)',
                                                    '&.Mui-checked': {
                                                        color: 'var(--color-main)'
                                                    }
                                                }}
                                            />
                                        }
                                        label="Ghi nhớ"
                                    />
                                    <Link className="login-form-forgot" to="/forgot-password">
                                        Quên mật khẩu ?
                                    </Link>
                                </Grid>

                                <Grid xs={12} item>
                                    <button type="submit" className="btn-login">
                                        <span className="text-login">Đăng nhập</span>
                                    </button>
                                </Grid>
                                <Grid xs={12} item>
                                    <p className="text-support">
                                        Tổng đài hỗ trợ : <span>0247 303 9333 - 0936 363 069</span>
                                    </p>
                                </Grid>
                                <Grid xs={12} item>
                                    <p className="text-register">
                                        Bạn chưa có tài khoản?{' '}
                                        <Link className="a quenMk" to="/register">
                                            Đăng ký
                                        </Link>
                                    </p>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginScreen;
