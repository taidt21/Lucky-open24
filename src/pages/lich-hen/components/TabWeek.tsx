import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { BookingGetAllItemDto } from '../../../services/dat-lich/dto/BookingGetAllItemDto';
const TabWeek: React.FC<{ dateQuery: Date; data: BookingGetAllItemDto[] }> = ({
    dateQuery,
    data
}) => {
    const [weekDates, setWeekDates] = useState<any[]>([]);

    useEffect(() => {
        getWeekDate(dateQuery);
        const HTML = document.documentElement;
        HTML.style.overflowY = 'hidden';

        return () => {
            HTML.style.overflowY = 'auto';
        };
    }, []);
    const getWeekDate = (dateCurrent: Date) => {
        const firstDayOfWeek = new Date(
            dateCurrent.setDate(dateCurrent.getDate() - dateCurrent.getDay() + 1)
        );

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            dates.push(formattedDate);
        }

        setWeekDates(dates);
    };
    const formatDate = (date: Date): JSX.Element => {
        const day = date.toLocaleDateString('vi', { weekday: 'long' });
        const month = date.toLocaleDateString('vi', { month: 'long' });
        const dayOfMonth = date.getDate();
        return (
            <>
                <Box sx={{ fontWeight: '400', fontSize: '12px', color: '#525F7A' }}>{day}</Box>
                <Box sx={{ fontSize: '18px', color: '#29303D', mt: '8px' }}>{dayOfMonth}</Box>
            </>
        );
    };
    const weekDates2 = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    // Tạo mảng 2 chiều để lưu trữ dữ liệu cho mỗi ngày trong tuần
    const weekData: any[][] = Array(7)
        .fill([])
        .map(() => []);

    // Đưa dữ liệu vào mảng 2 chiều theo ngày
    data.map((item) => {
        const dateIndex = weekDates2.findIndex((date) => date === item.dayOfWeek);
        if (dateIndex !== -1) {
            weekData[dateIndex] = [...weekData[dateIndex], item];
        }
    });
    const [windowHeight, setWindowHeight] = useState(innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 'none',
                    width: '100%',
                    paddingRight: '40px',
                    maxHeight: windowHeight > 768 ? '70vh' : '64vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px'
                    },
                    '&::-webkit-scrollbar-track': {
                        borderRadius: '16px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(124, 51, 103, 0.2)',
                        borderRadius: '8px'
                    }
                }}>
                <Table sx={{ width: '100%' }} stickyHeader>
                    <TableHead sx={{ width: '100%' }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    pointerEvents: 'none',
                                    borderBottom: '0',
                                    width: '70px'
                                }}>
                                <Box sx={{ opacity: '0' }}>00:00</Box>
                            </TableCell>
                            {weekDates.map((date, index) => (
                                <TableCell
                                    colSpan={1}
                                    key={index}
                                    sx={{
                                        color: '#29303D'
                                    }}>
                                    {date}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& .MuiTableCell-body': {
                                borderLeft: '1px solid rgba(224, 224, 224, 1)'
                            },
                            '& .MuiTableCell-body:last-child': {
                                borderRight: '1px solid rgba(224, 224, 224, 1)'
                            }
                        }}>
                        {Array.from({ length: 14 }, (_, index) => {
                            const hour = index + 7; // Giờ bắt đầu từ 7h sáng (7 -> 20)
                            const timeLabel = hour.toString().padStart(2, '0') + ':00'; // Định dạng nhãn thời gian

                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            color: '#525F7A',
                                            fontSize: '12px',
                                            verticalAlign: 'top',
                                            paddingTop: '8px',
                                            paddingBottom: '50px',
                                            textAlign: 'right',
                                            border: '0',
                                            width: '70px',
                                            borderLeft: '0!important'
                                        }}>
                                        {timeLabel}
                                    </TableCell>
                                    {weekDates2.map((date, dateIndex) => {
                                        const matchingData = data.filter(
                                            (item) =>
                                                item.dayOfWeek === date &&
                                                parseInt(item.startTime.split(':')[0], 10) === hour
                                        );

                                        return (
                                            <TableCell
                                                key={dateIndex}
                                                sx={{
                                                    padding: '4px',
                                                    position: 'relative',
                                                    width: `${100 / weekDates2.length}%`
                                                }}>
                                                <Box
                                                    sx={{
                                                        '&::after': {
                                                            content: "''",
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '0',
                                                            transform: 'translateY(-50%)',
                                                            width: '100%',
                                                            pointerEvent: 'none',
                                                            zIndex: '0',
                                                            borderTop: '1px dashed #CDC9CD'
                                                        }
                                                    }}>
                                                    {matchingData.map((item, itemIndex) => {
                                                        const startTimeHours = parseInt(
                                                            item.startTime.split(':')[0],
                                                            10
                                                        );
                                                        const startTimeMinutes = parseInt(
                                                            item.startTime.split(':')[1],
                                                            10
                                                        );
                                                        const endTimeHours = parseInt(
                                                            item.endTime.split(':')[0],
                                                            10
                                                        );
                                                        const endTimeMinutes = parseInt(
                                                            item.endTime.split(':')[1],
                                                            10
                                                        );

                                                        const durationHours =
                                                            endTimeHours - startTimeHours;
                                                        const durationMinutes =
                                                            endTimeMinutes - startTimeMinutes;

                                                        const duration =
                                                            durationHours * 60 + durationMinutes;
                                                        const cellHeight = `${duration * 1.25}px`;

                                                        const topPosition = `${
                                                            (startTimeMinutes / 60) * 75.16
                                                        }px`;

                                                        return (
                                                            <Box
                                                                key={itemIndex}
                                                                bgcolor={item.color + '1a'}
                                                                title={
                                                                    'Nhân viên thực hiện: ' +
                                                                    item.employee
                                                                }
                                                                position="absolute"
                                                                height={cellHeight}
                                                                whiteSpace="nowrap"
                                                                overflow="hidden"
                                                                zIndex="1"
                                                                padding="8px 8px 16px 8px"
                                                                borderRadius="4px"
                                                                borderLeft={`6px solid ${item.color}`}
                                                                width={`${
                                                                    100 / matchingData.length
                                                                }%`}
                                                                top={topPosition}
                                                                left={`${
                                                                    (itemIndex /
                                                                        matchingData.length) *
                                                                    100
                                                                }%`}>
                                                                <Box>
                                                                    <Typography
                                                                        variant="body1"
                                                                        color={item.color}
                                                                        fontSize="12px">
                                                                        {item.startTime +
                                                                            ' - ' +
                                                                            item.endTime}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography
                                                                    variant="body1"
                                                                    color={item.color}
                                                                    fontWeight="700"
                                                                    fontSize="12px">
                                                                    {item.customer}
                                                                </Typography>
                                                                <Typography
                                                                    color={item.color}
                                                                    variant="body1"
                                                                    fontSize="12px">
                                                                    {item.services}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
export default TabWeek;
