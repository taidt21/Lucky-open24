import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, IconButton, TextField } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../../images/arrow_back.svg';
import { ReactComponent as TienMat } from '../../../images/tien-mat.svg';
import { ReactComponent as NganHang } from '../../../images/ngan-hang.svg';
import { ReactComponent as ChuyenKhoan } from '../../../images/chuyen-khoan.svg';
import { ReactComponent as IconTitleTienmat } from '../../../images/wallet-3.svg';
import { ReactComponent as IconNganhang } from '../../../images/iconNganHang.svg';
import Card1 from '../../../images/card1.svg';
import Card2 from '../../../images/card2.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as TickIcon } from '../../../images/checkIcon.svg';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import { Guid } from 'guid-typescript';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
interface ChildComponent {
    handleClickPrev: () => void;
    tongPhaiTra?: number;
    passToParent: (quyCT: QuyChiTietDto[]) => void;
}
const Payments: React.FC<ChildComponent> = ({ handleClickPrev, tongPhaiTra = 0, passToParent }) => {
    const tientip = ['5%', '10%', '15%', 'Tùy chỉnh'];

    const [bankAccount, setBankAccount] = useState<TaiKhoanNganHangDto[]>([]);

    const hinhThucThanhToan = [
        {
            id: 1,
            icon: TienMat,
            text: 'Tiền mặt',
            selected: false
        },
        {
            id: 2,
            icon: NganHang,
            text: 'Chuyển khoản',
            selected: false
        },
        {
            id: 3,
            icon: ChuyenKhoan,
            text: 'Quẹt thẻ',
            selected: false
        }
    ];

    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        console.log('GetAllTaiKhoanNganHang ', data);
        setBankAccount(data);
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, []);

    const [hinhthucThanhToanChosed, setHinhthucThanhToanChosed] = useState<QuyChiTietDto[]>([]);
    const choseHinhThucThanhToan = (id: number) => {
        // const itemEx = hinhthucThanhToanChosed?.filter(
        //     (x: QuyChiTietDto) => x.hinhThucThanhToan === id
        // );
        const newQCT = new QuyChiTietDto({
            hinhThucThanhToan: id,
            tienThu: hinhthucThanhToanChosed.length === 0 ? tongPhaiTra : 0
        });
        // if (itemEx.length === 0) {
        //     setHinhthucThanhToanChosed(() => [...hinhthucThanhToanChosed, newQCT]);
        // }
        setHinhthucThanhToanChosed(() => [newQCT]);
    };

    const removeHinhThucThanhToan = (id: number) => {
        setHinhthucThanhToanChosed(() =>
            hinhthucThanhToanChosed.filter((x: QuyChiTietDto) => x.hinhThucThanhToan !== id)
        );
    };

    const indexChosed = hinhthucThanhToanChosed.map((item: QuyChiTietDto) => {
        return item.hinhThucThanhToan;
    });

    const changeTienKhachTra = (gtri: string, loaiHinhThuc: number) => {
        setHinhthucThanhToanChosed(
            hinhthucThanhToanChosed.map((item: QuyChiTietDto) => {
                if (item.hinhThucThanhToan === loaiHinhThuc) {
                    return { ...item, tienThu: utils.formatNumberToFloat(gtri) };
                } else {
                    return item;
                }
            })
        );
    };

    const sumTienKhachTra = hinhthucThanhToanChosed.reduce(
        (currentValue: number, item: QuyChiTietDto) => {
            return item.tienThu + currentValue;
        },
        0
    );

    const tienThuaTraKhach = sumTienKhachTra - tongPhaiTra;

    useEffect(() => {
        const qctReturn = assignAgainQuyChiTiet();
        passToParent(qctReturn);
    }, [hinhthucThanhToanChosed]);

    const shareMoney_QuyHD = (
        phaiTT: number,
        tienDiem: number,
        tienmat: number,
        tienPOS: number,
        chuyenkhoan: number,
        thegiatri: number,
        tiencoc: number
    ) => {
        // thutu uutien: 1.coc, 2.diem, 3.thegiatri, 4.mat, 5.pos, 6.chuyenkhoan
        if (tiencoc >= phaiTT) {
            return {
                TienCoc: phaiTT,
                TTBangDiem: 0,
                TienMat: 0,
                TienPOS: 0,
                TienChuyenKhoan: 0,
                TienTheGiaTri: 0
            };
        } else {
            phaiTT = phaiTT - tiencoc;
            if (tienDiem >= phaiTT) {
                return {
                    TienCoc: tiencoc,
                    TTBangDiem: phaiTT,
                    TienMat: 0,
                    TienPOS: 0,
                    TienChuyenKhoan: 0,
                    TienTheGiaTri: 0
                };
            } else {
                phaiTT = phaiTT - tienDiem;
                if (thegiatri >= phaiTT) {
                    return {
                        TienCoc: tiencoc,
                        TTBangDiem: tienDiem,
                        TienMat: 0,
                        TienPOS: 0,
                        TienChuyenKhoan: 0,
                        TienTheGiaTri: Math.abs(phaiTT)
                    };
                } else {
                    phaiTT = phaiTT - thegiatri;
                    if (tienmat >= phaiTT) {
                        return {
                            TienCoc: tiencoc,
                            TTBangDiem: tienDiem,
                            TienMat: Math.abs(phaiTT),
                            TienPOS: 0,
                            TienChuyenKhoan: 0,
                            TienTheGiaTri: thegiatri
                        };
                    } else {
                        phaiTT = phaiTT - tienmat;
                        if (tienPOS >= phaiTT) {
                            return {
                                TienCoc: tiencoc,
                                TTBangDiem: tienDiem,
                                TienMat: tienmat,
                                TienPOS: Math.abs(phaiTT),
                                TienChuyenKhoan: 0,
                                TienTheGiaTri: thegiatri
                            };
                        } else {
                            phaiTT = phaiTT - tienPOS;
                            if (chuyenkhoan >= phaiTT) {
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: Math.abs(phaiTT),
                                    TienTheGiaTri: thegiatri
                                };
                            } else {
                                phaiTT = phaiTT - chuyenkhoan;
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: chuyenkhoan,
                                    TienTheGiaTri: thegiatri
                                };
                            }
                        }
                    }
                }
            }
        }
    };
    const assignAgainQuyChiTiet = () => {
        let lstQuyCT: QuyChiTietDto[] = [];
        let tienMat = 0,
            tienPos = 0,
            tienCK = 0;
        let idTaiKhoanPos = null,
            idTaiKhoanCK = null;
        const itemPos = hinhthucThanhToanChosed.filter(
            (x: QuyChiTietDto) => x.hinhThucThanhToan === 2
        );
        const itemCK = hinhthucThanhToanChosed.filter(
            (x: QuyChiTietDto) => x.hinhThucThanhToan === 3
        );
        if (itemPos.length > 0) {
            idTaiKhoanPos = itemPos[0].idTaiKhoanNganHang;
        }
        if (itemCK.length > 0) {
            idTaiKhoanCK = itemCK[0].idTaiKhoanNganHang;
        }

        for (let i = 0; i < hinhthucThanhToanChosed.length; i++) {
            const itFor = hinhthucThanhToanChosed[i];
            switch (itFor.hinhThucThanhToan) {
                case 1:
                    tienMat += itFor.tienThu;
                    break;
                case 2:
                    tienPos += itFor.tienThu;
                    break;
                case 3:
                    tienCK += itFor.tienThu;
                    break;
            }
        }
        if (sumTienKhachTra > tongPhaiTra) {
            const shareMoney = shareMoney_QuyHD(tongPhaiTra, 0, tienMat, tienPos, tienCK, 0, 0);
            const tienMatNew = shareMoney.TienMat,
                tienPosNew = shareMoney.TienPOS,
                tienCKNew = shareMoney.TienChuyenKhoan;

            if (tienMatNew > 0) {
                const newQCT = new QuyChiTietDto({ hinhThucThanhToan: 1, tienThu: tienMatNew });
                lstQuyCT.push(newQCT);
            }
            if (tienPosNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: 2,
                    tienThu: tienPosNew,
                    idTaiKhoanNganHang: idTaiKhoanPos as null
                });
                lstQuyCT.push(newQCT);
            }
            if (tienCKNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: 3,
                    tienThu: tienCKNew,
                    idTaiKhoanNganHang: idTaiKhoanCK as null
                });
                lstQuyCT.push(newQCT);
            }
        } else {
            lstQuyCT = [...hinhthucThanhToanChosed];
        }
        return lstQuyCT;
    };

    const [selectedTientip, setSelectedTienTip] = React.useState(-1);
    const handleSelectedTientip = (index: number) => {
        setSelectedTienTip(index);
    };

    const handleSelectedCard = (itemCard: any, loaiHinhThuc: number) => {
        setHinhthucThanhToanChosed(
            hinhthucThanhToanChosed.map((item: QuyChiTietDto) => {
                if (item.hinhThucThanhToan === loaiHinhThuc) {
                    return {
                        ...item,
                        idTaiKhoanNganHang: itemCard.id,
                        soTaiKhoan: itemCard.soTaiKhoan,
                        tenChuThe: itemCard.tenChuThe,
                        tenNganHang: itemCard.tenNganHang
                    };
                } else {
                    return item;
                }
            })
        );
    };

    return (
        <Box sx={{ overflowX: 'auto', maxHeight: '90%' }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}>
                <IconButton
                    onClick={handleClickPrev}
                    sx={{
                        '& svg': {
                            width: '18px',
                            height: '18px'
                        },
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(26%) sepia(8%) saturate(4987%) hue-rotate(266deg) brightness(93%) contrast(90%)'
                        }
                    }}>
                    <ArrowLeft />
                </IconButton>
                <Typography variant="h3" fontSize="18px" color="#000" fontWeight="700">
                    Chọn thanh toán
                </Typography>
            </Box>
            <Box sx={{ marginTop: '24px' }}>
                <Typography fontSize="16px" fontWeight="700" color="#4C4B4C" variant="h3">
                    Tiền tip
                </Typography>
                <Grid container spacing="1.6vw" mt="-8px" sx={{ maxWidth: '70%' }}>
                    {tientip.map((item, index) => (
                        <Grid item xs={3} key={index}>
                            <Box
                                onClick={() => handleSelectedTientip(index)}
                                textAlign="center"
                                padding="16px"
                                border="1px solid #CDC9CD"
                                borderRadius="8px"
                                sx={{
                                    bgcolor: selectedTientip === index ? ' #F2EBF0' : '#fff',
                                    borderColor: selectedTientip === index ? '#7C3367' : '#CDC9CD',
                                    cursor: 'pointer',
                                    transition: '.4s',
                                    '&:hover': {
                                        borderColor: '#7C3367'
                                    }
                                }}>
                                <Typography
                                    fontSize="16px"
                                    variant="h3"
                                    fontWeight="400"
                                    color="#333233">
                                    {item}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ marginTop: '24px' }}>
                    <Typography fontSize="16px" fontWeight="700" color="#4C4B4C" variant="h3">
                        Hình thức thanh toán
                    </Typography>
                    <Grid container spacing={3} mt="-8px" sx={{ maxWidth: '90%' }}>
                        {hinhThucThanhToan.map((item, index) => (
                            <Grid item key={index} md={3} sm={4} xs={12}>
                                <Box
                                    onClick={() => choseHinhThucThanhToan(item.id)}
                                    textAlign="center"
                                    padding={{ md: 2, sm: '24px 10px', lg: 2, xs: 1 }}
                                    border="1px solid #CDC9CD"
                                    borderRadius="8px"
                                    sx={{
                                        position: 'relative',
                                        bgcolor: indexChosed.includes(item.id)
                                            ? ' #F2EBF0'
                                            : '#fff',
                                        borderColor: indexChosed.includes(item.id)
                                            ? '#7C3367'
                                            : '#CDC9CD',
                                        cursor: 'pointer',
                                        transition: '.4s',
                                        '& svg': {
                                            width: '32px',
                                            height: '32px'
                                        },
                                        '&:hover': {
                                            borderColor: '#7C3367'
                                        }
                                    }}>
                                    <item.icon />
                                    <Typography
                                        mt="8px"
                                        fontSize="14px"
                                        variant="h3"
                                        fontWeight="400"
                                        color="#333233">
                                        {item.text}
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            right: '-4px',
                                            display: 'flex',
                                            opacity: indexChosed.includes(item.id) ? '1' : '0',
                                            transition: '.3s',
                                            top: '-4px',
                                            height: '14px',
                                            width: '14px',
                                            bgcolor: '#fff',
                                            borderRadius: '50%',
                                            '& svg': {
                                                width: '14px',
                                                height: '14px'
                                            }
                                        }}>
                                        <TickIcon />
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {hinhthucThanhToanChosed
                        .sort((a: QuyChiTietDto, b: QuyChiTietDto) =>
                            a.hinhThucThanhToan > b.hinhThucThanhToan ? 1 : -1
                        )
                        .map((item: QuyChiTietDto) => (
                            <Box mt="24px" key={item.hinhThucThanhToan}>
                                <Box
                                    sx={{
                                        boxShadow: '0px 5px 18px 0px #28293D12',
                                        bgcolor: '#fff',
                                        marginTop: '16px',
                                        padding: '16px',
                                        position: 'relative',
                                        borderRadius: '8px'
                                    }}>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            '& svg': {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }}
                                        onClick={() =>
                                            removeHinhThucThanhToan(item.hinhThucThanhToan)
                                        }>
                                        <CloseIcon />
                                    </IconButton>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.hinhThucThanhToan === 1 && <IconTitleTienmat />}
                                        {item.hinhThucThanhToan === 2 && <IconNganhang />}
                                        {item.hinhThucThanhToan === 3 && <IconNganhang />}
                                        <Typography
                                            variant="h3"
                                            color="#000"
                                            fontSize="14px"
                                            fontWeight="700">
                                            {
                                                hinhThucThanhToan.filter(
                                                    (x: any) => x.id === item.hinhThucThanhToan
                                                )[0].text
                                            }
                                        </Typography>
                                    </Box>
                                    {item.hinhThucThanhToan !== 1 && (
                                        <Box
                                            sx={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                            {bankAccount.map((itemCard, index) => (
                                                <Box
                                                    onClick={() =>
                                                        handleSelectedCard(
                                                            itemCard,
                                                            item.hinhThucThanhToan
                                                        )
                                                    }
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        '&:hover p': {
                                                            color: '#7C3367'
                                                        }
                                                    }}>
                                                    <Box
                                                        sx={{
                                                            padding: '10px',
                                                            border: `1px solid ${
                                                                item.idTaiKhoanNganHang ===
                                                                itemCard.id
                                                                    ? '#7C3367'
                                                                    : '#CDC9CD'
                                                            }`,
                                                            transition: '.3s',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            width: 'fit-content'
                                                        }}>
                                                        <Box
                                                            sx={{
                                                                width: 'fit-content',
                                                                img: {
                                                                    objectFit: 'contain',
                                                                    width: '100%'
                                                                }
                                                            }}>
                                                            <img src={Card2} alt="card" />
                                                        </Box>
                                                    </Box>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: '#333233',
                                                            fontSize: '14px',
                                                            textTransform: 'uppercase',
                                                            transition: '.3s'
                                                        }}>
                                                        {itemCard.tenChuThe}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    <Box mt="12px" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography
                                            variant="body1"
                                            fontSize="14px"
                                            fontWeight="400"
                                            color="#666466"
                                            minWidth="105px">
                                            Tiền khách trả
                                        </Typography>
                                        <NumericFormat
                                            fullWidth
                                            sx={{
                                                bgcolor: '#fff',
                                                mt: '4px',
                                                '& input': {
                                                    appearance: 'textfield',
                                                    paddingY: '13.5px',
                                                    textAlign: 'right',
                                                    fontWeight: 600
                                                },
                                                '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button':
                                                    {
                                                        appearance: 'none'
                                                    }
                                            }}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            value={item?.tienThu}
                                            customInput={TextField}
                                            onChange={(e) => {
                                                changeTienKhachTra(
                                                    e.target.value,
                                                    item.hinhThucThanhToan
                                                );
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    {hinhthucThanhToanChosed.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2
                                }}>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: '14px', color: '#4C4B4C', marginTop: '8px' }}>
                                    {tienThuaTraKhach > 0
                                        ? 'Tiền thừa trả khách'
                                        : 'Tiền khách thiếu'}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: '14px', color: '#333233', fontWeight: '700' }}>
                                    {new Intl.NumberFormat('vi-VN').format(
                                        Math.abs(tienThuaTraKhach)
                                    )}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
export default Payments;
