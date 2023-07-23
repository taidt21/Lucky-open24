import {
    Box,
    Grid,
    Typography,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';

import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import SearchIcon from '../../../images/search-normal.svg';

import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import CreateOrEditSoQuyDialog from './components/CreateOrEditSoQuyDialog';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { format, lastDayOfMonth } from 'date-fns';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { GetAllQuyHoaDonItemDto } from '../../../services/so_quy/Dto/QuyHoaDonViewItemDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import utils from '../../../utils/utils';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { Add } from '@mui/icons-material';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../../services/file-dowload.service';
import abpCustom from '../../../components/abp-custom';

const PageSoQuy = ({ xx }: any) => {
    const today = new Date();
    const firstLoad = useRef(true);
    const chinhanh = useContext(ChiNhanhContext);
    const [isShowModal, setisShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        textSearch: '',
        currentPage: 1,
        columnSort: 'ngayLapHoaDon',
        typeSort: 'desc',
        idChiNhanhs: chinhanh.id === '' ? [] : [chinhanh.id],
        fromDate: format(today, 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd')
    });
    const [pageDataSoQuy, setPageDataSoQuy] = useState<PagedResultDto<GetAllQuyHoaDonItemDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const GetListSoQuy = async () => {
        const data = await SoQuyServices.getAll(paramSearch);
        setPageDataSoQuy({
            totalCount: data.totalCount,
            totalPage: utils.getTotalPage(data.totalCount, paramSearch.pageSize),
            items: data.items
        });
    };
    const PageLoad = () => {
        GetListSoQuy();
    };
    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        setParamSearch({ ...paramSearch, idChiNhanhs: chinhanh.id === '' ? [] : [chinhanh.id] });
    }, [chinhanh.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListSoQuy();
    }, [
        paramSearch.currentPage,
        paramSearch.pageSize,
        paramSearch.fromDate,
        paramSearch.toDate,
        paramSearch.idChiNhanhs,
        paramSearch.columnSort,
        paramSearch.typeSort
    ]);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.currentPage !== 1) {
            setParamSearch({
                ...paramSearch,
                currentPage: 1
            });
        } else {
            GetListSoQuy();
        }
    };
    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.pageSize = pageDataSoQuy.totalCount;
        param.currentPage = 1;
        const data = await SoQuyServices.ExportToExcel(param);
        fileDowloadService.downloadExportFile(data);
    };
    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const doActionRow = (action: number, itemSQ: GetAllQuyHoaDonItemDto) => {
        setSelectedRowId(itemSQ?.id);
        if (action < 2) {
            if (utils.checkNull(itemSQ?.idHoaDonLienQuan)) {
                setisShowModal(true);
            }
        } else {
            setinforDelete(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${itemSQ?.loaiPhieu ?? ' '}  ${
                        itemSQ?.maHoaDon ?? ' '
                    } không?`
                })
            );
        }
    };

    const deleteProduct = async (dataSave: any) => {
        await SoQuyServices.DeleteSoQuy(selectedRowId);
        setPageDataSoQuy({
            ...pageDataSoQuy,
            items: pageDataSoQuy.items.filter((x: any) => x.id !== selectedRowId),
            totalCount: pageDataSoQuy.totalCount - 1,
            totalPage: utils.getTotalPage(pageDataSoQuy.totalCount - 1, paramSearch.pageSize)
        });
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Hủy thành công'
        });
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
    };

    const saveSoQuy = async (dataSave: any, type: number) => {
        setisShowModal(false);
        switch (type) {
            case 1: // insert
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    items: [dataSave, ...pageDataSoQuy.items],
                    totalCount: pageDataSoQuy.totalCount + 1,
                    totalPage: utils.getTotalPage(
                        pageDataSoQuy.totalCount + 1,
                        paramSearch.pageSize
                    )
                });
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Thêm ' + dataSave.loaiPhieu + ' thành công'
                });
                break;
            case 2:
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    items: pageDataSoQuy.items.map((item: any) => {
                        if (item.id === selectedRowId) {
                            return {
                                ...item,
                                maHoaDon: dataSave.maHoaDon,
                                ngayLapHoaDon: dataSave.ngayLapHoaDon,
                                idLoaiChungTu: dataSave.idLoaiChungTu,
                                loaiPhieu: dataSave.loaiPhieu,
                                hinhThucThanhToan: dataSave.hinhThucThanhToan,
                                sHinhThucThanhToan: dataSave.sHinhThucThanhToan,
                                tongTienThu: dataSave.tongTienThu,
                                maNguoiNop: dataSave.maNguoiNop,
                                tenNguoiNop: dataSave.tenNguoiNop,
                                idKhoanThuChi: dataSave.idKhoanThuChi,
                                tenKhoanThuChi: dataSave.tenKhoanThuChi,
                                txtTrangThai: dataSave.txtTrangThai,
                                trangThai: dataSave.trangThai
                            };
                        } else {
                            return item;
                        }
                    })
                });
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + dataSave.loaiPhieu + ' thành công'
                });
                break;
            case 3:
                await deleteProduct(dataSave);
                break;
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'loaiPhieu',
            sortable: false,
            headerName: 'Loại phiếu',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'loaiPhieu' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'maHoaDon',
            sortable: false,
            headerName: 'Mã phiếu',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'maHoaDon' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            sortable: false,
            headerName: 'Ngày lập',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'ngayLapHoaDon' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        // {
        //     field: 'tenKhoanThuChi',
        //     sortable: false,
        //     headerName: 'Loại thu chi',
        //     minWidth: 118,
        //     flex: 1,
        //     renderHeader: (params: any) => (
        //         <Box title={params.value}>
        //             {params.colDef.headerName}
        //             <IconSorting
        //                 onClick={() => {
        //                     setParamSearch({ ...paramSearch, columnSort: 'tenKhoanThuChi' });
        //                 }}
        //             />
        //         </Box>
        //     ),
        //     renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        // },
        {
            field: 'tenNguoiNop',
            sortable: false,
            headerName: 'Người nộp',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'tenNguoiNop' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'tongTienThu',
            sortable: false,
            headerName: 'Tổng tiền',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'tongTienThu' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="end">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'sHinhThucThanhToan',
            sortable: false,
            headerName: 'Hình thức',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'sHinhThucThanhToan' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'txtTrangThai',
            sortable: false,
            headerName: 'Trạng thái',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting
                        onClick={() => {
                            setParamSearch({ ...paramSearch, columnSort: 'trangThai' });
                        }}
                    />
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        padding: '4px 8px',
                        borderRadius: '100px',
                        backgroundColor:
                            params.value === 'Đã thanh toán'
                                ? '#E8FFF3'
                                : params.value === 'Chưa thanh toán'
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.value === 'Đã thanh toán'
                                ? '#50CD89'
                                : params.value === 'Chưa thanh toán'
                                ? '#FF9900'
                                : '#F1416C',
                        margin: 'auto'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
                <ActionViewEditDelete
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => (
                <Box sx={{ display: 'none' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        }
    ];

    return (
        <>
            <CreateOrEditSoQuyDialog
                onClose={() => {
                    setisShowModal(false);
                }}
                onOk={saveSoQuy}
                visiable={isShowModal}
                idQuyHD={selectedRowId}
            />
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteProduct}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Box padding="16px 2.2222222222222223vw 16px 2.2222222222222223vw">
                <Grid container justifyContent="space-between">
                    <Grid item md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Sổ quỹ
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important',
                                    '& .MuiInputBase-root': {
                                        pl: '0'
                                    }
                                }}
                                onChange={(e: any) => {
                                    setParamSearch({ ...paramSearch, textSearch: e.target.value });
                                }}
                                onKeyDown={handleKeyDownTextSearch}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button">
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item md="auto">
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                '& button': {
                                    height: '40px'
                                }
                            }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    bgcolor: '#fff',
                                    alignItems: 'center',
                                    border: '1px solid #E6E1E6',
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '0',
                                        flexDirection: 'row-reverse'
                                    }
                                }}>
                                <DatePickerCustom
                                    defaultVal={paramSearch.fromDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, fromDate: newVal })
                                    }
                                />
                                <Box>-</Box>
                                <DatePickerCustom
                                    defaultVal={paramSearch.toDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, toDate: newVal })
                                    }
                                />
                            </Box>
                            <Button
                                hidden={!abpCustom.isGrandPermission('Pages.QuyHoaDon.Export')}
                                variant="outlined"
                                onClick={exportToExcel}
                                startIcon={<UploadIcon />}
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px'
                                }}
                                className="btn-outline-hover">
                                Xuất{' '}
                            </Button>
                            <Button
                                hidden={!abpCustom.isGrandPermission('Pages.QuyHoaDon.Create')}
                                variant="contained"
                                startIcon={<Add />}
                                sx={{
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                                className="btn-container-hover"
                                onClick={() => {
                                    setisShowModal(true);
                                    setSelectedRowId('');
                                }}>
                                Lập phiếu
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="16px">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rows={pageDataSoQuy.items}
                        columns={columns}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-columnHeaders': { bgcolor: 'var(--color-bg)' },
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaders .MuiBox-root ': {
                                fontWeight: '700'
                            },
                            '& .MuiDataGrid-virtualScroller  .MuiBox-root ': {
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                outline: 'none!important'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none '
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                color: 'var(--color-main)'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                fill: 'var(--color-main)'
                            },
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(2)':
                                {
                                    fill: '#000'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(1)':
                                {
                                    fill: '#000'
                                },
                            '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                color: 'var(--color-main)!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: 'var(--color-bg)'
                                }
                        }}
                        hideFooter
                        localeText={TextTranslate}
                    />

                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 0}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataSoQuy.totalCount ?? 0}
                        totalPage={pageDataSoQuy.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Box>
            </Box>
        </>
    );
};

export default PageSoQuy;
