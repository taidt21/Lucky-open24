import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Stack,
    Button,
    Pagination,
    IconButton
} from '@mui/material';
import { Add, FileDownload, Search } from '@mui/icons-material';

import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
// prop for send data from parent to child
import { PropModal, PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { TextTranslate } from '../../components/TableLanguage';
/* custom component */
import BreadcrumbsPageTitle from '../../components/Breadcrumbs/PageTitle';
import AccordionNhomHangHoa from '../../components/Accordion/NhomHangHoa';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import ActionViewEditDelete from '../../components/Menu/ActionViewEditDelete';
import { ModalNhomHangHoa } from './ModalGroupProduct';
import { ModalHangHoa } from './ModalProduct';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import {
    ModelNhomHangHoa,
    ModelHangHoaDto,
    PagedProductSearchDto
} from '../../services/product/dto';
import { ReactComponent as UploadIcon } from '../../images/upload.svg';
import { ReactComponent as DownIcon } from '../../images/download.svg';
import Utils from '../../utils/utils'; // func common
import AppConsts from '../../lib/appconst';
import { ReactComponent as SeasrchIcon } from '../../images/search-normal.svg';
import './style.css';
import fileDowloadService from '../../services/file-dowload.service';
import { enqueueSnackbar } from 'notistack';
import uploadFileService from '../../services/uploadFileService';
import { FileUpload } from '../../services/dto/FileUpload';
import ImportExcel from '../../components/ImportComponent';

export default function PageProductNew() {
    const [rowHover, setRowHover] = useState<ModelHangHoaDto>();
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalProduct, setTriggerModalProduct] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [isShowImport, setShowImport] = useState<boolean>(false);
    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [treeNhomHangHoa, setTreeNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);

    const [pageDataProduct, setPageDataProduct] = useState<PagedResultDto<ModelHangHoaDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const [filterPageProduct, setFilterPageProduct] = useState<PagedProductSearchDto>({
        idNhomHangHoas: '',
        textSearch: '',
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: '',
        typeSort: ''
    });

    const GetListHangHoa = async () => {
        const list = await ProductService.Get_DMHangHoa(filterPageProduct);
        setPageDataProduct({
            totalCount: list.totalCount,
            totalPage: Utils.getTotalPage(list.totalCount, filterPageProduct.pageSize),
            items: list.items
        });
        console.log('list ', list);
    };

    const GetListNhomHangHoa = async () => {
        // used to modal hanghoa
        const list = await GroupProductService.GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    const GetTreeNhomHangHoa = async () => {
        // used to tree at menu left
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: 'var(--color-main)'
        });
        setTreeNhomHangHoa([obj, ...list.items]);
    };

    const PageLoad = () => {
        GetListNhomHangHoa();
        GetTreeNhomHangHoa();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        GetListHangHoa();
    }, [
        filterPageProduct.currentPage,
        filterPageProduct.pageSize,
        filterPageProduct.idNhomHangHoas
    ]);

    function showModalAddNhomHang(id = '') {
        setTriggerModalNhomHang({
            isShow: true,
            isNew: Utils.checkNull(id),
            id: id
        });
    }

    function showModalAddProduct(action?: number, id = '') {
        setTriggerModalProduct((old: any) => {
            return {
                ...old,
                isShow: true,
                isNew: Utils.checkNull(id),
                id: id
            };
        });
    }

    const editNhomHangHoa = (isEdit: any, item: ModelNhomHangHoa) => {
        if (isEdit) {
            setTriggerModalNhomHang({
                isShow: true,
                isNew: Utils.checkNull(item.id),
                id: item.id,
                item: item
            });
        } else {
            setFilterPageProduct({ ...filterPageProduct, idNhomHangHoas: item.id });
            setTriggerModalProduct((old: any) => {
                return {
                    ...old,
                    isShow: false,
                    item: { ...old.item, idNhomHangHoa: item.id }
                };
            });
        }
    };

    function saveNhomHang(objNew: ModelNhomHangHoa, isDelete = false) {
        console.log('objNew ', objNew);
        if (isDelete) {
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + objNew.sLoaiNhomHang + ' thành công'
            });
            setLstProductGroup((old: ModelNhomHangHoa[]) => {
                return old.filter((x: ModelNhomHangHoa) => x.id !== objNew.id);
            });
        } else {
            if (triggerModalNhomHang.isNew) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Thêm ' + objNew.sLoaiNhomHang + ' thành công'
                });
                setLstProductGroup([objNew, ...lstProductGroup]);
            } else {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + objNew.sLoaiNhomHang + ' thành công'
                });
                setLstProductGroup(
                    lstProductGroup.map((item: ModelNhomHangHoa) => {
                        console.log('item ', item.id, objNew.id);
                        if (item.id === objNew.id) {
                            return {
                                ...item,
                                color: objNew.color,
                                tenNhomHang: objNew.tenNhomHang,
                                tenNhomHang_KhongDau: objNew.tenNhomHang_KhongDau,
                                laNhomHangHoa: objNew.laNhomHangHoa,
                                sLoaiNhomHang: objNew.sLoaiNhomHang,
                                idParent: objNew.idParent
                            };
                        } else {
                            return item;
                        }
                    })
                );
            }
        }
        setTriggerModalNhomHang({ ...triggerModalNhomHang, isShow: false });

        GetTreeNhomHangHoa();
    }

    function saveProduct(objNew: ModelHangHoaDto, type = 1) {
        // 1.insert, 2.update, 3.delete, 4.khoiphuc
        const sLoai = objNew.tenLoaiHangHoa?.toLocaleLowerCase();
        switch (type) {
            case 1:
                setPageDataProduct((olds) => {
                    return {
                        ...olds,
                        totalCount: olds.totalCount + 1,
                        totalPage: Utils.getTotalPage(
                            olds.totalCount + 1,
                            filterPageProduct.pageSize
                        ),
                        items: [objNew, ...olds.items]
                    };
                });
                setObjAlert({ show: true, type: 1, mes: 'Thêm ' + sLoai + ' thành công' });
                break;
            case 2:
                GetListHangHoa();
                setObjAlert({ show: true, type: 1, mes: 'Sửa ' + sLoai + ' thành công' });
                break;
            case 3:
                deleteProduct();
                break;
            case 4:
                restoreProduct();
                setObjAlert({ show: true, type: 1, mes: 'Khôi phục ' + sLoai + ' thành công' });
                break;
        }
    }

    const handleChangePage = (event: any, value: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            currentPage: value
        });
    };
    const changeNumberOfpage = (sizePage: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            pageSize: sizePage
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (filterPageProduct.currentPage !== 1) {
            setFilterPageProduct({
                ...filterPageProduct,
                currentPage: 1
            });
        } else {
            GetListHangHoa();
        }
    };

    const doActionRow = (action: any, rowItem: any) => {
        setRowHover(rowItem);
        if (action < 2) {
            showModalAddProduct(action, rowItem?.idDonViQuyDoi);
        } else {
            setInforDeleteProduct(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowItem.tenLoaiHangHoa.toLocaleLowerCase()}  ${
                        rowItem?.maHangHoa ?? ' '
                    } không?`
                })
            );
        }
    };
    console.log('page');

    const deleteProduct = async () => {
        if (!Utils.checkNull(rowHover?.idDonViQuyDoi)) {
            await ProductService.DeleteProduct_byIDHangHoa(rowHover?.idHangHoa ?? '');
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
            });
            setInforDeleteProduct({ ...inforDeleteProduct, show: false });
            setPageDataProduct((olds) => {
                return {
                    ...olds,
                    // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                    // totalCount: olds.totalCount - 1,
                    // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                    items: olds.items.map((x: any) => {
                        if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                            return { ...x, trangThai: 0, txtTrangThaiHang: 'Ngừng kinh doanh' };
                        } else {
                            return x;
                        }
                    })
                };
            });
        }
    };

    const restoreProduct = async () => {
        await ProductService.DeleteProduct_byIDHangHoa(rowHover?.idHangHoa ?? '');
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Khôi phục ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
        });
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        setPageDataProduct((olds) => {
            return {
                ...olds,
                // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                // totalCount: olds.totalCount - 1,
                // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                items: olds.items.map((x: any) => {
                    if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                        return { ...x, trangThai: 1, txtTrangThaiHang: 'Đang kinh doanh' };
                    } else {
                        return x;
                    }
                })
            };
        });
    };
    const exportToExcel = async () => {
        const result = await ProductService.ExportToExcel(filterPageProduct);
        fileDowloadService.downloadExportFile(result);
    };
    const onImportShow = () => {
        setShowImport(!isShowImport);
        GetListHangHoa();
    };
    const handleImportData = async (input: FileUpload) => {
        const result = await ProductService.importHangHoa(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
    };
    const downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate(
            'HangHoa_DichVu_ImportTemplate.xlsx'
        );
        fileDowloadService.downloadExportFile(result);
    };
    const columns: GridColDef[] = [
        {
            field: 'maHangHoa',
            headerName: 'Mã dịch vụ',

            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="12px"
                    variant="body2"
                    color="#333233"
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value || ''}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            minWidth: 250,
            renderCell: (params) => (
                <Box display="flex" width="100%">
                    <Typography
                        fontSize="12px"
                        variant="body2"
                        color="#333233"
                        title={params.value || ''}
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'tenNhomHang',
            headerName: 'Nhóm dịch vụ',
            minWidth: 176,
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'giaBan',
            headerName: 'Giá bán',

            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="end" width="100%">
                    <Typography variant="body2" color="#333233" fontSize="12px">
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        // {
        //     field: 'soPhutThucHien',
        //     headerName: 'Thời gian',
        //     minWidth: 128,
        //     flex: 1,
        //     renderCell: (params) => (
        //         <Box display="flex" width="100%" justifyContent="center">
        //             <ClockIcon />
        //             <Typography variant="body2" color="#333233" marginLeft="9px" fontSize="12px">
        //                 {params.value || ''} phút
        //             </Typography>
        //         </Box>
        //     ),
        //     renderHeader: (params) => (
        //         <Box sx={{ fontWeight: '700' }}>
        //             {params.colDef.headerName}
        //             <IconSorting className="custom-icon" />{' '}
        //         </Box>
        //     )
        // },
        {
            field: 'txtTrangThaiHang',
            headerName: 'Trạng thái',

            minWidth: 130,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '1000px',
                        backgroundColor: '#F1FAFF',
                        color: params.row.trangThai === 0 ? '#b16827' : '#009EF7'
                    }}>
                    {params.value || ''}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,

            renderCell: (params) => (
                <ActionViewEditDelete
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ];

    return (
        <>
            <ModalNhomHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalNhomHang}
                handleSave={saveNhomHang}></ModalNhomHangHoa>
            <ModalHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalProduct}
                handleSave={saveProduct}></ModalHangHoa>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={deleteProduct}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ImportExcel
                isOpen={isShowImport}
                onClose={onImportShow}
                downloadImportTemplate={downloadImportTemplate}
                importFile={handleImportData}
            />
            <Grid
                container
                className="dich-vu-page"
                padding="24px 2.2222222222222223vw 24px 2.2222222222222223vw"
                gap={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography color="#333233" fontSize="16px" variant="h5" fontWeight="700">
                            Danh mục dịch vụ
                        </Typography>
                        <Box>
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#fff',
                                    '& input': {
                                        paddingLeft: '16px'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '0'
                                    }
                                }}
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton onClick={hanClickIconSearch}>
                                            <SeasrchIcon />
                                        </IconButton>
                                    )
                                }}
                                onChange={(event) =>
                                    setFilterPageProduct((itemOlds: any) => {
                                        return {
                                            ...itemOlds,
                                            textSearch: event.target.value
                                        };
                                    })
                                }
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Button
                            size="small"
                            onClick={onImportShow}
                            variant="outlined"
                            startIcon={<DownIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            className=" btn-container-hover"
                            sx={{
                                minWidth: '143px',

                                fontSize: '14px'
                            }}
                            startIcon={<Add />}
                            onClick={() => showModalAddProduct()}>
                            Thêm dịch vụ
                        </Button>
                    </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                    <Grid item lg={3} md={3} sm={4} xs={12}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%'
                            }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="16px 24px">
                                <Typography fontSize="18px" fontWeight="700">
                                    Nhóm dịch vụ
                                </Typography>
                                <Button
                                    sx={{ padding: '0', minWidth: 'unset' }}
                                    className="btn-container-hover">
                                    <Add
                                        sx={{
                                            color: '#fff',
                                            transition: '.4s',
                                            height: '30px',
                                            cursor: 'pointer',
                                            width: '30px',
                                            borderRadius: '4px',
                                            padding: '4px'
                                        }}
                                        onClick={() => showModalAddNhomHang()}
                                    />
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    overflow: 'auto',
                                    maxHeight: '66vh',
                                    padding: '0px 24px',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '8px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}>
                                <AccordionNhomHangHoa
                                    dataNhomHang={treeNhomHangHoa}
                                    clickTreeItem={editNhomHangHoa}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={9} md={9} sm={8} xs={12}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%',
                                position: 'relative'
                            }}>
                            <DataGrid
                                disableRowSelectionOnClick
                                autoHeight
                                rows={pageDataProduct.items}
                                columns={columns}
                                hideFooter
                                checkboxSelection
                                sx={{
                                    border: 'none!important',
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
                            {/* {selectedRow && <CustomRowDetails />} */}

                            <Grid
                                container
                                style={{
                                    display: pageDataProduct.totalCount > 0 ? 'flex' : 'none',
                                    paddingLeft: '16px',
                                    // position: 'absolute',
                                    bottom: '16px'
                                }}>
                                <Grid item xs={4} md={4} lg={4} sm={4}>
                                    <OptionPage
                                        changeNumberOfpage={changeNumberOfpage}
                                        totalRow={pageDataProduct.totalCount}
                                    />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8} sm={8}>
                                    <Stack direction="row" style={{ float: 'right' }}>
                                        <LabelDisplayedRows
                                            currentPage={filterPageProduct.currentPage}
                                            pageSize={filterPageProduct.pageSize}
                                            totalCount={pageDataProduct.totalCount}
                                        />
                                        <Pagination
                                            shape="rounded"
                                            // color="primary"
                                            count={pageDataProduct.totalPage}
                                            page={filterPageProduct.currentPage}
                                            defaultPage={filterPageProduct.currentPage}
                                            onChange={handleChangePage}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
