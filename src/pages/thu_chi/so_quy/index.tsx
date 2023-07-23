import {
    Box,
    Button,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Component, ReactNode } from 'react';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import SearchIcon from '../../../images/search-normal.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { observer } from 'mobx-react';
import soQuyStore from '../../../stores/soQuyStore';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import CreateOrEditSoQuyDialog from './components/CreateOrEditSoQuyDialog';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { GetAllQuyHoaDonItemDto } from '../../../services/so_quy/Dto/QuyHoaDonViewItemDto';
class SoQuyScreen extends Component {
    state = {
        keyword: '',
        skipCount: 1,
        maxResultCount: 10,
        data: [] as GetAllQuyHoaDonItemDto[],
        sortBy: '',
        sortType: 'desc',
        totalPage: 0,
        totalCount: 0,
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        isShowModal: false,
        isShowConfirmDelete: false
    };

    componentDidMount() {
        this.getAll();
    }

    getAll = async () => {
        this.setState({ data: [] });
        // await soQuyStore.getAll({
        //     filter: this.state.keyword,
        //     maxResultCount: this.state.maxResultCount,
        //     skipCount: this.state.skipCount,
        //     idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        //     sortBy: this.state.sortBy,
        //     sortType: this.state.sortType
        // });
        // this.setState({
        //     data: soQuyStore.lstSoQuy.items,
        //     totalPage: Math.ceil(soQuyStore.lstSoQuy.totalCount / this.state.maxResultCount),
        //     totalCount: soQuyStore.lstSoQuy.totalCount
        // });
    };

    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        this.getAll();
    };

    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: type
        });
        this.getAll();
    };

    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            skipCount: 1
        });
        this.getAll();
    };

    handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            await this.setState({
                maxResultCount: 10,
                skipCount: 1
            });
            this.getAll();
        }
    };
    doActionRow = (action: any, rowItem: any) => {
        this.setState({ selectedRowId: rowItem.id });
    };
    render(): ReactNode {
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
                                this.onSort(this.state.sortType, 'loaiPhieu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => (
                    <Box title={params.value} width="100%" textAlign="center">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'maPhieu',
                sortable: false,
                headerName: 'Mã phiếu',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'maPhieu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => (
                    <Box title={params.value} textAlign="center" width="100%">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'thoiGianTao',
                sortable: false,
                headerName: 'Thời gian',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'thoiGianTao');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box title={params.value} width="100%" textAlign="center">
                        {new Date(params.value).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Box>
                )
            },
            {
                field: 'loaiThuChi',
                sortable: false,
                headerName: 'Loại thu chi',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'loaiThuChi');
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
                                this.onSort(this.state.sortType, 'tongTienThu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box title={params.value} width="100%" textAlign="center">
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Box>
                )
            },
            {
                field: 'hinhThucThanhToan',
                sortable: false,
                headerName: 'Hình thức',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'hinhThucThanhToan');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box title={params.value} width="100%" textAlign="center">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'trangThai',
                sortable: false,
                headerName: 'Trạng thái',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'trangThai');
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
                    // handleAction={(action: any) => doActionRow(action, params.row)}
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
        const { lstSoQuy } = soQuyStore;
        return (
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
                                    this.setState({ keyword: e.target.value });
                                }}
                                onKeyDown={this.handleKeyDown}
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
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px'
                                }}>
                                30 tháng 6, 2023 - 30 tháng 6, 2023{' '}
                            </Button>
                            <Button
                                variant="outlined"
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
                                variant="contained"
                                startIcon={<FilterIcon />}
                                sx={{
                                    bgcolor: 'var(--color-main)!important',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                                className="btn-container-hover"
                                onClick={() => this.setState({ isShowModal: true })}>
                                Lập phiếu
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="16px">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rows={this.state.data}
                        columns={columns}
                        checkboxSelection
                        sx={{
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
                                color: '#var(--color-main)!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: '#faf2f8'
                                }
                        }}
                        hideFooter
                        localeText={TextTranslate}
                    />
                    <CreateOrEditSoQuyDialog
                        onClose={() => {
                            this.setState({ isShowModal: false });
                        }}
                        onOk={() => {
                            console.log('đóng');
                            this.setState({ isShowModal: false });
                        }}
                        visiable={this.state.isShowModal}
                        idQuyHD={this.state.selectedRowId}
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(SoQuyScreen);
