const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /(84[1-9]|0[1-9])+([0-9]{8})\b/g;
const yyyyMMddHHmmRegex = /^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/;

export interface ISelect {
    value: number;
    text: string;
}

const AppConsts = {
    userManagement: {
        defaultAdminUserName: 'admin'
    },
    localization: {
        defaultLocalizationSourceName: 'BanHangBeautify'
    },
    authorization: {
        encrptedAuthTokenName: 'enc_auth_token'
    },
    appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
    remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    guidEmpty: '00000000-0000-0000-0000-000000000000',
    pageOption: [
        { value: 10, text: '10/ trang' },
        { value: 20, text: '20/ trang' }
    ],
    trangThaiCheckIn: [
        { value: 1, name: 'Đặt lịch' },
        { value: 2, name: 'Đã gọi (nhắn tin) cho khách' },
        { value: 3, name: 'Check in' },
        { value: 4, name: 'Xóa' }
    ],
    hinhThucThanhToan: [
        { value: 1, text: 'Tiền mặt' },
        { value: 2, text: 'Chuyển khoản' },
        { value: 3, text: 'Quẹt thẻ' }
    ] as ISelect[],
    loaiBooking: {
        online: 0,
        offline: 1,
        cuaHangBook: 2
    },
    listColumnCustomer: {
        actions: true,
        cuocHenGanNhat: true,
        gioiTinh: true,
        nhanVienPhuTrach: true,
        soDienThoai: true,
        tenKhachHang: true,
        tenNguonKhach: true,
        tenNhomKhach: true,
        tongChiTieu: true
    },
    emailRegex: emailRegex,
    phoneRegex: phoneRegex,
    yyyyMMddHHmmRegex: yyyyMMddHHmmRegex,
    dayOfWeek: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    }
};

export default AppConsts;
