import {
    Box,
    TextField,
    Typography,
    Select,
    Checkbox,
    Button,
    Grid,
    MenuItem,
    FormControlLabel
} from '@mui/material';

import { SelectChangeEvent } from '@mui/material/Select';
import React, { useState } from 'react';
import { ReactComponent as HelpIcon } from '../../../../images/help-circle.svg';
import { ReactComponent as ArrowDown } from '../../../../images/arow-down.svg';
const Booking: React.FC = () => {
    const [option1, setOption1] = useState('1');
    const [option2, setOption2] = useState('1');
    const [option3, setOption3] = useState('1');
    const [option4, setOption4] = useState('1');
    const handleChange1 = (event: SelectChangeEvent) => {
        setOption1(event.target.value);
    };
    const handleChange2 = (event: SelectChangeEvent) => {
        setOption2(event.target.value);
    };
    const handleChange3 = (event: SelectChangeEvent) => {
        setOption3(event.target.value);
    };
    const handleChange4 = (event: SelectChangeEvent) => {
        setOption4(event.target.value);
    };
    return (
        <Box sx={{ marginTop: '-52px', display: 'flex', flexDirection: 'column' }}>
            <Button
                variant="contained"
                sx={{
                    mb: '16px',
                    width: 'fit-content',
                    marginLeft: 'auto'
                }}
                className="btn-container-hover">
                Cập nhật
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    '& > div': {
                        bgcolor: '#fff',
                        padding: '24px',
                        borderRadius: '8px'
                    }
                }}>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            '& svg': {
                                filter: 'var(--color-hoverIcon)'
                            }
                        }}>
                        <Typography variant="h3" fontSize="16px" fontWeight="700" color="#333233">
                            Tùy chọn trang web đặt lịch
                        </Typography>
                        <Box>
                            <HelpIcon />
                        </Box>
                    </Box>
                    <Typography
                        variant="body1"
                        color="#4C4B4C"
                        fontSize="14px"
                        fontWeight="500"
                        marginTop="16px">
                        Địa chỉ trang web khách hàng booking
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        defaultValue="https://luckybeauty-booking.com/nailsalon"
                        sx={{
                            '& input': { height: '31px' },
                            borderColor: '#E6E1E6!important',
                            marginTop: '8px',
                            height: '48px'
                        }}
                    />
                </Box>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            '& svg': {
                                filter: 'var(--color-hoverIcon)'
                            }
                        }}>
                        <Typography variant="h3" fontSize="16px" fontWeight="700" color="#333233">
                            Thời gian đặt lịch trước
                        </Typography>
                        <Box>
                            <HelpIcon />
                        </Box>
                    </Box>
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            '& .MuiInputBase-root': {
                                pr: '20px'
                            },
                            '& .MuiInputBase-root svg': {
                                width: '12px'
                            },
                            '& [aria-expanded="true"] ~ svg': {
                                transform: 'rotate(180deg)'
                            }
                        }}>
                        <Grid item md={6} xs={12}>
                            <Typography
                                variant="body1"
                                color="#4C4B4C"
                                fontSize="14px"
                                fontWeight="500"
                                marginTop="16px">
                                Khách hàng có thể dặt lịch hẹn trước tối thiếu
                            </Typography>
                            <Select
                                IconComponent={() => <ArrowDown />}
                                size="small"
                                sx={{ width: '100%', height: '48px', mt: '8px' }}
                                value={option1}
                                onChange={handleChange1}
                                displayEmpty>
                                <MenuItem value={1}>Ngay trước giờ bắt đầu</MenuItem>
                                <MenuItem value={2}>Ngay sau giờ bắt đầu</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography
                                variant="body1"
                                color="#4C4B4C"
                                fontSize="14px"
                                fontWeight="500"
                                marginTop="16px">
                                Khách hàng có thể dặt lịch hẹn trước tối đa
                            </Typography>
                            <Select
                                IconComponent={() => <ArrowDown />}
                                size="small"
                                sx={{ width: '100%', height: '48px', mt: '8px' }}
                                value={option2}
                                onChange={handleChange2}
                                displayEmpty>
                                <MenuItem value={1}>2 tháng</MenuItem>
                                <MenuItem value={2}>Ngay sau giờ bắt đầu</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography
                                variant="body1"
                                color="#4C4B4C"
                                fontSize="14px"
                                fontWeight="500"
                                marginTop="16px">
                                Khách hàng có thể hủy hoặc lên lịch lại
                            </Typography>
                            <Select
                                IconComponent={() => <ArrowDown />}
                                size="small"
                                sx={{ width: '100%', height: '48px', mt: '8px' }}
                                value={option3}
                                onChange={handleChange3}
                                displayEmpty>
                                <MenuItem value={1}>Bất cứ lúc nào</MenuItem>
                                <MenuItem value={2}>Ngay sau giờ bắt đầu</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography
                                variant="body1"
                                color="#4C4B4C"
                                fontSize="14px"
                                fontWeight="500"
                                marginTop="16px">
                                Khoảng thời gian đặt lịch
                            </Typography>
                            <Select
                                IconComponent={() => <ArrowDown />}
                                size="small"
                                sx={{ width: '100%', height: '48px', mt: '8px' }}
                                value={option4}
                                onChange={handleChange4}
                                displayEmpty>
                                <MenuItem value={1}>15 phút</MenuItem>
                                <MenuItem value={2}>Ngay sau giờ bắt đầu</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            '& svg': {
                                filter: 'var(--color-hoverIcon)'
                            }
                        }}>
                        <Typography variant="h3" fontSize="16px" fontWeight="700" color="#333233">
                            Tùy chọn cuộc hẹn
                        </Typography>
                        <Box>
                            <HelpIcon />
                        </Box>
                    </Box>
                    <Box
                        mt="5px"
                        sx={{
                            '& .MuiTypography-root': {
                                color: '#4C4B4C',
                                fontSize: '14px'
                            }
                        }}>
                        <FormControlLabel
                            sx={{ width: '100%' }}
                            control={
                                <Checkbox
                                    sx={{
                                        color: 'var(--color-main)!important'
                                    }}
                                />
                            }
                            label="Gửi thông báo đến nhân viên khách hàng đặt lịch"
                        />
                        <FormControlLabel
                            sx={{ width: '100%' }}
                            control={
                                <Checkbox
                                    sx={{
                                        color: 'var(--color-main)!important'
                                    }}
                                />
                            }
                            label="Gửi thông báo đến địa chỉ email"
                        />
                        <TextField
                            defaultValue="dinhtuantaiok@gmail.com"
                            fullWidth
                            size="small"
                            sx={{ '& input': { height: '31px' }, marginY: '8px' }}
                        />
                        <FormControlLabel
                            sx={{ width: '100%' }}
                            control={
                                <Checkbox
                                    sx={{
                                        color: 'var(--color-main)!important'
                                    }}
                                />
                            }
                            label="Các cuộc hẹn sẽ được tự động xác nhận"
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default Booking;
