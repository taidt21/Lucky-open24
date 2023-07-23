import * as React from 'react';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
    Button,
    Box,
    TextField,
    Autocomplete,
    Link,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';

import ProductService from '../../services/product/ProductService';
import './style.css';

import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';

export function ModalHangHoa({ dataNhomHang, handleSave, trigger }: any) {
    const [open, setOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [product, setProduct] = useState(new ModelHangHoaDto());
    const [wasClickSave, setWasClickSave] = useState(false);
    const [actionProduct, setActionProduct] = useState(1);

    const [errTenHangHoa, setErrTenHangHoa] = useState(false);
    const [errMaHangHoa, setErrMaHangHoa] = useState(false);

    const [nhomChosed, setNhomChosed] = useState<ModelNhomHangHoa | null>(null);
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const showModal = async (id: string) => {
        if (id) {
            const obj = await ProductService.GetDetailProduct(id);
            setProduct(obj);

            setProduct((old: any) => {
                return {
                    ...old,
                    laHangHoa: old.idLoaiHangHoa === 1
                };
            });

            // find nhomhang
            const nhom = dataNhomHang.filter((x: any) => x.id == obj.idNhomHangHoa);
            if (nhom.length > 0) {
                setNhomChosed(nhom[0]);
            } else {
                setNhomChosed(null);
            }
        } else {
            setProduct(new ModelHangHoaDto());

            if (trigger.item.idNhomHangHoa !== undefined) {
                const nhom = dataNhomHang.filter((x: any) => x.id == trigger.item.idNhomHangHoa);
                if (nhom.length > 0) {
                    setNhomChosed(nhom[0]);
                    setProduct((old: any) => {
                        return {
                            ...old,
                            idNhomHangHoa: nhom[0].id,
                            tenNhomHang: nhom[0].tenNhomHang
                        };
                    });
                } else {
                    setNhomChosed(null);
                }
            } else {
                setNhomChosed(null);
            }
        }
    };

    useEffect(() => {
        if (trigger.isShow) {
            setOpen(true);
            showModal(trigger.id);
        }
        setIsNew(trigger.isNew);
        setWasClickSave(false);
        setErrMaHangHoa(false);
        setErrTenHangHoa(false);
    }, [trigger]);

    const editGiaBan = (event: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                giaBan: event.target.value
            };
        });
    };
    const handleChangeNhom = (item: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                idNhomHangHoa: item?.id ?? null,
                tenNhomHang: item?.tenNhomHang,
                laHangHoa: item?.laNhomHangHoa ?? false,
                idLoaiHangHoa: item?.laNhomHangHoa ? 1 : 2,
                tenLoaiHangHoa: item?.laNhomHangHoa ? 'hàng hóa' : 'dịch vụ'
            };
        });

        if (item == null) setNhomChosed(null);
        else
            setNhomChosed(
                new ModelNhomHangHoa({ id: item?.id ?? null, tenNhomHang: item?.tenNhomHang })
            );
        setWasClickSave(false);
    };

    const handleClickOKComfirm = () => {
        setOpen(false);
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        handleSave(product, actionProduct);
    };

    const CheckSave = async () => {
        if (utils.checkNull(product.tenHangHoa ?? '')) {
            setErrTenHangHoa(true);
            return false;
        }
        if (!utils.checkNull(product.maHangHoa ?? '')) {
            const exists = await ProductService.CheckExistsMaHangHoa(
                product.maHangHoa ?? '',
                product.idDonViQuyDoi ?? Guid.EMPTY
            );
            if (exists) {
                setErrMaHangHoa(true);
                return false;
            }
        }
        return true;
    };

    async function saveProduct() {
        setWasClickSave(true);

        if (wasClickSave) {
            return;
        }
        const check = await CheckSave();
        if (!check) {
            return;
        }
        const objNew = { ...product };
        objNew.giaBan = utils.formatNumberToFloat(product.giaBan);
        objNew.tenHangHoa_KhongDau = utils.strToEnglish(objNew.tenHangHoa ?? '');
        objNew.tenLoaiHangHoa = objNew.idLoaiHangHoa == 1 ? 'Hàng hóa' : 'Dịch vụ';
        objNew.txtTrangThaiHang = objNew.trangThai == 1 ? 'Đang kinh doanh' : 'Ngừng kinh doanh';

        objNew.donViQuiDois = [
            {
                id: objNew.idDonViQuyDoi,
                maHangHoa: objNew.maHangHoa,
                tenDonViTinh: '',
                tyLeChuyenDoi: objNew.tyLeChuyenDoi,
                giaBan: objNew.giaBan,
                laDonViTinhChuan: objNew.laDonViTinhChuan
            }
        ];

        const data = await ProductService.CreateOrEditProduct(objNew);
        objNew.id = data.id;
        objNew.idHangHoa = data.id;
        objNew.donViQuiDois = [...data.donViQuiDois];
        objNew.maHangHoa = data.donViQuiDois.filter(
            (x: any) => x.laDonViTinhChuan === 1
        )[0]?.maHangHoa;
        objNew.idDonViQuyDoi = data.donViQuiDois.filter(
            (x: any) => x.laDonViTinhChuan === 1
        )[0]?.id;
        handleSave(objNew, isNew ? 1 : 2);
        setOpen(false);
    }
    return (
        <>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={handleClickOKComfirm}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <Button
                    onClick={() => setOpen(false)}
                    sx={{
                        minWidth: 'unset',
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                        }
                    }}>
                    <CloseIcon />
                </Button>
                <DialogTitle fontSize="24px!important" color="#333233" fontWeight="700!important">
                    {' '}
                    {isNew ? 'Thêm ' : 'Cập nhật '}
                    {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={8} sm={8} lg={8}>
                            <Box sx={{ height: 50 }} style={{ display: 'none' }}>
                                <Typography>Thông tin chi tiết</Typography>
                            </Box>
                            <Grid item sx={{ pb: 2 }} style={{ display: 'none' }}>
                                <span className="modal-lable">
                                    Mã {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                </span>

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    placeholder="Mã tự động"
                                    value={product.maHangHoa}
                                    error={errMaHangHoa && wasClickSave}
                                    helperText={
                                        errMaHangHoa && wasClickSave
                                            ? `Mã ${product.tenLoaiHangHoa?.toLocaleLowerCase()} đã tồn tại`
                                            : ''
                                    }
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                maHangHoa: event.target.value
                                            };
                                        });
                                        setWasClickSave(false);
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ pb: 2 }}>
                                <span className="modal-lable">
                                    Tên {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                </span>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    required
                                    error={wasClickSave && errTenHangHoa}
                                    helperText={
                                        wasClickSave && errTenHangHoa
                                            ? `Vui lòng nhập tên ${product.tenLoaiHangHoa?.toLocaleLowerCase()}`
                                            : ''
                                    }
                                    value={product.tenHangHoa}
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return { ...itemOlds, tenHangHoa: event.target.value };
                                        });
                                        setErrTenHangHoa(false);
                                        setWasClickSave(false);
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ pb: 2 }}>
                                <span className="modal-lable">
                                    Nhóm {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                </span>

                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    disablePortal
                                    value={nhomChosed}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    options={dataNhomHang.filter(
                                        (x: any) => x.id !== null && x.id !== ''
                                    )}
                                    onChange={(event, newValue) => handleChangeNhom(newValue)}
                                    getOptionLabel={(option: any) =>
                                        option.tenNhomHang ? option.tenNhomHang : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Chọn nhóm" />
                                    )}
                                />
                            </Grid>
                            <Grid container sx={{ pb: 2 }} spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <span className="modal-lable">Giá bán</span>
                                    <NumericFormat
                                        size="small"
                                        fullWidth
                                        value={product.giaBan}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        customInput={TextField}
                                        onChange={(event) => editGiaBan(event)}
                                    />
                                </Grid>
                                {/* <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    pt={{ xs: 2, md: 0, lg: 0, sm: 0 }}>
                                    <span className="modal-lable">Số phút</span>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        placeholder="0"
                                        type="number"
                                        value={product.soPhutThucHien}
                                        onChange={(event) =>
                                            setProduct((itemOlds) => {
                                                return {
                                                    ...itemOlds,
                                                    soPhutThucHien: event.target.value
                                                };
                                            })
                                        }
                                    />
                                </Grid> */}
                            </Grid>

                            <Grid item sx={{ pb: 2 }}>
                                <span className="modal-lable">Ghi chú</span>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows="2"
                                    value={product.moTa}
                                    onChange={(event) =>
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                moTa: event.target.value
                                            };
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item style={{ display: 'none' }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={product.laHangHoa}
                                                onChange={(event) => {
                                                    setProduct((olds: any) => {
                                                        return {
                                                            ...olds,
                                                            laHangHoa: event.target.checked,
                                                            idLoaiHangHoa: event.target.checked
                                                                ? 2
                                                                : 1,
                                                            tenLoaiHangHoa: event.target.checked
                                                                ? 'hàng hóa'
                                                                : 'dịch vụ'
                                                        };
                                                    });
                                                }}
                                                sx={{
                                                    color: '#7C3367',
                                                    '&.Mui-checked': {
                                                        color: '#7C3367'
                                                    }
                                                }}
                                            />
                                        }
                                        label="Là hàng hóa"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4} lg={4}>
                            <Box
                                display="grid"
                                ml={{ xs: 0, sm: 4, md: 4, lg: 4 }}
                                sx={{ border: '2px dashed #cccc', p: 5 }}
                                className="text-center">
                                <Box>
                                    <InsertDriveFileIcon className="icon-size" />
                                </Box>
                                <Box sx={{ pt: 2 }}>
                                    <CloudDoneIcon
                                        style={{ paddingRight: '5px', color: 'var(--color-main)' }}
                                    />
                                    <Link href="#" underline="always">
                                        Tải ảnh lên
                                    </Link>
                                </Box>
                                <Typography variant="caption">File định dạng jpeg, png</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#633434',
                            display: !isNew && product.trangThai === 0 ? '' : 'none'
                        }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title:
                                        'Khôi phục ' + product?.tenLoaiHangHoa?.toLocaleLowerCase(),
                                    mes: `Bạn có chắc chắn muốn khôi phục ${product?.tenLoaiHangHoa?.toLocaleLowerCase()} ${
                                        product.tenHangHoa
                                    }   không?`
                                })
                            );
                            setActionProduct(4);
                        }}>
                        Khôi phục
                    </Button>
                    {!(product.trangThai === 0 || isNew) && (
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: 'red'
                            }}
                            onClick={() => {
                                setInforDeleteProduct(
                                    new PropConfirmOKCancel({
                                        show: true,
                                        title: 'Xác nhận xóa',
                                        mes: `Bạn có chắc chắn muốn xóa ${product.tenHangHoa}  ${
                                            product?.tenLoaiHangHoa ?? ' '
                                        } không?`
                                    })
                                );
                                setActionProduct(3);
                            }}>
                            Xóa
                        </Button>
                    )}

                    {product.trangThai !== 0 && (
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#7C3367' }}
                            onClick={saveProduct}
                            className="btn-container-hover">
                            Lưu
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        sx={{ color: 'var(--color-main)' }}
                        onClick={() => setOpen(false)}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
