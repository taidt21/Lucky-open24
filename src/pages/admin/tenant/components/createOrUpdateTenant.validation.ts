import * as Yup from 'yup';

const rules = Yup.object().shape({
    tenancyName: Yup.string().required('Id cửa hàng không được để trống'),
    name: Yup.string(),
    adminEmailAddress: Yup.string()
        .email('Email không đúng dịnh dạng')
        .required('Email không được để trống')
    // password: Yup.string().required('This Field Is Required'),
    // confirmPassword: Yup.string()
    //     .oneOf([Yup.ref('password'), ''], 'Passwords do not match')
    //     .required('This Field Is Required')
});

export default rules;
