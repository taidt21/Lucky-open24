import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
    Divider,
    Table,
    Pagination,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    InputAdornment,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    colors
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// prop for send data from parent to child
import { PropModal, PropConfirmOKCancel } from '../../utils/PropParentToChild';

/* custom component */
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import MessageAlert from '../../components/AlertDialog/MessageAlert';
import TreeViewGroupProduct from '../../components/Treeview/ProductGroup';
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
import Utils from '../../utils/utils'; // func common
import {
    Add,
    DeleteOutline,
    FileDownload,
    FileUpload,
    Info,
    LocalOffer,
    Menu,
    ModeEditOutline,
    MoreHoriz,
    Search
} from '@mui/icons-material';

const themeListItemText = createTheme({
    components: {
        // Name of the component
        MuiListItemText: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // text in listitem
                    '& span': {
                        fontSize: '12px',
                        color: 'blue'
                    },
                    ':not(eq(2)': {
                        fontSize: '12px',
                        color: 'blue'
                    }
                }
            }
        }
    }
});

const themeInputSearch = createTheme({
    components: {
        // Name of the component
        MuiInputBase: {
            styleOverrides: {
                // Name of the slot
                root: {
                    '& input': {
                        paddingBottom: '7px',
                        paddingTop: '7px'
                    }
                }
            }
        }
    }
});

export function NhomHangHoas({ dataNhomHang }: any) {
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <>
            <List className="list-nhomhanghoa">
                {dataNhomHang.map((value: any) => (
                    <ListItem
                        key={value.id}
                        disableGutters
                        secondaryAction={
                            isHovering && (
                                <IconButton aria-label="comment">
                                    <Add />
                                </IconButton>
                            )
                        }>
                        <ListItemAvatar style={{ minWidth: '40px' }}>
                            <LocalOffer />
                        </ListItemAvatar>
                        <ListItemText primary={`${value.tenNhomHang}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export const ListAction = ({ showAction, handleClickAction }: any) => {
    return (
        <Box sx={{ display: showAction ? 'block' : 'none' }} className="list-icon-action">
            <List>
                <ListItem
                    onClick={(event) => handleClickAction(0)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="add">
                            <Info fontSize="small" />
                        </IconButton>
                    }>
                    <ListItemText primary="Xem" />
                </ListItem>
                <ListItem
                    onClick={(event) => handleClickAction(1)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="edit">
                            <ModeEditOutline className="icon" />
                        </IconButton>
                    }>
                    <ListItemText primary="Sửa" />
                </ListItem>
                <ListItem
                    onClick={(event) => handleClickAction(2)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <DeleteOutline className="icon" />
                        </IconButton>
                    }>
                    <ListItemText primary="Xóa" />
                </ListItem>
            </List>
        </Box>
    );
};

export const LabelDisplayedRows = ({ currentPage, pageSize, totalCount }: any) => {
    return (
        <>
            <Typography variant="body2" style={{ paddingTop: '6px' }}>
                Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
                {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} của{' '}
                {totalCount} bản ghi
            </Typography>
        </>
    );
};

export const OptionPage = ({ changeNumberOfpage }: any) => {
    const [value, setValue] = useState(Utils.pageOption[0].value);
    const [text, setText] = useState(Utils.pageOption[0].text);
    const handleChange = (event: any, item: any) => {
        setValue(event.target.value);
        setText(item.props.children);
        changeNumberOfpage(event.target.value);
    };
    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl variant="standard">
                    <Select value={value} onChange={handleChange}>
                        {Utils.pageOption.map((item: any, index: number) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item.text}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default function PageProduct() {
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalProduct, setTriggerModalProduct] = useState({
        showModal: false,
        isNew: false,
        idQuiDoi: ''
    });
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

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
        pageSize: Utils.pageOption[0].value,
        columnSort: '',
        typeSort: ''
    });

    /* state in row table */
    const [showAction, setShowAction] = useState({ index: 0, value: false });
    const [showListAction, setshowListAction] = useState(true);
    const [isHover, setIsHover] = useState(false);
    const [rowHover, setRowHover] = useState<ModelHangHoaDto>();
    /* end state in row table */

    const GetListHangHoa = async () => {
        const list = await ProductService.Get_DMHangHoa(filterPageProduct);
        setPageDataProduct({
            totalCount: list.totalCount,
            totalPage: Utils.getTotalPage(list.totalCount, filterPageProduct.pageSize),
            items: list.items
        });
    };

    const GetListNhomHangHoa = async () => {
        const list = await GroupProductService.GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: '#7C3367'
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
        setTriggerModalProduct({
            showModal: true,
            isNew: Utils.checkNull(id),
            idQuiDoi: id
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
        }
    };

    function saveNhomHang(objNew: ModelNhomHangHoa) {
        if (triggerModalNhomHang.isNew) {
            const newTree = [
                // Items before the insertion point:
                ...treeNhomHangHoa.slice(0, 1),
                // New item:
                objNew,
                // Items after the insertion point:
                ...treeNhomHangHoa.slice(1)
            ];
            setTreeNhomHangHoa(newTree);
            setObjAlert({ show: true, type: 1, mes: 'Thêm nhóm dịch vụ thành công' });
        } else {
            GetTreeNhomHangHoa();
            setObjAlert({ show: true, type: 1, mes: 'Cập nhật nhóm dịch vụ thành công' });
        }
        hiddenAlert();
    }

    function saveProduct(objNew: ModelHangHoaDto) {
        if (triggerModalProduct.isNew) {
            setPageDataProduct((olds) => {
                const copy = { ...olds };
                const newRow = { ...objNew };
                const dvChuan = objNew.donViQuiDois.filter((x) => x.laDonViTinhChuan === 1);
                newRow.idDonViQuyDoi = dvChuan[0].id;
                newRow.maHangHoa = dvChuan[0].maHangHoa;
                newRow.giaBan = dvChuan[0].giaBan;
                newRow.tenDonViTinh = dvChuan[0].tenDonViTinh;

                copy.items.unshift(newRow);
                copy.totalCount += 1;
                copy.totalPage = Utils.getTotalPage(copy.totalCount, filterPageProduct.pageSize);
                return copy;
            });
            setObjAlert({ show: true, type: 1, mes: 'Thêm dịch vụ thành công' });
        } else {
            GetListHangHoa();
            setObjAlert({ show: true, type: 1, mes: 'Sửa dịch vụ thành công' });
        }
        hiddenAlert();
    }

    const hiddenAlert = () => {
        setTimeout(() => {
            setObjAlert({ show: false, mes: '', type: 1 });
        }, 3000);
    };

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
            if (filterPageProduct.currentPage !== 1) {
                setFilterPageProduct({
                    ...filterPageProduct,
                    currentPage: 1
                });
            } else {
                GetListHangHoa();
            }
        }
    };

    const doActionRow = (action: number) => {
        if (action < 2) {
            showModalAddProduct(action, rowHover?.idDonViQuyDoi);
        } else {
            setInforDeleteProduct(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa dịch vụ  ${rowHover?.maHangHoa ?? ' '} không?`
                })
            );
        }
    };
    console.log('page');

    const deleteProduct = async () => {
        if (!Utils.checkNull(rowHover?.idDonViQuyDoi)) {
            await ProductService.DeleteProduct_byIDHangHoa(rowHover?.id ?? '');
            setObjAlert({ show: true, type: 1, mes: 'Xóa dịch vụ thành công' });
            hiddenAlert();
            setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        }
    };

    const hoverRow = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setShowAction({ index: index, value: true });
                break;
            case 'mouseleave': //leave
                setShowAction({ index: index, value: false });
                break;
        }
        setshowListAction(false);
        setRowHover(rowData);
        setIsHover(event.type === 'mouseenter');
    };

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

            <Grid container rowSpacing={1} style={{ paddingTop: '10px', paddingLeft: '10px' }}>
                <Grid item xs={12} sm={6} md={8} lg={4} sx={{ height: 60 }} rowSpacing={2}>
                    <Typography variant="h5">Danh mục dịch vụ</Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={8}
                    pr={2}
                    rowSpacing={2}
                    style={{ height: 60 }}>
                    <Box display="flex" justifyContent="flex-end">
                        <Box display="flex" justifyContent="flex-end" style={{ paddingTop: '7px' }}>
                            <ThemeProvider theme={themeInputSearch}>
                                <TextField
                                    size="small"
                                    sx={{ width: 7 / 10, paddingTop: '5px', paddingBottom: '5px' }}
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
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
                                    }}></TextField>
                            </ThemeProvider>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    marginRight: 8,
                                    borderColor: '#6c757d',
                                    color: '#343a40',
                                    height: 'unset'
                                }}
                                className="btnSecond"
                                startIcon={<FileUpload />}>
                                Nhập
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: '#6c757d',
                                    color: '#343a40',
                                    height: 'unset'
                                }}
                                color="error"
                                className="btnSecond"
                                startIcon={<FileDownload />}>
                                Xuất
                            </Button>
                        </Box>
                        <Box component="span" className="btn-only-icon" sx={{ mr: 1 }}>
                            <Menu />
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ bgcolor: '#7C3367' }}
                            startIcon={<Add />}
                            onClick={() => showModalAddProduct()}>
                            Thêm mới
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={0} sm={3} md={3} lg={3} xl={2}>
                    <Grid container>
                        <Grid item xs={8} sm={8} md={8} lg={8}>
                            <Typography variant="h6" color="#0C050A" fontSize="24px">
                                Nhóm dịch vụ
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            lg={4}
                            sx={{ pr: 2 }}
                            display="flex"
                            justifyContent="flex-end">
                            <Add onClick={() => showModalAddNhomHang()} />
                        </Grid>
                    </Grid>
                    <Divider sx={{ mr: 2, mf: 0, p: 0.5, borderColor: '#cccc' }} />
                    <TreeViewGroupProduct
                        dataNhomHang={treeNhomHangHoa}
                        clickTreeItem={editNhomHangHoa}
                    />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={10}>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            style={{
                                paddingLeft: '20px',
                                borderTopLeftRadius: '6px',
                                borderBottomLeftRadius: '6px'
                            }}
                            className="page-title-search">
                            <ThemeProvider theme={themeInputSearch}>
                                <TextField
                                    size="small"
                                    sx={{ width: 7 / 10, paddingTop: '5px', paddingBottom: '5px' }}
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
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
                                    }}></TextField>
                            </ThemeProvider>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            pr={2}
                            className="page-title-search">
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                style={{ paddingTop: '7px' }}>
                                <Button
                                    variant="outlined"
                                    style={{
                                        marginRight: 8,
                                        borderColor: '#6c757d',
                                        color: '#343a40'
                                    }}
                                    className="btnSecond"
                                    startIcon={<FileUpload />}>
                                    Nhập
                                </Button>
                                <Button
                                    variant="outlined"
                                    style={{
                                        borderColor: '#6c757d',
                                        color: '#343a40'
                                    }}
                                    color="error"
                                    className="btnSecond"
                                    startIcon={<FileDownload />}>
                                    Xuất
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead className="table-head">
                                        <TableRow>
                                            <TableCell sx={{ width: 1 / 25 }}>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell sx={{ width: 1 / 8 }}>Mã dịch vụ</TableCell>
                                            <TableCell>Tên dịch vụ</TableCell>
                                            <TableCell sx={{ width: 1 / 6 }}>
                                                Nhóm dịch vụ
                                            </TableCell>
                                            <TableCell sx={{ width: 1 / 12 }}>Đơn giá</TableCell>
                                            <TableCell sx={{ width: 1 / 10 }}>Thời gian</TableCell>
                                            <TableCell sx={{ width: 1 / 6 }}>Trạng thái</TableCell>
                                            <TableCell sx={{ width: 1 / 25 }}>#</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="table-body">
                                        {pageDataProduct.items.map((row: any, index: any) => (
                                            <TableRow
                                                // sx={{ backgroundColor: isHover ? 'red' : 'none' }}
                                                key={row.idDonViQuyDoi}
                                                onMouseLeave={(event) => {
                                                    hoverRow(event, row, index);
                                                }}
                                                onMouseEnter={(event) => {
                                                    hoverRow(event, row, index);
                                                }}
                                                sx={{
                                                    backgroundColor:
                                                        isHover &&
                                                        rowHover?.idDonViQuyDoi == row.idDonViQuyDoi
                                                            ? '#cccc'
                                                            : 'none',
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }
                                                }}>
                                                <TableCell sx={{ width: 1 / 25 }}>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell sx={{ width: 1 / 10 }}>
                                                    {row.maHangHoa}
                                                </TableCell>
                                                <TableCell align="left">{row.tenHangHoa}</TableCell>
                                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                                    {row.tenNhomHang}
                                                </TableCell>
                                                <TableCell sx={{ width: 1 / 12 }} align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        row.giaBan
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ width: 1 / 10 }} align="center">
                                                    {row.soPhutThucHien}
                                                </TableCell>
                                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                                    {row.txtTrangThaiHang}
                                                </TableCell>
                                                <TableCell sx={{ width: 1 / 25 }}>
                                                    <MoreHoriz
                                                        fontSize="small"
                                                        onClick={() => {
                                                            setshowListAction(true);
                                                            // setIdQuyDoi(row.idDonViQuyDoi);
                                                        }}
                                                        sx={{
                                                            display:
                                                                showAction.index == index &&
                                                                showAction.value
                                                                    ? 'block'
                                                                    : 'none'
                                                        }}
                                                    />
                                                    <ListAction
                                                        showAction={
                                                            showAction.index == index &&
                                                            showAction.value &&
                                                            showListAction
                                                        }
                                                        handleClickAction={doActionRow}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={2}
                            sx={{ paddingTop: 2 }}
                            style={{
                                display: pageDataProduct.totalCount > 1 ? 'flex' : 'none'
                            }}>
                            <Grid item xs={4} md={4} lg={4} sm={4}>
                                <OptionPage
                                    changeNumberOfpage={changeNumberOfpage}
                                    totalRow={pageDataProduct.totalCount}
                                />
                            </Grid>
                            <Grid item xs={8} md={8} lg={8} sm={8} style={{ paddingRight: '16px' }}>
                                <Stack direction="row" spacing={2} style={{ float: 'right' }}>
                                    <LabelDisplayedRows
                                        currentPage={filterPageProduct.currentPage}
                                        pageSize={filterPageProduct.pageSize}
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

                        <Grid
                            container
                            className="text-center"
                            sx={{ display: pageDataProduct.totalCount == 0 ? 'block' : 'none' }}>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    bgcolor: '#FAEBD7',
                                    height: 35,
                                    justifyItems: 'center',
                                    alignItems: 'center',
                                    paddingTop: 1 / 2
                                }}
                                style={{ fontStyle: 'Italic' }}>
                                Không có dữ liệu
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <MessageAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                hiddenAlert={() => setObjAlert({ ...objAlert, show: false })}></MessageAlert>
        </>
    );
}
