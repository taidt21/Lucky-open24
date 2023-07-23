import {
    Box,
    Button,
    Grid,
    Stack,
    InputAdornment,
    TextField,
    Typography,
    IconButton,
    ButtonGroup,
    Avatar
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import utils from '../../utils/utils';

import { Add, Menu, CalendarMonth, MoreHoriz, QueryBuilder, Search } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import { PropConfirmOKCancel, PropModal } from '../../utils/PropParentToChild';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import CloseIcon from '@mui/icons-material/Close';
import { Guid } from 'guid-typescript';
import Utils from '../../utils/utils';
import CheckinService from '../../services/check_in/CheckinService';
import ModelNhanVienThucHien from '../nhan_vien_thuc_hien/modelNhanVienThucHien';

import { dbDexie } from '../../lib/dexie/dexieDB';
import MauInServices from '../../services/mau_in/MauInServices';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: 'var(--color-main)'
                }
            }
        }
    }
});

export default function CustomersChecking({ hanleChoseCustomer }: any) {
    const MaxPc1490 = useMediaQuery('(max-width: 1490px)');
    const [txtSearch, setTextSeach] = useState('');
    const [allCusChecking, setAllCusChecking] = useState<PageKhachHangCheckInDto[]>([]);
    const [idCheckinDelete, setIdCheckinDelete] = useState('');

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const GetListCustomerChecking = async () => {
        const input = { keyword: '', SkipCount: 0, MaxResultCount: 50 };
        const list = await CheckinService.GetListCustomerChecking(input);
        setAllCusChecking([...list]);
    };

    const PageLoad = () => {
        GetListCustomerChecking();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const SearhCusChecking = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allCusChecking.filter(
                (x) =>
                    (x.maKhachHang !== null &&
                        x.maKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenKhachHang !== null &&
                        x.tenKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null &&
                        x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maKhachHang !== null &&
                        utils.strToEnglish(x.maKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.tenKhachHang !== null &&
                        utils.strToEnglish(x.tenKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null &&
                        utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
            );
            return data;
        } else {
            return allCusChecking;
        }
    };

    const deleteCusChecking = async () => {
        setAllCusChecking(
            allCusChecking.filter((x: PageKhachHangCheckInDto) => x.idCheckIn !== idCheckinDelete)
        );
        await CheckinService.UpdateTrangThaiCheckin(idCheckinDelete, 0);
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );

        const dataCheckIn_Dexie = await dbDexie.khachCheckIn
            .where('idCheckIn')
            .equals(idCheckinDelete)
            .toArray();
        console.log('dataCheckIn_Dexie ', dataCheckIn_Dexie);
        if (dataCheckIn_Dexie.length > 0) {
            await dbDexie.khachCheckIn
                .where('idCheckIn')
                .equals(idCheckinDelete)
                .delete()
                .then((deleteCount: any) =>
                    console.log('idcheckindelete ', idCheckinDelete, 'deletecount', deleteCount)
                );

            await dbDexie.hoaDon
                .where('idKhachHang')
                .equals(dataCheckIn_Dexie[0].idKhachHang as string)
                .delete()
                .then((deleteCount: any) => console.log('deleteHoadon', deleteCount));
        }
    };

    const listCusChecking = SearhCusChecking();

    const saveCheckInOK = async (dataCheckIn: any) => {
        console.log('saveCheckInOK ', dataCheckIn);

        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn.idKhachHang,
            idCheckIn: dataCheckIn.idCheckIn,
            maKhachHang: dataCheckIn.maKhachHang,
            tenKhachHang: dataCheckIn.tenKhachHang,
            soDienThoai: dataCheckIn.soDienThoai,
            tongTichDiem: dataCheckIn.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn
        });
        setAllCusChecking([...allCusChecking, cusChecking]);

        // check exist dexie
        if (dataCheckIn.idKhachHang !== Guid.EMPTY) {
            const cus = await dbDexie.khachCheckIn
                .where('idCheckIn')
                .equals(dataCheckIn.idCheckIn)
                .toArray();
            if (cus.length > 0) {
                // remove & add again
                await dbDexie.khachCheckIn.delete(dataCheckIn.idCheckIn);
                await dbDexie.khachCheckIn.add(cusChecking);
            } else {
                // add to dexie
                await dbDexie.khachCheckIn.add(cusChecking);
            }
        }
    };

    const handleClickCustomer = async (item: any) => {
        console.log('item', item);
        hanleChoseCustomer(item);

        // add to dexie
        const cus = await dbDexie.khachCheckIn.where('idCheckIn').equals(item.idCheckIn).toArray();
        if (cus.length === 0) {
            await dbDexie.khachCheckIn.add(item);
        }
    };

    return (
        <>
            <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteCusChecking}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
                <Box
                    sx={{
                        position: 'absolute',
                        height: '100vh',
                        width: '100vw',
                        left: '0',
                        top: '0',
                        pointerEvents: 'none',
                        bgcolor: '#f8f8f8',
                        zIndex: '-5'
                    }}></Box>
                <Grid container justifyContent="end">
                    <Grid item xs={12}>
                        <Stack
                            spacing={1}
                            direction="row"
                            display="flex"
                            justifyContent="end"
                            alignItems="center">
                            <TextField
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important',
                                    borderWidth: '1px!important',
                                    maxWidth: '300px'
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(event) => {
                                    setTextSeach(event.target.value);
                                }}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 'unset',
                                    '& svg': {
                                        width: '24px',
                                        height: '24px',
                                        bgcolor: '#fff!important'
                                    }
                                }}
                                className="btn-outline-hover">
                                <DateIcon />
                            </Button>

                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: 'var(--color-main)!important',

                                    fontSize: '14px'
                                }}
                                startIcon={<Add />}
                                onClick={() =>
                                    setTriggerAddCheckIn({
                                        ...triggerAddCheckIn,
                                        isShow: true
                                    })
                                }
                                className="btn-container-hover">
                                Thêm khách
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container paddingLeft={2} paddingTop={2} columnSpacing={2} rowSpacing={2}>
                {listCusChecking.map((item: any, index: any) => (
                    <Grid item lg={3} sm={4} xs={6} key={index} sx={{ position: 'relative' }}>
                        <Button
                            sx={{
                                position: 'absolute',
                                top: '16px',
                                right: '8px',
                                minWidth: 'unset',
                                borderRadius: '50%!important'
                            }}>
                            <CloseIcon
                                sx={{ color: '#333233' }}
                                onClick={() => {
                                    setIdCheckinDelete(item.idCheckIn);
                                    setinforDelete(
                                        new PropConfirmOKCancel({
                                            show: true,
                                            title: 'Xác nhận xóa',
                                            mes: `Bạn có chắc chắn muốn hủy bỏ khách  ${item?.tenKhachHang}  đang check in không?`
                                        })
                                    );
                                }}
                            />
                        </Button>
                        <Box
                            sx={{
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '24px',
                                height: '100%',
                                border: '1px solid transparent',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}
                            onClick={() => {
                                handleClickCustomer(item);
                            }}>
                            <Box display="flex" gap="8px">
                                <Avatar
                                    // src={Client.avatar}
                                    // alt={item.tenKhachHang}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <div>
                                    <Typography
                                        color="#333233"
                                        variant="subtitle1"
                                        fontSize="14px"
                                        title={item.tenKhachHang}>
                                        {item.tenKhachHang}
                                    </Typography>
                                    <Typography color="#999699" fontSize="12px">
                                        {item.soDienThoai}
                                    </Typography>
                                </div>
                            </Box>
                            <Box display="flex" gap="8px" marginTop="16px">
                                <Typography fontSize="14px" color="#4C4B4C">
                                    Điểm tích lũy:
                                </Typography>
                                <Typography fontSize="14px" color="#4C4B4C" fontWeight="700">
                                    {item.tongTichDiem}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                marginTop="16px"
                                flexDirection={MaxPc1490 ? 'column' : 'row'}>
                                <Typography variant="subtitle1" color="#666466" fontSize="14px">
                                    {item.dateCheckIn}
                                </Typography>
                                <Box
                                    display="flex"
                                    marginTop={MaxPc1490 ? '16px' : '0'}
                                    marginLeft={MaxPc1490 ? '0' : '13px'}
                                    flexGrow="1">
                                    <Typography
                                        color="#666466"
                                        fontSize="14px"
                                        display="flex"
                                        alignItems="center">
                                        <QueryBuilder
                                            style={{
                                                fontSize: '12px',

                                                marginRight: '5px'
                                            }}
                                        />
                                        {item.timeCheckIn}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        lineHeight="16px"
                                        className="state"
                                        sx={{
                                            padding: '4px 12px ',
                                            borderRadius: '8px',
                                            backgroundColor: '#FFF8DD',
                                            color: '#FFC700',
                                            marginLeft: 'auto'
                                        }}>
                                        {item.txtTrangThaiCheckIn}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
