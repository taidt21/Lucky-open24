import * as Yup from 'yup';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /^\d{10,13}$/;

const rules = Yup.object().shape({
    userId: Yup.number(),
    surname: Yup.string().required('Tên là bắt buộc'),
    name: Yup.string().required('Họ là bắt buộc'),
    emailAddress: Yup.string()
        .matches(emailRegex, 'Email không hợp lệ')
        .required('Email là bắt buộc'),
    userName: Yup.string().required('Tên truy cập là bắt buộc'),
    password: Yup.string().when('userId', (userId: any, schema) => {
        return userId === 0
            ? schema
                  .min(6, 'Mật khẩu phải tối thiểu 6 ký tự')
                  .required('Mật khẩu không được để trống')
            : schema;
    }),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Mật khẩu xác nhận phải trùng khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
    phoneNumber: Yup.string().matches(phoneRegex, 'Số điện thoại không hợp lệ')
});

export default rules;
