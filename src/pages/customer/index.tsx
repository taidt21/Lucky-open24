import * as React from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { TextTranslate } from '../../components/TableLanguage';
import {
    Button,
    ButtonGroup,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Avatar,
    SelectChangeEvent
} from '@mui/material';
import './customerPage.css';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import khachHangService from '../../services/khach-hang/khachHangService';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import fileDowloadService from '../../services/file-dowload.service';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { observer } from 'mobx-react';
import khachHangStore from '../../stores/khachHangStore';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import CustomerInfo from './components/CustomerInfo';
import ImportExcel from '../../components/ImportComponent';
import { FileUpload } from '../../services/dto/FileUpload';
import uploadFileService from '../../services/uploadFileService';
import abpCustom from '../../components/abp-custom';
import { SuggestNguonKhachDto } from '../../services/suggests/dto/SuggestNguonKhachDto';
import { SuggestNhomKhachDto } from '../../services/suggests/dto/SuggestNhomKhachDto';
import SuggestService from '../../services/suggests/SuggestService';
interface CustomerScreenState {
    rowTable: KhachHangItemDto[];
    toggle: boolean;
    idkhachHang: string;
    rowPerPage: number;
    currentPage: number;
    keyword: string;
    sortBy: string;
    sortType: string;
    totalItems: number;
    totalPage: number;
    isShowConfirmDelete: boolean;
    importShow: boolean;
    moreOpen: boolean;
    anchorEl: any;
    selectedRowId: any;
    createOrEditKhachHang: CreateOrEditKhachHangDto;
    suggestNguonKhach: SuggestNguonKhachDto[];
    suggestNhomKhach: SuggestNhomKhachDto[];
    visibilityColumn: any;
    information: boolean;
}
class CustomerScreen extends React.Component<any, CustomerScreenState> {
    constructor(props: any) {
        super(props);

        this.state = {
            rowTable: [],
            toggle: false,
            idkhachHang: '',
            rowPerPage: 10,
            currentPage: 1,
            keyword: '',
            sortBy: '',
            sortType: 'desc',
            importShow: false,
            totalItems: 0,
            totalPage: 0,
            isShowConfirmDelete: false,
            moreOpen: false,
            anchorEl: null,
            selectedRowId: null,
            createOrEditKhachHang: {} as CreateOrEditKhachHangDto,
            suggestNguonKhach: [] as SuggestNguonKhachDto[],
            suggestNhomKhach: [] as SuggestNhomKhachDto[],
            visibilityColumn: {},
            information: false
        };
    }

    componentDidMount(): void {
        this.getData();
        this.getSuggest();
        const visibilityColumn = localStorage.getItem('visibilityColumn') ?? {};
        this.setState({ visibilityColumn: visibilityColumn });
    }
    async getSuggest() {
        const nguonKhach = await SuggestService.SuggestNguonKhach();
        const nhomKhach = await SuggestService.SuggestNhomKhach();
        this.setState({
            suggestNguonKhach: nguonKhach,
            suggestNhomKhach: nhomKhach
        });
    }
    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            loaiDoiTuong: 0,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? undefined
        });
        await this.setState({
            rowTable: khachHangs.items,
            totalItems: khachHangs.totalCount,
            totalPage: Math.ceil(khachHangs.totalCount / this.state.rowPerPage)
        });
    }
    handleChange = (event: any) => {
        const { name, value } = event.target;
        this.setState({
            createOrEditKhachHang: {
                ...this.state.createOrEditKhachHang,
                [name]: value
            }
        });
    };
    handleSubmit = () => {
        this.getData();
        this.handleToggle();
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await khachHangStore.createKhachHangDto();
            this.updateModal();
        } else {
            await khachHangStore.getForEdit(id ?? '');
            this.updateModal();
        }
        this.setState({ idkhachHang: id ?? '' }, () => {
            this.handleToggle();
        });
    }
    updateModal = () => {
        this.setState({ createOrEditKhachHang: khachHangStore.createEditKhachHangDto });
    };
    async delete(id: string) {
        const deleteReult = await khachHangService.delete(id);
        deleteReult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
    }
    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };
    exportToExcel = async () => {
        const result = await khachHangService.exportDanhSach({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            idChiNhanh: Cookies.get('IdChiNhanh'),
            loaiDoiTuong: 0,
            sortBy: '',
            sortType: 'desc'
        });
        fileDowloadService.downloadExportFile(result);
    };
    onImportShow = async () => {
        await this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await khachHangService.importKhachHang(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
        this.onImportShow();
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate(
            'KhachHang_ImportTemplate.xlsx'
        );
        fileDowloadService.downloadExportFile(result);
    };
    handlePageChange = async (event: any, newPage: number) => {
        await this.setState({ currentPage: newPage });
        await this.getData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            rowPerPage: parseInt(event.target.value.toString(), 10),
            currentPage: 1
        });
        this.getData();
    };

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        this.handleCloseMenu();
    };
    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    toggleColumnVisibility = (column: GridColumnVisibilityModel) => {
        localStorage.setItem('visibilityColumn', JSON.stringify(column));
        this.setState({ visibilityColumn: column });
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: type
        });
        this.getData();
    };
    handleOpenInfor = () => {
        // if (params.column.field !== 'actions') {
        this.setState({ information: true });

        //}
    };
    handleCloseInfor = () => {
        this.setState({ information: false });
    };
    render(): React.ReactNode {
        const columns: GridColDef[] = [
            {
                field: 'tenKhachHang',
                sortable: false,
                headerName: 'Tên khách hàng',
                minWidth: 185,
                flex: 1.2,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            width: '100%'
                        }}
                        title={params.value}>
                        <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            sx={{
                                fontSize: '12px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tenKhachHang');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'soDienThoai',
                sortable: false,
                headerName: 'Số điện thoại',
                minWidth: 114,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'soDienThoai');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => (
                    <Box textAlign="center" width="100%" fontSize="12px">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tenNhomKhach',
                sortable: false,
                headerName: 'Nhóm khách',
                minWidth: 112,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tenNhomKhach');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'gioiTinh',
                sortable: false,
                headerName: 'Giới tính',
                minWidth: 100,
                flex: 0.8,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'gioiTinh');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => (
                    <Box textAlign="center" width="100%" fontSize="12px">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tongChiTieu',
                sortable: false,
                headerName: 'Tổng chi tiêu',
                minWidth: 113,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700', textAlign: 'right' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tongChiTieu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => (
                    <Box title={params.value} fontSize="12px" textAlign="center" width="100%">
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Box>
                )
            },
            {
                field: 'cuocHenGanNhat',
                sortable: false,
                headerName: 'Cuộc hẹn gần đây',
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '12px',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Box>
                ),
                minWidth: 160,
                flex: 1,
                renderHeader: (params) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            width: '100%',
                            textAlign: 'center',
                            '& svg': {
                                width: '16px',
                                height: '16px'
                            }
                        }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'cuocHenGanNhat');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                maxWidth: 48,
                flex: 1,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        const { createOrEditKhachHang, suggestNguonKhach, suggestNhomKhach } = this.state;

        return (
            <>
                {this.state.information === false ? (
                    <Box
                        className="customer-page"
                        paddingLeft="2.2222222222222223vw"
                        paddingRight="2.2222222222222223vw"
                        paddingTop="1.5277777777777777vw">
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid
                                item
                                xs={12}
                                md="auto"
                                display="flex"
                                alignItems="center"
                                gap="12px">
                                <Typography
                                    color="#333233"
                                    variant="h1"
                                    fontSize="16px"
                                    fontWeight="700">
                                    Danh sách khách hàng
                                </Typography>
                                <Box className="form-search">
                                    <TextField
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderColor: '#CDC9CD',
                                            '& .MuiOutlinedInput-root': {
                                                paddingLeft: '0'
                                            }
                                        }}
                                        className="search-field"
                                        variant="outlined"
                                        type="search"
                                        onChange={async (e) => {
                                            await this.setState({ keyword: e.target.value });
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                this.getData();
                                            }
                                        }}
                                        placeholder="Tìm kiếm"
                                        InputProps={{
                                            startAdornment: (
                                                <IconButton
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({ currentPage: 1 });
                                                        this.getData();
                                                    }}>
                                                    <img src={SearchIcon} />
                                                </IconButton>
                                            )
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid
                                xs={12}
                                md="auto"
                                item
                                display="flex"
                                gap="8px"
                                justifyContent="end">
                                <ButtonGroup
                                    variant="contained"
                                    sx={{ gap: '8px' }}
                                    className="rounded-4px resize-height">
                                    <Button
                                        className="border-color btn-outline-hover"
                                        hidden={
                                            !abpCustom.isGrandPermission('Pages.KhachHang.Import')
                                        }
                                        variant="outlined"
                                        onClick={this.onImportShow}
                                        startIcon={<img src={DownloadIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            color: '#666466',
                                            bgcolor: '#fff!important'
                                        }}>
                                        Nhập
                                    </Button>
                                    <Button
                                        className="border-color btn-outline-hover"
                                        variant="outlined"
                                        hidden={
                                            !abpCustom.isGrandPermission('Pages.KhachHang.Export')
                                        }
                                        onClick={() => {
                                            this.exportToExcel();
                                        }}
                                        startIcon={<img src={UploadIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            color: '#666466',
                                            padding: '10px 16px',
                                            borderColor: '#E6E1E6',
                                            bgcolor: '#fff!important'
                                        }}>
                                        Xuất
                                    </Button>
                                    <Button
                                        className=" btn-container-hover"
                                        hidden={
                                            !abpCustom.isGrandPermission('Pages.KhachHang.Create')
                                        }
                                        onClick={() => {
                                            this.createOrUpdateModalOpen('');
                                        }}
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            minWidth: '173px'
                                        }}>
                                        Thêm khách hàng
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <div
                            className="customer-page_row-2"
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                backgroundColor: '#fff'
                            }}>
                            <DataGrid
                                disableRowSelectionOnClick
                                autoHeight
                                rows={this.state.rowTable}
                                columns={columns}
                                onRowClick={() => this.handleOpenInfor}
                                hideFooter
                                onColumnVisibilityModelChange={this.toggleColumnVisibility}
                                columnVisibilityModel={this.state.visibilityColumn}
                                checkboxSelection
                                sx={{
                                    '& .MuiDataGrid-iconButtonContainer': {
                                        display: 'none'
                                    },
                                    '& .MuiDataGrid-cellContent': {
                                        fontSize: '12px'
                                    },
                                    '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                        outline: 'none!important'
                                    },
                                    '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus':
                                        {
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
                                localeText={TextTranslate}
                            />
                            <ActionMenuTable
                                selectedRowId={this.state.selectedRowId}
                                anchorEl={this.state.anchorEl}
                                closeMenu={this.handleCloseMenu}
                                handleView={this.handleView}
                                permissionView=""
                                handleEdit={this.handleEdit}
                                permissionEdit="Pages.KhachHang.Edit"
                                handleDelete={this.showConfirmDelete}
                                permissionDelete="Pages.KhachHang.Delete"
                            />
                            <CustomTablePagination
                                currentPage={this.state.currentPage}
                                rowPerPage={this.state.rowPerPage}
                                totalRecord={this.state.totalItems}
                                totalPage={this.state.totalPage}
                                handlePerPageChange={this.handlePerPageChange}
                                handlePageChange={this.handlePageChange}
                            />
                            <CreateOrEditCustomerDialog
                                visible={this.state.toggle}
                                onCancel={this.handleToggle}
                                onOk={this.handleSubmit}
                                handleChange={this.handleChange}
                                title={
                                    this.state.idkhachHang == ''
                                        ? 'Thêm mới khách hàng'
                                        : 'Cập nhật thông tin khách hàng'
                                }
                                formRef={createOrEditKhachHang}
                                suggestNguonKhach={suggestNguonKhach}
                                suggestNhomKhach={suggestNhomKhach}
                            />
                        </div>
                        <div
                            className={
                                this.state.toggle ? 'show customer-overlay' : 'customer-overlay'
                            }
                            onClick={this.handleToggle}></div>

                        <ConfirmDelete
                            isShow={this.state.isShowConfirmDelete}
                            onOk={this.onOkDelete}
                            onCancel={this.showConfirmDelete}></ConfirmDelete>
                        <ImportExcel
                            isOpen={this.state.importShow}
                            onClose={this.onImportShow}
                            downloadImportTemplate={this.downloadImportTemplate}
                            importFile={this.handleImportData}
                        />
                    </Box>
                ) : (
                    <CustomerInfo onClose={this.handleCloseInfor} />
                )}
            </>
        );
    }
}
export default observer(CustomerScreen);
