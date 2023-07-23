import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import AutocompleteCustomer from '../../components/Autocomplete/Customer';

import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import KhachHangService from '../../services/khach-hang/khachHangService';
import CheckinService from '../../services/check_in/CheckinService';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { ChiNhanhContext } from '../../services/chi_nhanh/ChiNhanhContext';

import Utils from '../../utils/utils'; // func common
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Guid } from 'guid-typescript';
import TabKhachHang from './TabModalKhachHang';
import TabCuocHen from './TabModalCuocHen';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PropConfirmOKCancel, PropModal } from '../../utils/PropParentToChild';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import utils from '../../utils/utils';
export default function ModalAddCustomerCheckIn({ trigger, handleSave }: any) {
    const chiNhanhCurrent = useContext(ChiNhanhContext);
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);
    const [objAlert, setObjAlert] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({
        id: Guid.EMPTY,
        maKhachHang: '',
        tenKhachHang: '',
        idLoaiKhach: 1,
        soDienThoai: '',
        diaChi: '',
        gioiTinh: false,
        idNguonKhach: '',
        idNhomKhach: ''
    });

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            setNewCus({
                id: Guid.EMPTY,
                maKhachHang: '',
                tenKhachHang: '',
                idLoaiKhach: 1,
                soDienThoai: '',
                diaChi: '',
                gioiTinh: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });
        }
        setIsSave(false);
    }, [trigger]);

    const checkSaveCheckin = async (idCus: string) => {
        const exists = await CheckinService.CheckExistCusCheckin(idCus);
        if (exists) {
            setErrCheckIn(true);
            setObjAlert({ ...objAlert, show: true, mes: 'Khách hàng đã check in' });
            return false;
        }
        return true;
    };
    const saveCheckIn = async (cusChosed: any) => {
        const check = await checkSaveCheckin(cusChosed.id);
        if (!check) {
            return;
        }
        setIsShow(false);

        setNewCus((itemOlds: any) => {
            return {
                ...itemOlds,
                id: cusChosed.id,
                maKhachHang: cusChosed.maKhachHang,
                tenKhachHang: cusChosed.tenKhachHang,
                soDienThoai: cusChosed.soDienThoai
            };
        });
        const objCheckIn: KHCheckInDto = new KHCheckInDto({
            idKhachHang: cusChosed.id,
            idChiNhanh: chiNhanhCurrent.id
        });
        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
        const objCheckInNew: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idCheckIn: dataCheckIn.id,
            idKhachHang: objCheckIn.idKhachHang,
            maKhachHang: cusChosed.maKhachHang,
            tenKhachHang: cusChosed.tenKhachHang,
            soDienThoai: cusChosed.soDienThoai,
            tongTichDiem: cusChosed.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn,
            txtTrangThaiCheckIn: dataCheckIn.txtTrangThaiCheckIn
        });

        // save to Booking_Checkin_HD
        await CheckinService.InsertCheckInHoaDon({
            idCheckIn: dataCheckIn.id,
            idBooking: cusChosed?.idBooking
        });
        handleSave(objCheckInNew);
    };

    const [currentTab, setCurrentTab] = useState(1);
    const handleChangeTab = (value: number) => {
        setCurrentTab(value);
    };
    return (
        <>
            <Dialog
                open={isShow}
                onClose={() => setIsShow(false)}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paperScrollPaper': {
                        overflowX: 'hidden'
                    }
                }}>
                <SnackbarAlert
                    showAlert={objAlert.show}
                    type={objAlert.type}
                    title={objAlert.mes}
                    handleClose={() =>
                        setObjAlert({ show: false, mes: '', type: 1 } as PropConfirmOKCancel)
                    }></SnackbarAlert>
                <DialogTitle
                    sx={{
                        display: 'flex',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        bgcolor: '#fff',
                        zIndex: '5',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                    <Box fontWeight="700!important" fontSize="24px">
                        Thêm checkin
                    </Box>
                    <IconButton
                        onClick={() => setIsShow(false)}
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ overflow: 'visible' }}>
                    <Stack
                        direction="row"
                        gap="32px"
                        sx={{
                            '& button': {
                                minWidth: 'unset',
                                padding: '0',
                                transition: '.4s'
                            }
                        }}>
                        <Button
                            sx={{
                                color: currentTab === 1 ? 'var(--color-main)' : '#999699',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-5px',
                                    transition: '.4s',
                                    left: currentTab === 1 ? '0' : 'calc(100% + 32px)',
                                    width: currentTab === 1 ? '100%' : '77.2px',
                                    borderTop: '2px solid var(--color-main)'
                                }
                            }}
                            variant="text"
                            onClick={() => handleChangeTab(1)}>
                            Cuộc hẹn
                        </Button>
                        <Button
                            sx={{ color: currentTab === 2 ? 'var(--color-main)' : '#999699' }}
                            variant="text"
                            onClick={() => handleChangeTab(2)}>
                            Khách hàng
                        </Button>
                    </Stack>
                    <Box sx={{ marginTop: '20px' }}>
                        {currentTab === 1 ? (
                            <TabCuocHen handleChoseCusBooking={saveCheckIn} />
                        ) : (
                            <TabKhachHang handleChoseCus={saveCheckIn} />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'none',
                        position: 'sticky',
                        left: '0',
                        bottom: '0',
                        zIndex: '5',
                        bgcolor: '#fff'
                    }}>
                    <Stack direction="row" spacing={1} paddingTop={2} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            className=" btn-container-hover"
                            sx={{ width: '70px' }}
                            onClick={saveCheckIn}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            className=" btn-outline-hover"
                            sx={{
                                width: '70px',
                                bgcolor: '#fff',
                                borderColor: '#E6E1E6',
                                color: '#666466'
                            }}
                            onClick={() => setIsShow(false)}>
                            Hủy
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
