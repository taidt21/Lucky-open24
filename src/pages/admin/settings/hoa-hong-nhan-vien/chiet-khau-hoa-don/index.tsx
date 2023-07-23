import { observer } from 'mobx-react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import chietKhauHoaDonStore from '../../../../../stores/chietKhauHoaDonStore';
import AppConsts from '../../../../../lib/appconst';
import SearchIcon from '../../../../../images/search-normal.svg';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../.././../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, Grid, SelectChangeEvent } from '@mui/material';
import CreateOrEditChietKhauHoaDonModal from './components/create-or-edit-chiet-khau-hd';
import Cookies from 'js-cookie';
import CustomTablePagination from '../../../../../components/Pagination/CustomTablePagination';
class ChietKhauHoaDonScreen extends Component {
    state = {
        idChietKhauHD: AppConsts.guidEmpty,
        visited: false,
        isShowConfirmDelete: false,
        keyword: '',
        sortBy: '',
        sortType: 'desc',
        skipCount: 1,
        maxResultCount: 10,
        totalCount: 0,
        totalPage: 0,
        createOrEditModel: {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            chungTuApDung: [],
            giaTriChietKhau: 0,
            loaiChietKhau: 0
        } as CreateOrEditChietKhauHoaDonDto
    };
    componentDidMount(): void {
        this.getAll();
    }
    getAll = async () => {
        await chietKhauHoaDonStore.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
    };
    Modal = () => {
        this.setState({ visited: !this.state.visited });
    };
    createOrEditShowModal = (id: string) => {
        if (id === '') {
            const newModel = chietKhauHoaDonStore.createModel();
            this.setState({ createOrEditModel: newModel });
        } else {
            const model = chietKhauHoaDonStore.getForEdit(id);
            this.setState({ createOrEditModel: model });
        }
        this.setState({ idChietKhauHD: id });
        this.Modal();
    };
    handleCreate = async () => {
        await this.getAll();
        this.Modal();
    };
    delete = async (id: string) => {
        await chietKhauHoaDonStore.delete(id);
    };
    onShowDeleteConfirm = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    onOkDelete = async () => {
        this.delete(this.state.idChietKhauHD);
        await this.getAll();
        this.onShowDeleteConfirm();
    };
    onCancelDelete = () => {
        this.setState({ isShowConfirmDelete: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        console.log(value);
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
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortType: type,
            sortBy: sortBy
        });
        this.getAll();
    };
    render(): ReactNode {
        const { chietKhauHoaDons } = chietKhauHoaDonStore;
        const columns: GridColDef[] = [
            {
                field: 'giaTriChietKhau',
                sortable: false,
                headerName: 'Hoa hồng',
                minWidth: 112,
                flex: 1,
                align: 'center',
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'giaTriChietKhau');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'chungTuApDung',
                sortable: false,
                headerName: 'Chứng từ áp dụng',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'chungTuApDung');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'ghiChu',
                headerName: 'Ghi chú',
                minWidth: 150,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting />
                    </Box>
                )
            }
        ];
        return (
            <Box>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ background: 'var(--color-bg)', padding: '8px' }}>
                    <Grid item>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD',
                                    '& .MuiInputBase-root': {
                                        height: '32px',
                                        fontSize: '14px'
                                    }
                                }}
                                onChange={(e) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" onClick={this.getAll}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => {
                                this.setState({ visited: true });
                            }}
                            sx={{ height: 32, color: '#FFFAFF' }}
                            startIcon={<AddOutlinedIcon sx={{ color: '#FFFAFF' }} />}
                            className="btn-container-hover">
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Box>
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        columns={columns}
                        rows={chietKhauHoaDons === undefined ? [] : chietKhauHoaDons.items}
                        localeText={TextTranslate}
                        checkboxSelection={false}
                        sx={{
                            '& .uiDataGrid-cellContent': {
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
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
                                    fill: 'var(--color-main)'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(1)':
                                {
                                    fill: 'var(--color-main)'
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
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={
                            chietKhauHoaDons === undefined ? 0 : chietKhauHoaDons.totalCount
                        }
                        totalPage={
                            chietKhauHoaDons === undefined
                                ? 0
                                : Math.ceil(chietKhauHoaDons.totalCount / this.state.maxResultCount)
                        }
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditChietKhauHoaDonModal
                        formRef={this.state.createOrEditModel}
                        onClose={this.Modal}
                        onSave={this.handleCreate}
                        visited={this.state.visited}
                        title={this.state.idChietKhauHD === '' ? 'Thêm mới' : 'Cập nhật'}
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(ChietKhauHoaDonScreen);
