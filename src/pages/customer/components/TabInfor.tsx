import React from 'react';
import { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import useWindowWidth from '../../../components/StateWidth';
const TabInfor: React.FC = () => {
    const [listBtn, setListBtn] = useState([
        {
            text: 'Gửi thông báo SMS',
            open: false
        },
        {
            text: 'Khách hàng chấp nhận thông báo tiếp thị',
            open: false
        },
        {
            text: 'Gửi lời chúc sinh nhật',
            open: false
        },
        {
            text: 'Chặn khách hàng',
            open: false
        }
    ]);

    const handleToggle = (index: number) => {
        setListBtn((prevState) => {
            const newList = [...prevState];
            newList[index].open = !newList[index].open;
            return newList;
        });
    };

    const Datas = [
        {
            text: 'Tổng cuộc hẹn',
            value: '1'
        },
        {
            text: 'Cuộc hẹn hoàn thành',
            value: '3'
        },
        {
            text: 'Cuộc hẹn hủy',
            value: '10'
        },
        {
            text: 'Tổng chi tiêu',
            value: '200.000Đ'
        }
    ];
    return (
        <Box mt="24px">
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Box
                        bgcolor="#fff"
                        padding="24px"
                        sx={{ boxShadow: '0px 4px 20px 0px #AAA9B81A', borderRadius: '12px' }}>
                        <Typography variant="h3" fontWeight="700" color="#3B4758" fontSize="16px">
                            Cài đặt
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                mt: '30px'
                            }}>
                            {listBtn.map((item, index) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    key={index}>
                                    <Typography
                                        variant="body1"
                                        fontSize="14px"
                                        color="#4C4B4C"
                                        maxWidth={
                                            index === 1 && useWindowWidth() < 1700
                                                ? '200px'
                                                : 'unset'
                                        }>
                                        {item.text}
                                    </Typography>
                                    <Button
                                        onClick={() => {
                                            handleToggle(index);
                                        }}
                                        sx={{
                                            minWidth: '36px',
                                            borderRadius: '100px',
                                            height: '20px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            '& span': {
                                                position: 'absolute',
                                                display: 'block',
                                                left: '0',
                                                top: '0',
                                                width: '100%',
                                                height: '100%',
                                                transition: '.2s'
                                            },
                                            '& .on': {
                                                bgcolor: '#7C3367',
                                                left: item.open ? '0' : '-100%'
                                            },
                                            '& .off': {
                                                bgcolor: '#E6E1E6',
                                                left: item.open ? '100%' : '0'
                                            },
                                            '& .dot': {
                                                position: 'absolute',
                                                width: '16px',
                                                height: '16px',
                                                bgcolor: '#fff',
                                                borderRadius: '50%',
                                                left: item.open ? 'calc(100% - 17px)' : '1px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: '2',
                                                transition: '.2s'
                                            }
                                        }}>
                                        <span className="dot"></span>
                                        <span className="on"></span>
                                        <span className="off"> </span>
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <Box bgcolor="#fff" padding="24px" borderRadius="12px">
                        <Grid container>
                            {Datas.map((item, index) => (
                                <Grid item xs={3} key={index}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            alignItems: 'center'
                                        }}>
                                        <Typography
                                            color="#333233"
                                            variant="body1"
                                            fontSize="24px"
                                            fontWeight="700">
                                            {item.value}
                                        </Typography>
                                        <Typography color="#666466" fontSize="14px" variant="body1">
                                            {item.text}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box bgcolor="#fff" mt="24px" padding="24px" borderRadius="12px">
                        <Typography variant="h3" fontSize="16px" color="#3B4758" fontWeight="700">
                            Hoạt động
                        </Typography>
                        <Box
                            sx={{
                                borderTop: '1px solid #EEF0F4',
                                mt: '24px',
                                marginX: '-24px',
                                mb: '16px'
                            }}></Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <Typography variant="body1" fontSize="14px" color="#3B4758">
                                Đã đặt lịch hẹn ngày 30-06-2023
                            </Typography>
                            <Typography variant="body1" fontSize="14px" color="#3B4758">
                                Ngày 30-06-2023 09:00
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                mt: '24px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <Typography variant="body1" fontSize="14px" color="#3B4758">
                                Đã tạo khách hàng
                            </Typography>
                            <Typography variant="body1" fontSize="14px" color="#3B4758">
                                Ngày 30-06-2023 09:00
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default TabInfor;
