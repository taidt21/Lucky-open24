import React, { useState } from 'react';
import {
    Box,
    Dialog,
    TextField,
    Button,
    Grid,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    Checkbox,
    FormControlLabel,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';

import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import { ReactComponent as DateIcon } from '../../../images/calendarMenu.svg';
import { ReactComponent as ClockIcon } from '../../../images/clock.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import AppConsts from '../../../lib/appconst';

interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}
const ThemLich: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    const [curent, setCurent] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setCurent(event.target.value);
    };
    const [date, setDate] = useState<string>('20/6/2023');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const handleDayToggle = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
        setSelectedDays(newDays);
    };
    const TimeControl = [
        {
            day: 'Thứ 2',
            timeStart: '08:00',
            timeEnd: '23:00'
        },
        {
            day: 'Thứ 3',
            timeStart: '05:00',
            timeEnd: '12:00'
        },
        {
            day: 'Thứ 4',
            timeStart: '01:00',
            timeEnd: '21:00'
        },
        {
            day: 'Thứ 5',
            timeStart: '17:00',
            timeEnd: '13:00'
        },
        {
            day: 'Thứ 6',
            timeStart: '11:00',
            timeEnd: '14:00'
        },
        {
            day: 'Thứ 7',
            timeStart: '15:00',
            timeEnd: '16:00'
        }
    ];
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiPaper-root': { width: '71vw' } }}
            maxWidth={false}>
            <Box
                sx={{
                    bgcolor: '#fff',
                    padding: '28px 24px',
                    overflowX: 'hidden',
                    position: 'relative'
                }}>
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        minWidth: 'unset',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </Button>
                <Typography variant="h3" fontSize="24px" color="#333233" fontWeight="700" mb={3}>
                    Đặt ca làm việc thường xuyên
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '16px',
                                flexDirection: 'column',
                                border: '1px solid #E6E1E6',
                                padding: '24px',
                                borderRadius: '8px'
                            }}>
                            <Box>
                                <Typography color="#4C4B4C" fontSize="14px" fontWeight="500">
                                    Lặp lại
                                </Typography>
                                <Select
                                    value={curent}
                                    onChange={handleChange}
                                    sx={{
                                        width: '100%',
                                        '[aria-expanded="true"] ~ svg': {
                                            transform: 'rotate(180deg)'
                                        },
                                        pr: '20px',
                                        color: '#4C4B4C',

                                        mt: '8px'
                                    }}
                                    displayEmpty
                                    size="small"
                                    IconComponent={() => <ArrowDown />}>
                                    <MenuItem value="">Mỗi tuần</MenuItem>
                                    <MenuItem value={1}>Mỗi ngày</MenuItem>
                                    <MenuItem value={3}>Mỗi tháng</MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                <Typography color="#4C4B4C" fontSize="14px" fontWeight="500">
                                    Ngày bắt đầu
                                </Typography>
                                <TextField
                                    type="date"
                                    value={date}
                                    size="small"
                                    onChange={handleDateChange}
                                    fullWidth
                                    sx={{
                                        mt: '8px',
                                        cursor: 'pointer',
                                        position: 'relative',

                                        '& input': {
                                            flexDirection: 'row-reverse',
                                            gap: '10px'
                                        },
                                        '& svg': {
                                            position: 'absolute',
                                            zIndex: '2',
                                            pointerEvents: 'none'
                                        },
                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                            opacity: '0'
                                        },
                                        '& input[type="date"]::-moz-calendar-picker-indicator': {
                                            opacity: '0'
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <React.Fragment>
                                                <DateIcon />
                                            </React.Fragment>
                                        )
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography color="#4C4B4C" fontSize="14px" fontWeight="500">
                                    Ngày kết thúc
                                </Typography>
                                <TextField
                                    type="date"
                                    value={date}
                                    size="small"
                                    onChange={handleDateChange}
                                    fullWidth
                                    sx={{
                                        mt: '8px',
                                        cursor: 'pointer',
                                        position: 'relative',

                                        '& input': {
                                            flexDirection: 'row-reverse',
                                            gap: '10px'
                                        },
                                        '& svg': {
                                            position: 'absolute',
                                            zIndex: '2',
                                            pointerEvents: 'none'
                                        },
                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                            opacity: '0'
                                        },
                                        '& input[type="date"]::-moz-calendar-picker-indicator': {
                                            opacity: '0'
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <React.Fragment>
                                                <DateIcon />
                                            </React.Fragment>
                                        )
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid item alignContent={'center'} alignItems={'center'}>
                            <ToggleButtonGroup
                                fullWidth
                                size="small"
                                orientation="horizontal"
                                value={selectedDays}
                                onChange={handleDayToggle}>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.monday}
                                    aria-label="Monday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.monday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T2
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.tuesday}
                                    aria-label="Tuesday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.tuesday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T3
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.wednesday}
                                    aria-label="Wednesday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.wednesday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T4
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.thursday}
                                    aria-label="Thursday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.thursday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T5
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.friday}
                                    aria-label="Friday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.friday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T6
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.saturday}
                                    aria-label="Saturday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.saturday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    T7
                                </ToggleButton>
                                <ToggleButton
                                    value={AppConsts.dayOfWeek.sunday}
                                    aria-label="Sunday"
                                    style={
                                        selectedDays.includes(AppConsts.dayOfWeek.sunday)
                                            ? {
                                                  backgroundColor: '#4CB050',
                                                  color: '#FFFFFF'
                                              }
                                            : {}
                                    }>
                                    CN
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        <Box
                            sx={{
                                border: '1px solid #E6E1E6',
                                padding: '24px',
                                borderRadius: '8px'
                            }}>
                            <Grid container>
                                <Grid item xs={3}></Grid>
                                <Grid xs={9} item container mb={2}>
                                    <Grid xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                                gap: '10px',
                                                mb: '16px'
                                            }}>
                                            <Box
                                                sx={{
                                                    color: '#666466',
                                                    fontSize: '12px',
                                                    padding: '8px 12px',
                                                    border: '1px solid #E6E1E6',
                                                    borderRadius: '4px'
                                                }}>
                                                Thời gian sao chép từ giờ mở cửa kinh doanh{' '}
                                            </Box>
                                            <Button
                                                variant="text"
                                                sx={{
                                                    fontSize: '12px',
                                                    minWidth: 'unset',
                                                    color: '#7C3367!important',
                                                    textTransform: 'unset',
                                                    fontWeight: 'unset'
                                                }}>
                                                Xóa tất cả thời gian
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography
                                            variant="body1"
                                            fontSize="14px"
                                            fontWeight="500"
                                            color="#4C4B4C">
                                            Thời gian bắt đầu
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography
                                            variant="body1"
                                            fontSize="14px"
                                            fontWeight="500"
                                            color="#4C4B4C">
                                            Thời gian kết thúc
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {TimeControl.map((item) => (
                                    <Box key={item.day}>
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            sx={{
                                                                color: '#7C3367',
                                                                '&.Mui-checked': {
                                                                    color: '#7C3367'
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize="14px"
                                                                fontWeight="500"
                                                                color="#4C4B4C">
                                                                {' '}
                                                                {item.day}
                                                            </Typography>{' '}
                                                            <Typography
                                                                variant="body1"
                                                                fontSize="12px"
                                                                color="#4C4B4C"
                                                                mt="4px">
                                                                {item.timeStart}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={9} container spacing={1}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        type="time"
                                                        id="startTime"
                                                        fullWidth
                                                        value={item.timeStart}
                                                        sx={{
                                                            '& input': {
                                                                flexDirection: 'row-reverse',

                                                                gap: '10px'
                                                            },
                                                            '& input::-webkit-calendar-picker-indicator':
                                                                {
                                                                    opacity: '0',
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    cursor: 'pointer'
                                                                },
                                                            '& svg': {
                                                                pointerEvents: 'none',
                                                                position: 'absolute',
                                                                left: '10%',
                                                                width: '20px',
                                                                height: '20px'
                                                            }
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <React.Fragment>
                                                                    <ClockIcon />
                                                                </React.Fragment>
                                                            )
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        type="time"
                                                        fullWidth
                                                        id="endTime"
                                                        value={item.timeEnd}
                                                        sx={{
                                                            '& input': {
                                                                flexDirection: 'row-reverse'
                                                            },
                                                            '& input::-webkit-calendar-picker-indicator':
                                                                {
                                                                    opacity: '0',
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    cursor: 'pointer'
                                                                },
                                                            '& svg': {
                                                                position: 'absolute',
                                                                pointerEvents: 'none',
                                                                left: '10%',
                                                                width: '20px',
                                                                height: '20px'
                                                            }
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <React.Fragment>
                                                                    <ClockIcon />
                                                                </React.Fragment>
                                                            )
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                variant="text"
                                                sx={{
                                                    textTransform: 'unset',
                                                    marginLeft: 'auto',
                                                    color: '#009EF7',
                                                    fontWeight: '500'
                                                }}>
                                                Thêm ca làm việc
                                            </Button>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                            <Grid container alignItems="center">
                                <Grid item xs={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{
                                                    color: '#7C3367',
                                                    '&.Mui-checked': {
                                                        color: '#7C3367'
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography
                                                    variant="body1"
                                                    fontSize="14px"
                                                    fontWeight="500"
                                                    color="#4C4B4C">
                                                    Chủ nhật
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </Grid>
                                <Grid xs={9}>
                                    <Typography variant="body1" fontSize="12px" color="#4C4B4C">
                                        Không có ca làm việc
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        '& button': {
                            textTransform: 'unset!important'
                        },
                        mt: '24px',
                        ml: 'auto',
                        display: 'flex',
                        justifyContent: 'end',
                        gap: '8px'
                    }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{ bgcolor: '#7C3367!important' }}
                        className="btn-container-hover">
                        Lưu
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ color: '#965C85!important' }}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
export default ThemLich;
