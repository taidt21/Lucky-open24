import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import './forgotPassword.css';
import logo from '../../../images/logoNew.svg';
import { Link } from 'react-router-dom';
interface ForgotPasswordFormData {
    email: string;
}

function ForgotPasswordPage() {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Kiểm tra các trường có được nhập hay không
        if (formData.email.trim() === '') {
            setError('Vui lòng nhập địa chỉ email.');
            return;
        }

        // Xử lý yêu cầu khôi phục mật khẩu
        // ...
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="forgot-password-page">
            <Box sx={{ maxWidth: 400, margin: '0 auto' }} className="forgot-password-page-box">
                <div className="logo-forgot">
                    <div className="logo-image">
                        <img src={logo} alt="Lucky Beauty" />
                    </div>
                    <div className="logo-text">Lucky Beauty</div>
                </div>
                <Typography variant="h1">Quên mật khẩu</Typography>
                <Typography>
                    Nhập địa chỉ email bạn đã sử dụng khi tạo tài khoản và chúng tôi sẽ gửi cho bạn
                    mã để đặt lại mật khẩu
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        name="email"
                        label="Địa chỉ email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none'
                                }
                            }
                        }}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Gửi yêu cầu
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </form>
                <Link to="/login" className="back_login ">
                    Trở lại đăng nhập
                </Link>
            </Box>
        </div>
    );
}

export default ForgotPasswordPage;
