import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    Avatar,
    IconButton,
    debounce
} from '@mui/material';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import avatar from '../../images/avatar.png';
import '../../pages/customer/customerPage.css';

import useWindowWidth from '../../components/StateWidth';
import CreateOrEditCustomerDialog from '../customer/components/create-or-edit-customer-modal';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { DataCustomerContext } from '../../services/khach-hang/dto/DataContext';
import { Guid } from 'guid-typescript';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { format } from 'date-fns';
const TabKhachHang = ({ handleChoseCus }: any) => {
    const firsLoad = useRef(true);
    const windowWidth = useWindowWidth();
    const dataContext_ofCustomer = useContext(DataCustomerContext);
    const listNguonKhach = dataContext_ofCustomer.listNguonKhach;
    const listNhomKhach = dataContext_ofCustomer.listNhomkhach;

    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    const [pageDataCustomer, setPageDataCustomer] = useState<KhachHangItemDto[]>([]);

    const [paramSearch, setParamSearch] = useState<PagedKhachHangResultRequestDto>({
        keyword: '',
        maxResultCount: 10,
        skipCount: 0
    } as PagedKhachHangResultRequestDto);

    const GetKhachHang_noBooking = async (paramSearch: PagedKhachHangResultRequestDto) => {
        console.log('param ', paramSearch);
        const data = await khachHangService.GetKhachHang_noBooking(paramSearch);
        setPageDataCustomer(data);
    };

    const debounceDropDown = useRef(
        debounce(async (paramSearch) => {
            await GetKhachHang_noBooking(paramSearch);
        }, 500)
    ).current;

    useEffect(() => {
        if (firsLoad.current) {
            firsLoad.current = false;
            return;
        }
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    useEffect(() => {
        if (firsLoad.current) {
            firsLoad.current = false;
            return;
        }
        GetKhachHang_noBooking(paramSearch);
    }, [paramSearch.skipCount]);

    const saveOKCustomer = (dataSave: any) => {
        setIsShowModalAddCus(false);
        handleChoseCus(dataSave);
    };

    const showModalAddCus = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            id: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            idNhomKhach: '',
            idNguonKhach: '',
            gioiTinh: false,
            moTa: ''
        } as CreateOrEditKhachHangDto);
    };

    const onChangeInforCus = (event: any) => {
        const { name, value } = event.target;
        setNewCus({
            ...newCus,
            [name]: value
        });
    };

    return (
        <Box>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={saveOKCustomer}
                handleChange={onChangeInforCus}
                title="Thêm mới khách hàng"
                formRef={newCus}
                suggestNguonKhach={listNguonKhach}
                suggestNhomKhach={listNhomKhach}
            />
            <Grid container rowGap={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ maxWidth: '375px' }}
                        placeholder="Tìm kiếm"
                        value={paramSearch.keyword}
                        onChange={(e) =>
                            setParamSearch({ ...paramSearch, keyword: e.target.value })
                        }
                        InputProps={{
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'var(--color-main)',
                            marginLeft: windowWidth > 600 ? 'auto' : '0',
                            height: 'fit-content'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover"
                        onClick={showModalAddCus}>
                        Thêm khách hàng mới
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt="0">
                {pageDataCustomer?.map((item, index) => (
                    <Grid item key={index} sm={6} md={4} xs={12}>
                        <Box
                            onClick={() => saveOKCustomer(item)}
                            sx={{
                                padding: '18px',
                                border: '1px solid #E6E1E6',
                                borderRadius: '8px',
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        src={item.avatar}
                                        alt={item.tenKhachHang}
                                    />
                                    <Box>
                                        <Typography variant="body1" fontSize="16px" color="#333233">
                                            {item.tenKhachHang}
                                        </Typography>
                                        <Typography fontSize="12px" variant="body1" color="#999699">
                                            {item.soDienThoai}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton sx={{ padding: '0' }}>
                                        <MoreHorizIcon sx={{ color: '#231F20', width: '15px' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '16px',
                                    '& p': {
                                        fontSize: '14px',

                                        color: '#4C4B4C'
                                    }
                                }}>
                                <Box component="p" sx={{ fontWeight: '500' }}>
                                    Checkin:
                                </Box>
                                <Box component="p" sx={{ fontWeight: '700' }}>
                                    {item.soLanCheckIn} lần
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        gap: '12px',
                                        color: '#4C4B4C'
                                    }}>
                                    <Box mr="3px">Gần nhất :</Box>
                                    <Box ml="3px">
                                        {format(new Date(item.cuocHenGanNhat), 'dd/MM/yyyy HH:mm')}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default TabKhachHang;
