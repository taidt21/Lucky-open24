import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import Cookies from 'js-cookie';
import SuggestService from '../../services/suggests/SuggestService';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditNhanVienDialog from './components/createOrEditNhanVienDialog';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { observer } from 'mobx-react';
import NhanVienStore from '../../stores/nhanVienStore';
import { TextTranslate } from '../../components/TableLanguage';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import './employee.css';
import { enqueueSnackbar } from 'notistack';
import nhanVienStore from '../../stores/nhanVienStore';
import { FileUpload } from '../../services/dto/FileUpload';
import fileDowloadService from '../../services/file-dowload.service';
import uploadFileService from '../../services/uploadFileService';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import ImportExcel from '../../components/ImportComponent';
import abpCustom from '../../components/abp-custom';
import { ChiNhanhContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
class EmployeeScreen extends React.Component {
    static contextType = ChiNhanhContext;
    state = {
        idNhanSu: '',
        avatarFile: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        sortBy: '',
        sortType: 'desc',
        moreOpen: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        currentPage: 1,
        totalPage: 1,
        totalCount: 0,
        isShowConfirmDelete: false,
        idChiNhanh: Cookies.get('IdChiNhanh')
    };
    async componentDidMount() {
        await this.getData();
    }
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
        const chiNhanhContext = this.context as SuggestChiNhanhDto;

        if (this.state.idChiNhanh !== chiNhanhContext.id) {
            // ChiNhanhContext has changed, update the component
            this.setState({
                idChiNhanh: chiNhanhContext.id
            });
            this.getData();
        }
    }
    resetData() {
        this.setState({
            idNhanSu: '',
            modalVisible: false,
            maxResultCount: 10,
            skipCount: 0,
            filter: '',
            createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
            totalNhanVien: 0,
            currentPage: 1,
            totalPage: 1,
            isShowConfirmDelete: false
        });
    }
    async getData() {
        const chiNhanhContext = this.context as SuggestChiNhanhDto;
        const suggestChucVus = await SuggestService.SuggestChucVu();
        this.setState({
            suggestChucVu: suggestChucVus,
            idChiNhanh: chiNhanhContext.id
        });
        await this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, maxResultCount, currentPage, sortBy, sortType } = this.state;
        const chiNhanhContext = this.context as SuggestChiNhanhDto;
        await NhanVienStore.getAll({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: chiNhanhContext.id
        });
        this.setState({
            totalPage: Math.ceil(NhanVienStore.listNhanVien.totalCount / maxResultCount),
            totalCount: NhanVienStore.listNhanVien.totalCount
        });
    }
    async delete(id: string) {
        const deleteResult = NhanVienStore.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.resetData();
    }
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await NhanVienStore.createNhanVien();
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        } else {
            await NhanVienStore.getForEdit(id);
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        }
        this.setState({ IdKhachHang: id });
        this.Modal();
    }
    handleSubmit = async () => {
        await this.getData();
        this.setState({ modalVisible: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getListNhanVien();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getData();
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.handleDelete;
        this.handleCloseMenu();
    };
    handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            await this.setState({
                currentPage: 1,
                skipCount: 1
            });
            this.getListNhanVien();
        }
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        //await this.getData();
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

    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };
    exportToExcel = async () => {
        const { filter, maxResultCount, currentPage, sortBy, sortType } = this.state;
        const result = await nhanVienService.exportDanhSachNhanVien({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: Cookies.get('IdChiNhanh')
        });
        fileDowloadService.downloadExportFile(result);
    };
    onImportShow = () => {
        this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await nhanVienService.inportNhanVien(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate(
            'NhanVien_ImportTemplate.xlsx'
        );
        fileDowloadService.downloadExportFile(result);
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: type
        });
        this.getData();
    };
    columns: GridColDef[] = [
        {
            field: 'tenNhanVien',
            sortable: false,
            headerName: 'Tên nhân viên',
            minWidth: 171,
            flex: 1,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }} width="100%">
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography
                        fontSize="12px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px"
                        title={params.value}
                        sx={{ textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
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
                            this.onSort(this.state.sortType, 'tenNhanVien');
                        }}
                    />
                </Box>
            )
        },
        {
            field: 'soDienThoai',
            sortable: false,
            headerName: 'Số điện thoại',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'soDienThoai');
                        }}
                    />{' '}
                </Box>
            ),
            renderCell: (params) => (
                <Box width="100%" textAlign="center" fontSize="12px">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngaySinh',
            sortable: false,
            headerName: 'Ngày sinh',
            minWidth: 112,
            flex: 1,
            renderCell: (params) => (
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    {params.value != null ? (
                        <>
                            <DateIcon style={{ marginRight: 4 }} />
                            <Typography
                                fontSize="12px"
                                fontWeight="400"
                                variant="h6"
                                color="#333233"
                                lineHeight="16px">
                                {new Date(params.value).toLocaleDateString('en-GB')}
                            </Typography>
                        </>
                    ) : null}
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'ngaySinh');
                        }}
                    />
                </Box>
            )
        },
        {
            field: 'gioiTinh',
            sortable: false,
            headerName: 'Giới tính',
            minWidth: 60,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    <Typography
                        fontSize="12px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {params.value == 0 ? '' : params.value == 1 ? 'Nam' : 'Nữ'}
                    </Typography>
                </Box>
            ),
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
            )
        },
        {
            field: 'diaChi',
            sortable: false,
            headerName: 'Địa chỉ',
            minWidth: 130,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '700'
                    }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'diaChi');
                        }}
                    />
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        fontSize: '12px',
                        textAlign: 'center'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tenChucVu',
            sortable: false,
            headerName: 'Vị trí',
            minWidth: 113,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="12px"
                    fontWeight="400"
                    variant="h6"
                    color="#333233"
                    lineHeight="16px"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'tenChucVu');
                        }}
                    />
                </Box>
            )
        },
        {
            field: 'ngayVaoLam',
            sortable: false,
            headerName: 'Ngày tham gia',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => (
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="12px"
                        variant="h6"
                        fontWeight="400"
                        color="#333233"
                        lineHeight="16px">
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'ngayVaoLam');
                        }}
                    />
                </Box>
            )
        },
        {
            field: 'trangThai',
            sortable: false,
            headerName: 'Trạng thái',
            minWidth: 116,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="12px"
                    variant="h6"
                    lineHeight="16px"
                    padding="4px 8px"
                    borderRadius="12px"
                    fontWeight="400"
                    color="#009EF7"
                    sx={{ backgroundColor: '#F1FAFF', margin: 'auto' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting
                        className="custom-icon"
                        onClick={() => {
                            this.onSort(this.state.sortType, 'trangThai');
                        }}
                    />
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
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event: any) => {
                        params.row.trangThai == 'Hoạt động'
                            ? this.handleOpenMenu(event, params.row.id)
                            : null;
                    }}>
                    <MoreHorizIcon />
                </IconButton>
            ),
            renderHeader: (params) => (
                <Box sx={{ display: 'none' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        }
    ];
    public render() {
        const { listNhanVien } = NhanVienStore;
        return (
            <Box
                className="list-nhan-vien"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                            Quản lý nhân viên
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD',
                                    height: '40px',
                                    '& .MuiInputBase-root': {
                                        pl: '0'
                                    }
                                }}
                                onChange={(e: any) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListNhanVien();
                                    }
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListNhanVien();
                                            }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Button
                            variant="outlined"
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Import')}
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                padding: '10px 16px',
                                borderRadius: '4px!important'
                            }}
                            onClick={this.onImportShow}
                            className="btn-outline-hover">
                            Nhập
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Export')}
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                height: '40px',
                                borderRadius: '4px!important'
                            }}
                            onClick={this.exportToExcel}
                            className="btn-outline-hover">
                            Xuất
                        </Button>
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Create')}
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: 'var(--color-main)!important'
                                }}
                                className="btn-container-hover">
                                Thêm nhân viên
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Box marginTop="24px" bgcolor="#fff">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rows={listNhanVien === undefined ? [] : listNhanVien.items}
                        columns={this.columns}
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
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        permissionView=""
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.NhanSu.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="Pages.NhanSu.Delete"
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.handleDelete}></ConfirmDelete>
                <ImportExcel
                    isOpen={this.state.importShow}
                    onClose={this.onImportShow}
                    downloadImportTemplate={this.downloadImportTemplate}
                    importFile={this.handleImportData}
                />
                <CreateOrEditNhanVienDialog
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({ modalVisible: false });
                    }}
                    onOk={this.handleSubmit}
                    title={
                        this.state.idNhanSu === ''
                            ? 'Thêm mới nhân viên'
                            : 'Cập nhật thông tin nhân viên'
                    }
                    suggestChucVu={this.state.suggestChucVu}
                    formRef={nhanVienStore.createEditNhanVien}></CreateOrEditNhanVienDialog>
            </Box>
        );
    }
}

export default observer(EmployeeScreen);
