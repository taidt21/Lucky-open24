import { Component, ReactNode } from 'react';
import '../../employee/employee.css';
import React from 'react';
import { NgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/NgayNghiLeDto';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import {
    Box,
    Button,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditThoiGianNghi from './create-or-edit-thoi-gian-nghi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import AppConsts from '../../../lib/appconst';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { enqueueSnackbar } from 'notistack';
import { FileUpload } from '../../../services/dto/FileUpload';
import uploadFileService from '../../../services/uploadFileService';
import fileDowloadService from '../../../services/file-dowload.service';
import abpCustom from '../../../components/abp-custom';
class EmployeeHoliday extends Component {
    state = {
        IdHoliday: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        sortBy: '',
        moreOpen: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        listHoliday: [] as NgayNghiLeDto[],
        createOrEditNgayNghiLe: {
            id: AppConsts.guidEmpty,
            tenNgayLe: '',
            tuNgay: new Date(),
            denNgay: new Date()
        } as CreateOrEditNgayNghiLeDto,
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        startIndex: 0,
        isShowConfirmDelete: false,
        sortColumn: null,
        sortType: 'desc'
    };
    async componentDidMount() {
        this.getData();
        this.getListHoliday();
    }
    async getData() {
        if (this.state.IdHoliday !== '') {
            const holiday = await ngayNghiLeService.getForEdit(this.state.IdHoliday);
            this.setState({ createOrEditNgayNghiLe: holiday });
        }
        //this.getListHoliday();
    }
    async getListHoliday() {
        const data = await ngayNghiLeService.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        await this.setState({
            listHoliday: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getListHoliday();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getListHoliday();
    };
    handleChange = (event: any): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditNhanSu: {
                ...this.state.createOrEditNgayNghiLe,
                [name]: value
            }
        });
    };
    handleSearch = () => {
        console.log('ok');
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            IdHoliday: ''
        });
        this.getData();
        this.getListHoliday();
    };
    createOrUpdateModalOpen = async (id: string) => {
        this.setState({
            IdHoliday: id
        });
        if (id !== '') {
            const holiday = await ngayNghiLeService.getForEdit(id);
            this.setState({ createOrEditNgayNghiLe: holiday });
        } else {
            this.setState({
                createOrEditNgayNghiLe: {
                    id: AppConsts.guidEmpty,
                    tenNgayLe: '',
                    tuNgay: new Date(),
                    denNgay: new Date()
                }
            });
        }
        this.Modal();
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: type
        });
        this.getListHoliday();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getListHoliday();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    delete = async (id: string) => {
        const deleteResult = await ngayNghiLeService.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
    };
    onOkDelete = async () => {
        await this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        await this.handleCloseMenu();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };

    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            IdHoliday: ''
        });
    };
    exportToExcel = async () => {
        const result = await ngayNghiLeService.exportToExcel({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
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
        const result = await ngayNghiLeService.importExcel(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : 'error',
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('NghiLe_ImportTemplate.xlsx');
        fileDowloadService.downloadExportFile(result);
    };
    render() {
        const columns: GridColDef[] = [
            {
                field: 'tenNgayLe',
                sortable: false,
                headerName: 'Tên ngày lễ',
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
                                this.onSort(this.state.sortType, 'tenNgayLe');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params) => (
                    <Box
                        sx={{
                            overflow: 'hidden',
                            width: '100%',
                            textOverflow: 'ellipsis',
                            fontSize: '12px',
                            textAlign: 'center'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tuNgay',
                headerName: 'Ngày bắt đầu',
                sortable: false,
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
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
                                this.onSort(this.state.sortType, 'tuNgay');
                            }}
                        />{' '}
                    </Box>
                )
            },
            {
                field: 'denNgay',
                headerName: 'Ngày kết thúc',
                sortable: false,
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box
                        sx={{
                            fontWeight: '700'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'denNgay');
                            }}
                        />{' '}
                    </Box>
                )
            },
            {
                field: 'tongSoNgay',
                headerName: 'Tổng số ngày',
                sortable: false,
                // width: 150,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'center'
                        }}>
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {params.value} ngày
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tongSoNgay');
                            }}
                        />{' '}
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                // width: 48,
                flex: 0.3,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => this.handleOpenMenu(event, params.row.id)}>
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
        return (
            <Box padding="22px 32px" className="thoi-gian-nghi-page">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" gap="10px" alignItems="center">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Quản lý thời gian nghỉ
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
                                onChange={(e) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListHoliday();
                                    }
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListHoliday();
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
                            hidden={!abpCustom.isGrandPermission('NhanSu_NgayNghiLe.Import')}
                            size="small"
                            onClick={this.onImportShow}
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                backgroundColor: '#fff!important',
                                borderColor: '#E6E1E6!important'
                            }}
                            className="btn-outline-hover">
                            Nhập
                        </Button>
                        <Button
                            hidden={!abpCustom.isGrandPermission('NhanSu_NgayNghiLe.Export')}
                            size="small"
                            onClick={this.exportToExcel}
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                backgroundColor: '#fff!important',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6!important',
                                height: '40px'
                            }}
                            className="btn-outline-hover">
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                this.createOrUpdateModalOpen('');
                            }}
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                height: '40px',
                                fontSize: '14px'
                            }}
                            className="btn-container-hover">
                            Thêm ngày nghỉ
                        </Button>
                    </Grid>
                </Grid>
                <Box marginTop="24px" bgcolor="#fff">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rows={this.state.listHoliday}
                        columns={columns}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeadersInner': {
                                backgroundColor: 'var(--color-bg)'
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
                        permissionEdit="Pages.NhanSu_NgayNghiLe.Edit"
                        handleDelete={this.showConfirmDelete}
                        permissionDelete="Pages.NhanSu_NgayNghiLe.Delete"
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
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
                <CreateOrEditThoiGianNghi
                    visible={this.state.modalVisible}
                    title={this.state.IdHoliday == '' ? 'Thêm mới' : 'Cập nhật'}
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={this.state.createOrEditNgayNghiLe}></CreateOrEditThoiGianNghi>
            </Box>
        );
    }
}
export default EmployeeHoliday;
