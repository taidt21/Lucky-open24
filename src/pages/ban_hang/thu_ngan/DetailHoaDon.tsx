import {
    Box,
    Radio,
    Button,
    TextField,
    Typography,
    IconButton,
    ButtonGroup,
    Grid,
    RadioGroup,
    FormControlLabel,
    Input
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import React, { useContext, useEffect, useState } from 'react';
import { util } from 'prettier';
import utils from '../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import AppConsts, { ISelect } from '../../../lib/appconst';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import { Guid } from 'guid-typescript';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { format } from 'date-fns';
interface Detail {
    toggleDetail: () => void;
}
const DetailHoaDon = ({
    toggleDetail,
    tongTienHang,
    hinhThucTT = 1,
    onChangeQuyChiTiet,
    onChangeHoaDon,
    onClickThanhToan,
    formType = 1,
    dataHoaDonAfterSave
}: any) => {
    const arrHinhThucThanhToan = [...AppConsts.hinhThucThanhToan, { value: 0, text: 'Kết hợp' }];
    const [idHinhThucTT, setIdHinhThucTT] = React.useState(hinhThucTT);
    const chinhanhCurrent = useContext(ChiNhanhContext);
    const idChiNhanh = chinhanhCurrent.id;
    const noHDCu = utils.RoundDecimal(dataHoaDonAfterSave?.conNo ?? 0);

    const [tongGiamGiaHD, setTongGiamGiaHD] = useState(0);
    const [ptGiamGiaHD, setPTGiamGiaHD] = useState(0);
    const [laPTGiamGia, setlaPTGiamGia] = useState(true);
    const [ghichuHD, setGhichuHD] = useState('');
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const [tienKhachTraMax, setTienKhachTraMax] = useState(0);
    const [lstQuyCT, setLstQuyCT] = useState<QuyChiTietDto[]>([
        new QuyChiTietDto({
            hinhThucThanhToan: hinhThucTT,
            tienThu: formType === 1 ? tongTienHang : noHDCu
        })
    ]);

    // change at parent- -> update to child
    useEffect(() => {
        setIdHinhThucTT(hinhThucTT);
        const itemHT = AppConsts.hinhThucThanhToan.filter((x: ISelect) => x.value === hinhThucTT);
        if (itemHT.length > 0) {
            choseHinhThucThanhToan(itemHT[0]);
        }
    }, [hinhThucTT]);

    useEffect(() => {
        setLstQuyCT(
            lstQuyCT.map((item: QuyChiTietDto) => {
                if (item.hinhThucThanhToan === hinhThucTT) {
                    return {
                        ...item,
                        tienThu: formType === 1 ? tongTienHang : noHDCu
                    };
                } else {
                    return { ...item };
                }
            })
        );
        setTienKhachTraMax(formType === 1 ? tongTienHang : noHDCu);
        setSumTienKhachTra(formType === 1 ? tongTienHang : noHDCu);
        setTienThuaTraKhach(0);
    }, [tongTienHang]);

    const khachPhaiTra = formType === 1 ? tongTienHang - tongGiamGiaHD : noHDCu;

    const onClickPTramVND = (newVal: boolean) => {
        let gtriPT = 0;
        if (!laPTGiamGia) {
            if (newVal && tongTienHang > 0) {
                gtriPT = (tongGiamGiaHD / tongTienHang) * 100;
                setPTGiamGiaHD(gtriPT);
            }
        }
        setlaPTGiamGia(newVal);
    };

    const onChangeGtriGiamGia = (gtri: string) => {
        let gtriNew = utils.formatNumberToFloat(gtri);
        if (gtriNew > tongTienHang) {
            gtriNew = tongTienHang;
        }
        let gtriVND = 0;
        if (tongTienHang > 0) {
            if (laPTGiamGia) {
                gtriVND = (gtriNew * tongTienHang) / 100;
                setPTGiamGiaHD(gtriNew);
            } else {
                gtriVND = gtriNew;
            }
        }
        setTongGiamGiaHD(gtriVND);
    };

    const gtriXX = laPTGiamGia ? ptGiamGiaHD : tongGiamGiaHD;

    const onChangeTienKhachTra = (gtri: string, loai: number) => {
        const gtriNhapNew = utils.formatNumberToFloat(gtri);
        if (hinhThucTT === 0) {
            // tinh lai  tien
            switch (loai) {
                case 1: // tinhtien chuyenkhoan
                    {
                        const conLai = tienKhachTraMax - gtriNhapNew;
                        setLstQuyCT(
                            lstQuyCT.map((item: QuyChiTietDto) => {
                                if (item.hinhThucThanhToan === 1) {
                                    return { ...item, tienThu: gtriNhapNew };
                                } else {
                                    if (item.hinhThucThanhToan === 2) {
                                        return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                    } else {
                                        return { ...item, tienThu: 0 };
                                    }
                                }
                            })
                        );
                    }
                    break;
                case 2: // tinhtien pos
                    {
                        const sumTienMat = lstQuyCT
                            .filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 1)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        const conLai = tienKhachTraMax - sumTienMat - gtriNhapNew;

                        setLstQuyCT(
                            lstQuyCT.map((item: QuyChiTietDto) => {
                                if (item.hinhThucThanhToan === 1) {
                                    return { ...item };
                                } else {
                                    if (item.hinhThucThanhToan === 2) {
                                        return { ...item, tienThu: gtriNhapNew };
                                    } else {
                                        return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                    }
                                }
                            })
                        );
                    }
                    break;
                case 3:
                    {
                        const sumMatCK = lstQuyCT
                            .filter((x: QuyChiTietDto) => x.hinhThucThanhToan !== 3)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        setSumTienKhachTra(sumMatCK + gtriNhapNew);
                    }
                    break;
            }
            setTienThuaTraKhach(0);
        } else {
            setLstQuyCT(
                lstQuyCT.map((item: QuyChiTietDto) => {
                    if (item.hinhThucThanhToan === loai) {
                        return { ...item, tienThu: gtriNhapNew };
                    } else {
                        return { ...item };
                    }
                })
            );
            setSumTienKhachTra(gtriNhapNew);
            setTienThuaTraKhach(gtriNhapNew - khachPhaiTra);
        }
    };

    const choseHinhThucThanhToan = (item: ISelect) => {
        setIdHinhThucTT(item.value);
        if (item.value !== 0) {
            setLstQuyCT(() => [
                new QuyChiTietDto({
                    tienThu: khachPhaiTra,
                    hinhThucThanhToan: item.value
                })
            ]);
        } else {
            setLstQuyCT(() => [
                new QuyChiTietDto({
                    tienThu: khachPhaiTra,
                    hinhThucThanhToan: 1
                }),
                new QuyChiTietDto({
                    tienThu: 0,
                    hinhThucThanhToan: 2
                }),
                new QuyChiTietDto({
                    tienThu: 0,
                    hinhThucThanhToan: 3
                })
            ]);
        }
    };

    // change at child --> update to parent
    useEffect(() => {
        if (formType === 1) onChangeQuyChiTiet(lstQuyCT);
    }, [lstQuyCT]);

    useEffect(() => {
        if (formType === 1) {
            onChangeHoaDon(ptGiamGiaHD, tongGiamGiaHD, khachPhaiTra, ghichuHD);
            setTienKhachTraMax(khachPhaiTra);
            setSumTienKhachTra(khachPhaiTra);

            setLstQuyCT(
                lstQuyCT.map((item: QuyChiTietDto) => {
                    if (item.hinhThucThanhToan === hinhThucTT) {
                        return { ...item, tienThu: khachPhaiTra };
                    } else {
                        return { ...item };
                    }
                })
            );
        }
    }, [ptGiamGiaHD, tongGiamGiaHD, ghichuHD]);

    const clickThanhToan = async () => {
        let tongThuThucTe = sumTienKhachTra;
        if (formType !== 1) {
            tongThuThucTe = await savePhieuThu();
        }
        onClickThanhToan(tongThuThucTe);
    };

    const savePhieuThu = async () => {
        const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet(lstQuyCT, sumTienKhachTra, noHDCu);

        // save soquy (Mat, POS, ChuyenKhoan)
        const tongThu = lstQCT_After.reduce((currentValue: number, item: any) => {
            return currentValue + item.tienThu;
        }, 0);
        const quyHD: QuyHoaDonDto = new QuyHoaDonDto({
            idChiNhanh: utils.checkNull(dataHoaDonAfterSave.idChiNhanh)
                ? idChiNhanh
                : dataHoaDonAfterSave?.idChiNhanh,
            idLoaiChungTu: 11,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            tongTienThu: tongThu,
            noiDungThu: ghichuHD
        });
        // assign idHoadonLienQuan, idKhachHang for quyCT
        lstQCT_After.map((x: QuyChiTietDto) => {
            x.idHoaDonLienQuan = dataHoaDonAfterSave?.id;
            x.idKhachHang =
                dataHoaDonAfterSave.idKhachHang == Guid.EMPTY
                    ? null
                    : dataHoaDonAfterSave?.idKhachHang;
        });
        quyHD.quyHoaDon_ChiTiet = lstQCT_After;
        await SoQuyServices.CreateQuyHoaDon(quyHD); // todo hoahong NV hoadon
        return tongThu;
    };
    // useEffect(() => {
    //     document.documentElement.style.overflowY = 'hidden';
    //     return () => {
    //         document.documentElement.style.overflowY = 'unset';
    //     };
    // }, []);
    return (
        <>
            <Box
                sx={{
                    padding: '24px',

                    boxShadow: '1px 5px 22px 4px #00000026',
                    width: '90%',
                    height: '100%',
                    marginX: 'auto',

                    borderRadius: '12px',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-15px',
                        pointerEvents: 'none',
                        height: '40px',
                        left: '0',
                        width: '100%',
                        bgcolor: '#fff'
                    }
                }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h3" color="#29303D" fontSize="24px" fontWeight="700">
                        {formType === 1 ? 'Chi tiết hóa đơn' : 'Thông tin thanh toán'}
                    </Typography>
                    <IconButton
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={toggleDetail}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: formType == 1 ? 'flex' : 'none',
                        justifyContent: 'space-between'
                    }}>
                    {' '}
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Tổng tiền hàng
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="14px">
                        {new Intl.NumberFormat('vi-VN').format(tongTienHang)}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: formType == 1 ? 'flex' : 'none',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Giảm giá
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'stretch',
                            gap: '16px'
                        }}>
                        <NumericFormat
                            size="medium"
                            fullWidth
                            value={gtriXX}
                            decimalSeparator=","
                            thousandSeparator="."
                            isAllowed={(values) => {
                                const floatValue = values.floatValue;
                                if (laPTGiamGia) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                if (!laPTGiamGia) return (floatValue ?? 0) <= tongTienHang;
                                return true;
                            }}
                            sx={{
                                '& input': {
                                    paddingY: '13.5px'
                                }
                            }}
                            customInput={TextField}
                            onChange={(event: any) => onChangeGtriGiamGia(event.target.value)}
                        />
                        <ButtonGroup
                            sx={{
                                '& button': {
                                    transition: '.3s'
                                }
                            }}>
                            <Button
                                onClick={() => onClickPTramVND(true)}
                                sx={{
                                    bgcolor: laPTGiamGia ? '#fff' : 'rgba(61, 71, 92, 0.1)',
                                    borderRight: '0!important',
                                    color: laPTGiamGia ? '#3D475C' : 'rgba(194, 201, 214, 0.7)'
                                }}>
                                %
                            </Button>
                            <Button
                                onClick={() => onClickPTramVND(false)}
                                sx={{
                                    color: !laPTGiamGia ? '#3D475C' : 'rgba(194, 201, 214, 0.7)',
                                    borderLeft: '0!important',
                                    bgcolor: !laPTGiamGia ? '#fff' : 'rgba(61, 71, 92, 0.1)'
                                }}>
                                đ
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="16px">
                        {formType == 1 ? 'Thanh toán' : 'Còn nợ'}
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="16px">
                        {new Intl.NumberFormat('vi-VN').format(khachPhaiTra)}
                    </Typography>
                </Box>
                <Grid container justifyContent="space-between" alignItems="center" rowGap="16px">
                    <Grid item xs="auto">
                        <Typography
                            variant="body1"
                            color="#3D475C"
                            fontWeight="700"
                            fontSize="14px">
                            Tiền khách trả
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <RadioGroup
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                '& label:last-of-type': {
                                    marginRight: '0'
                                }
                            }}>
                            {arrHinhThucThanhToan.map((item, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Radio
                                            size="small"
                                            value={item.value}
                                            checked={idHinhThucTT === item.value}
                                            onChange={() => {
                                                choseHinhThucThanhToan(item);
                                            }}
                                        />
                                    }
                                    label={item.text}
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            color: 'rgba(0, 0, 0, 0.85)',
                                            fontSize: '14px'
                                        }
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12}>
                        {hinhThucTT !== 0 && (
                            <NumericFormat
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        paddingY: '13.5px',
                                        textAlign: 'right'
                                    }
                                }}
                                decimalSeparator=","
                                thousandSeparator="."
                                customInput={TextField}
                                value={sumTienKhachTra}
                                onChange={(event) =>
                                    onChangeTienKhachTra(event.target.value, idHinhThucTT)
                                }
                            />
                        )}
                        {hinhThucTT === 0 && (
                            <NumericFormat
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        paddingY: '13.5px',
                                        textAlign: 'right'
                                    }
                                }}
                                decimalSeparator=","
                                thousandSeparator="."
                                customInput={TextField}
                                value={tienKhachTraMax}
                                onChange={(event) =>
                                    setTienKhachTraMax(
                                        utils.formatNumberToFloat(event.target.value)
                                    )
                                }
                            />
                        )}
                    </Grid>
                    {idHinhThucTT === 0 ? (
                        <Grid container spacing="16px">
                            {lstQuyCT.map((item, index) => (
                                <Grid item xs={4} key={index}>
                                    <Box
                                        sx={{
                                            border: '1px solid #C2C9D6',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            padding: '8px 16px',
                                            '& input': {
                                                border: '0',
                                                width: '100%',
                                                textAlign: 'right',
                                                color: '#525F7A',
                                                fontSizze: '16px',
                                                outline: 'none'
                                            },
                                            '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button':
                                                {
                                                    WebkitAppearance: 'none',
                                                    margin: '0'
                                                }
                                        }}>
                                        <Typography variant="body1" color="#525F7A" fontSize="12px">
                                            {
                                                AppConsts.hinhThucThanhToan.filter(
                                                    (x: ISelect) =>
                                                        x.value === item.hinhThucThanhToan
                                                )[0].text
                                            }
                                        </Typography>

                                        <NumericFormat
                                            size="small"
                                            fullWidth
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            customInput={Input}
                                            sx={{
                                                '&:before': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                            value={item.tienThu}
                                            onChange={(event) =>
                                                onChangeTienKhachTra(
                                                    event.target.value,
                                                    item.hinhThucThanhToan
                                                )
                                            }
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : undefined}
                    {tienThuaTraKhach !== 0 && (
                        <Grid container justifyContent="space-between">
                            <Grid item xs="auto">
                                <Typography
                                    variant="body1"
                                    color="#3D475C"
                                    fontWeight="400"
                                    fontSize="14px">
                                    {tienThuaTraKhach > 0 ? 'Tiền thừa' : 'Tiên khách thiếu'}
                                </Typography>
                            </Grid>
                            <Grid xs="auto" item>
                                <Typography
                                    variant="body1"
                                    color="#29303D"
                                    fontWeight="700"
                                    fontSize="14px">
                                    {new Intl.NumberFormat('vi-VN').format(
                                        Math.abs(tienThuaTraKhach)
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Box
                    sx={{
                        wiidth: '100%',
                        '& textarea': {
                            height: '80px',
                            width: '100%',
                            borderRadius: '8px',
                            borderColor: '#C2C9D6',
                            outline: 'none',
                            color: '#A3ADC2',
                            padding: '8px'
                        }
                    }}>
                    <Typography fontSize="14px" color="#525F7A">
                        Ghi chú
                    </Typography>
                    <textarea
                        value={ghichuHD}
                        onChange={(e) => setGhichuHD(e.target.value)}></textarea>
                </Box>
                <Button
                    variant="contained"
                    className="btn-container-hover"
                    sx={{
                        width: '158px',
                        marginX: 'auto',
                        mt: 'auto',
                        mb: '5px',
                        paddingY: '14px',
                        fontSize: '16px'
                    }}
                    onClick={clickThanhToan}>
                    Thanh toán
                </Button>
            </Box>
        </>
    );
};
export default DetailHoaDon;
