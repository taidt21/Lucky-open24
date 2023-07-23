import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';

export default function AutocompleteCustomer({
    idChosed,
    handleChoseItem,
    helperText = '',
    err = false
}: any) {
    const [listCustomer, setListCustomer] = useState([]);
    const [cusChosed, setCusChosed] = useState<CreateOrEditKhachHangDto | null>(null);
    const [paramSearch, setParamSearch] = useState<PagedKhachHangResultRequestDto>({
        keyword: '',
        loaiDoiTuong: 1,
        maxResultCount: 50,
        skipCount: 0,
        sortBy: '',
        sortType: ''
    });

    const getInforCustomerbyID = async () => {
        if (!utils.checkNull(idChosed) && idChosed !== Guid.EMPTY) {
            const data = await khachHangService.getKhachHang(idChosed);
            setCusChosed(data);
        } else {
            setCusChosed(() => null);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramSearch: any) => {
            const data = await khachHangService.jqAutoCustomer(paramSearch);
            setListCustomer(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    React.useEffect(() => {
        getInforCustomerbyID();
    }, [idChosed]);

    const choseItem = (item: any) => {
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setParamSearch({ ...paramSearch, keyword: newInputValue });
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                value={cusChosed}
                onChange={(event: any, newValue: CreateOrEditKhachHangDto | null) =>
                    choseItem(newValue)
                }
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={listCustomer}
                getOptionLabel={(option: any) => (option.tenKhachHang ? option.tenKhachHang : '')}
                renderInput={(params) => (
                    <TextField {...params} label="Tìm kiếm" helperText={helperText} error={err} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid
                                    item
                                    sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>
                                        {option.tenKhachHang}
                                    </Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option.soDienThoai}
                                    </Box>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
