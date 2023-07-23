import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    TextField,
    Select,
    MenuItem,
    Dialog
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as InIcon } from '../../../images/printer.svg';
import Avatar from '../../../images/xinh.png';
import TabInfo from './Tab_info';
import TabDiary from './Tab_diary';
import { ReactComponent as ArrowIcon } from '../../../images/arrow_back.svg';
import ModalWarning from './Modal_warning';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import DateTimePickerCustom from '../../../components/DatetimePicker/DateTimePickerCustom';

import { ReactComponent as ArrowDown } from '../.././../images/arow-down.svg';

import {
    ChiNhanhContext,
    ChiNhanhContextbyUser
} from '../../../services/chi_nhanh/ChiNhanhContext';
import AutocompleteChiNhanh from '../../../components/Autocomplete/ChiNhanh';
import ModalEditChiTietGioHang from '../thu_ngan/modal_edit_chitiet';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';

import { format } from 'date-fns';
import { Stack } from '@mui/system';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import AutocompleteCustomer from '../../../components/Autocomplete/Customer';

const themOutlineInput = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px'
                }
            }
        }
    }
});

const ThongTinHoaDonn = ({ idHoaDon, hoadon, handleGotoBack, open, onClose }: any) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [hoadonChosed, setHoaDonChosed] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));
    const [chitietHoaDon, setChiTietHoaDon] = useState<PageHoaDonChiTietDto[]>([]);

    const current = useContext(ChiNhanhContext);
    const allChiNhanh = useContext(ChiNhanhContextbyUser);

    // todo change chinhanh --> back to list
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const GetChiTietHoaDon_byIdHoaDon = async () => {
        const data = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);
        setChiTietHoaDon(data);
    };

    useEffect(() => {
        GetChiTietHoaDon_byIdHoaDon();
        setHoaDonChosed(hoadon);
    }, [idHoaDon]);

    const changeNgayLapHoaDon = (value: any) => {
        setHoaDonChosed({ ...hoadonChosed, ngayLapHoaDon: value });
    };

    const changeChiNhanh = (item: ChiNhanhDto) => {
        setHoaDonChosed({ ...hoadonChosed, idChiNhanh: item?.id });
    };
    const changeCustomer = (item: any) => {
        setHoaDonChosed({ ...hoadonChosed, idKhachHang: item?.id });
    };

    const gotoBack = () => {
        // nếu cập nhật hóa đơn --> pass thông tin hóa đơn đã cập nhật
        handleGotoBack(hoadonChosed);
    };

    const checkSave = async () => {
        // if tongtien > tongtienold
        if (hoadon?.tongThanhToan > hoadonChosed?.tongThanhToan) {
            setObjAlert({ ...objAlert, show: true, mes: 'Tổng tiền hàng > Tổng cũ' });
        }
    };

    const huyHoaDon = () => {
        setOpenDialog(true);
    };

    // const showModalEditGioHang = () => {

    // };
    const updateHoaDon = async () => {
        const data = await HoaDonService.Update_InforHoaDon(hoadonChosed);
        setHoaDonChosed({ ...hoadonChosed, maHoaDon: data?.maHoaDon });
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật thông tin hóa đơn thành công' });
    };

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: any, newValue: number) => {
        setActiveTab(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <Box role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </Box>
        );
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'calc(100vh - 70px)'
            }}>
            <ModalWarning open={openDialog} onClose={handleCloseDialog} onOK={handleCloseDialog} />
            <Box>
                <Grid
                    container
                    sx={{
                        boxShadow: '0px 4px 20px 0px #AAA9B81A',
                        borderRadius: '12px',
                        padding: '24px 24px 0px 24px',
                        bgcolor: '#fff',
                        alignItems: 'center'
                    }}>
                    <Grid item xs={1.5}>
                        <Box
                            sx={{
                                borderRadius: '6px',
                                '& img': {
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'cover'
                                }
                            }}>
                            <img width={100} src={Avatar} alt="avatar" />
                        </Box>
                    </Grid>
                    <Grid item xs={10.5}>
                        <Box display="flex" justifyContent="space-between" mb="12px">
                            <Box display="flex" gap="23px">
                                <Typography
                                    variant="h4"
                                    color="#3B4758"
                                    fontWeight="700"
                                    fontSize="24px">
                                    {hoadonChosed?.tenKhachHang}
                                </Typography>
                                <Box
                                    sx={{
                                        padding: '2px 3px',
                                        borderRadius: '100px',
                                        color:
                                            hoadonChosed?.trangThai === 3
                                                ? '#50CD89'
                                                : hoadonChosed?.trangThai === 1
                                                ? '#FF9900'
                                                : '#F1416C',
                                        bgcolor:
                                            hoadonChosed?.trangThai === 3
                                                ? '#E8FFF3'
                                                : hoadonChosed?.trangThai === 1
                                                ? '#FFF8DD'
                                                : '#FFF5F8',
                                        width: 'fit-content',
                                        fontSize: '12px',
                                        height: 'fit-content'
                                    }}>
                                    {hoadonChosed?.txtTrangThaiHD}
                                </Box>
                            </Box>
                            <Box display="flex" gap="8px">
                                <Button
                                    startIcon={<InIcon />}
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#fff!important',
                                        color: '#666466',
                                        borderColor: '#E6E1E6!important'
                                    }}>
                                    In
                                </Button>
                                <Button
                                    startIcon={<UploadIcon />}
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#fff!important',
                                        color: '#666466',
                                        borderColor: '#E6E1E6!important'
                                    }}>
                                    Xuất
                                </Button>
                                <Button
                                    variant="contained"
                                    className="btn-container-hover"
                                    sx={{
                                        color: '#fff'
                                    }}>
                                    Sao chép
                                </Button>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Mã hóa đơn
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        className="inputEdit"
                                        onChange={(event: any) =>
                                            setHoaDonChosed({
                                                ...hoadonChosed,
                                                maHoaDon: event.target.value
                                            })
                                        }
                                        value={hoadonChosed?.maHoaDon || '0911290476'}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Ngày lập
                                    </Typography>
                                    <ThemeProvider theme={themOutlineInput}>
                                        <DateTimePickerCustom
                                            fullWidth
                                            className="inputEdit"
                                            defaultVal={hoadonChosed?.ngayLapHoaDon}
                                            handleChangeDate={changeNgayLapHoaDon}
                                        />
                                    </ThemeProvider>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Chi nhánh
                                    </Typography>
                                    <ThemeProvider theme={themOutlineInput}>
                                        <AutocompleteChiNhanh
                                            dataChiNhanh={allChiNhanh}
                                            idChosed={hoadonChosed?.idChiNhanh}
                                            handleChoseItem={changeChiNhanh}
                                        />
                                    </ThemeProvider>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        User lập phiếu
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        className="inputEdit"
                                        value={hoadonChosed?.userName}
                                    />
                                </Box>
                            </Grid>
                            {/* <Grid item xs={3}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Người bán
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        className="inputEdit"
                                        defaultValue="Tài đẹp trai"
                                    />
                                </Box>
                            </Grid> */}
                        </Grid>
                    </Grid>
                    <Grid xs={12} item>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                borderTop: '1px solid #EEF0F4',
                                paddingTop: '16px',
                                marginTop: '20px',
                                '& .MuiTabs-flexContainer': {
                                    gap: '32px'
                                },
                                '& button': {
                                    textTransform: 'unset',
                                    color: '#999699',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    padding: '0',
                                    minWidth: 'unset',
                                    minHeight: 'unset'
                                },
                                '& .Mui-selected': {
                                    color: 'var(--color-main)!important'
                                },
                                '& .MuiTabs-indicator': {
                                    bgcolor: 'var(--color-main)'
                                }
                            }}>
                            <Tab label="Thông tin" />
                            <Tab label="Nhật ký thanh toán" />
                        </Tabs>
                    </Grid>
                </Grid>
                <Box sx={{ mt: '40px' }}>
                    <TabPanel value={activeTab} index={0}>
                        <TabInfo hoadon={hoadon} chitietHoaDon={chitietHoaDon} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <TabDiary idHoaDon={idHoaDon} />
                    </TabPanel>
                </Box>
            </Box>

            <>
                <SnackbarAlert
                    showAlert={objAlert.show}
                    type={objAlert.type}
                    title={objAlert.mes}
                    handleClose={() =>
                        setObjAlert({ show: false, mes: '', type: 1 })
                    }></SnackbarAlert>
                {/* <ModalEditChiTietGioHang   trigger={chitietHoaDon}
                handleSave={AgreeGioHang}/> */}
            </>
        </Dialog>
    );
};
export default ThongTinHoaDonn;
