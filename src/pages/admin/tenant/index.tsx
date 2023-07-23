import React, { ChangeEventHandler } from 'react';
import { GetAllTenantOutput } from '../../../services/tenant/dto/getAllTenantOutput';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    IconButton,
    SelectChangeEvent
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AppComponentBase from '../../../components/AppComponentBase';
import tenantService from '../../../services/tenant/tenantService';

import '../../../custom.css';
import AddIcon from '../../../images/add.svg';
import CreateOrEditTenant from './components/create-or-edit-tenant';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import CreateTenantInput from '../../../services/tenant/dto/createTenantInput';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { enqueueSnackbar } from 'notistack';
import abpCustom from '../../../components/abp-custom';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITenantProps {}

export interface ITenantState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    tenantId: number;
    filter: string;
    listTenant: GetAllTenantOutput[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    createOrEditTenant: CreateTenantInput;
    isShowConfirmDelete: boolean;
}
class TenantScreen extends AppComponentBase<ITenantProps> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        listTenant: [] as GetAllTenantOutput[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        createOrEditTenant: {
            isActive: true,
            name: '',
            adminEmailAddress: '',
            connectionString: '',
            tenancyName: ''
        } as CreateTenantInput,
        isShowConfirmDelete: false,
        anchorEl: null,
        selectedRowId: 0
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const tenants = await tenantService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });
        this.setState({
            listTenant: tenants.items,
            totalCount: tenants.totalCount,
            totalPage: Math.ceil(tenants.totalCount / this.state.maxResultCount)
        });
    }

    handlePageChange = async (event: any, value: any) => {
        this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getAll();
    };
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    createOrUpdateModalOpen = async (entityDto: number) => {
        if (entityDto === 0) {
            await this.setState({
                createOrEditTenant: {
                    isActive: true,
                    name: '',
                    adminEmailAddress: '',
                    connectionString: '',
                    tenancyName: ''
                }
            });
        } else {
            const createOrEdit = await tenantService.get(entityDto);
            await this.setState({
                createOrEditTenant: {
                    isActive: createOrEdit.isActive,
                    name: createOrEdit.name,
                    tenancyName: createOrEdit.tenancyName,
                    adminEmailAddress: '',
                    connectionString: ''
                }
            });
        }

        this.setState({ tenantId: entityDto });
        this.Modal();
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
    };
    async delete(input: number) {
        const deleteResult = await tenantService.delete(input);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.getAll();
    }

    handleCreate = () => {
        this.getAll();
        this.Modal();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };
    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    render(): React.ReactNode {
        const columns = [
            {
                field: 'name',
                headerName: 'Tên cửa hàng',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            fontSize: '12px',
                            width: '100%',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={params.value}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tenancyName',
                headerName: 'Tenant Id',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            fontSize: '12px',
                            width: '100%',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={params.value}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'isActive',
                headerName: 'Trạng thái',
                minWidth: 100,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            color: 'rgb(0, 158, 247)',
                            bgcolor: 'rgb(241, 250, 255)',
                            margin: 'auto'
                        }}>
                        {params.value == true ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Box>
                )
            },
            {
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params: any) => (
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
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box sx={{ padding: '24px 2.2222222222222223vw' }}>
                <div>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <div>
                                <Box display="flex" gap="8px" alignItems="center">
                                    <Typography
                                        variant="h1"
                                        fontWeight="700"
                                        fontSize="16px"
                                        sx={{ marginTop: '4px' }}>
                                        Danh sách tenant
                                    </Typography>
                                    <Box>
                                        <TextField
                                            onChange={this.handleSearch}
                                            size="small"
                                            sx={{
                                                borderColor: '#E6E1E6!important',
                                                bgcolor: '#fff'
                                            }}
                                            placeholder="Tìm kiếm..."
                                            InputProps={{
                                                startAdornment: (
                                                    <SearchIcon
                                                        style={{
                                                            marginRight: '8px',
                                                            color: 'gray'
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center" gap="8px">
                                    <Button
                                        hidden={
                                            !abpCustom.isGrandPermission('Pages.Tenants.Create')
                                        }
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        size="small"
                                        sx={{
                                            height: '40px',
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            fontWeight: '400'
                                        }}
                                        onClick={() => {
                                            this.createOrUpdateModalOpen(0);
                                        }}
                                        className="btn-container-hover">
                                        Thêm tenant
                                    </Button>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <Box
                    marginTop="24px"
                    className="page-content "
                    sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        columns={columns}
                        rows={this.state.listTenant}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'var(--color-bg)'
                            },
                            '& p': {
                                mb: 0
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
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path::nth-of-type(2)':
                                {
                                    fill: '#000'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path::nth-of-type(1)':
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
                        permissionEdit="Pages.Tenants.Edit"
                        handleDelete={this.onShowDelete}
                        permissionDelete="Pages.Tenants.Delete"
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
                <CreateOrEditTenant
                    formRef={this.state.createOrEditTenant}
                    visible={this.state.modalVisible}
                    modalType={this.state.tenantId === 0 ? 'Thêm mới tenant' : 'Cập nhật tenant'}
                    tenantId={this.state.tenantId}
                    onCancel={async () => {
                        this.setState({
                            modalVisible: false
                        });
                        await this.getAll();
                    }}
                    onOk={this.handleCreate}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </Box>
        );
    }
}

export default TenantScreen;
