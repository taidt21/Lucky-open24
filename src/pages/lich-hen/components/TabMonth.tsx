import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { startOfMonth, endOfMonth, format, eachWeekOfInterval } from 'date-fns';
import { ReactComponent as ClockBlue } from '../../../images/clock-blue.svg';
import { ReactComponent as ClockPink } from '../../../images/clock-pink.svg';
import { ReactComponent as ClockGreen } from '../../../images/clock-green.svg';
import { ReactComponent as ClockOrange } from '../../../images/clock-orange.svg';
import { ReactComponent as ClockViolet } from '../../../images/clock-violet.svg';
import { BookingGetAllItemDto } from '../../../services/dat-lich/dto/BookingGetAllItemDto';
const TabMonth: React.FC<{ dateQuery: Date; data: BookingGetAllItemDto[] }> = ({
    data,
    dateQuery
}) => {
    const startDate = startOfMonth(dateQuery);
    const endDate = endOfMonth(dateQuery);
    const weeksInMonth = eachWeekOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    React.useEffect(() => {
        const HTML = document.documentElement;
        HTML.style.overflowY = 'hidden';

        return () => {
            HTML.style.overflowY = 'auto';
        };
    }, []);
    const color = [
        {
            color: '#009EF7',
            background: '#F1FAFF', //Đang phục vụ
            icon: <ClockBlue />
        },
        {
            color: '#F1416C',
            background: '#FFF5F8', // Huỷ
            icon: <ClockPink />
        },
        {
            color: '#FF9900',
            background: '#FFF8DD', //Chưa xác nhận
            icon: <ClockOrange />
        },
        {
            color: '#50CD89',
            background: '#E8FFF3', //Hoàn thành
            icon: <ClockGreen />
        },
        {
            color: '#7C3367',
            background: '#E5D6E1', // Đã xác nhận
            icon: <ClockViolet />
        }
    ];
    const [windowHeight, setWindowHeight] = React.useState(innerHeight);

    React.useEffect(() => {
        const handleResize = () => {
            setWindowHeight(innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <TableContainer
            sx={{
                bgcolor: '#fff',
                padding: '24px',

                borderRadius: '8px',
                maxHeight: windowHeight > 768 ? '70vh' : '64vh',
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
            <Table>
                <TableHead
                    sx={{
                        bgcolor: '#F2F2F2',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        zIndex: '5'
                    }}>
                    <TableRow>
                        {weekDays.map((day) => (
                            <TableCell key={day} sx={{ border: '0', textAlign: 'center' }}>
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeksInMonth.map((weekStartDate) => (
                        <TableRow key={weekStartDate.getTime()}>
                            {weekDays.map((ngay: string, index: number) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + index + 1);
                                const matchingData = data.filter(
                                    (item) =>
                                        item.dayOfWeek === ngay &&
                                        format(new Date(item.bookingDate), 'd') ==
                                            format(currentDate, 'd')
                                );

                                return (
                                    <TableCell
                                        key={currentDate.getTime()}
                                        sx={{
                                            padding: '0',
                                            border: '1px solid #e0e0e0',
                                            position: 'relative',
                                            height: '150px',
                                            overflow: 'hidden',
                                            width: 1 / weekDays.length
                                        }}>
                                        <Box
                                            sx={{
                                                fontSize: '14px',
                                                color: '#4C4B4C',
                                                height: '100%',
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'end',
                                                pointerEvents: 'none',
                                                padding: '8px',
                                                bgcolor: '#fff',
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                zIndex: '2'
                                            }}>
                                            {format(currentDate, 'd')}
                                        </Box>
                                        {Array.isArray(matchingData) && matchingData.length > 0
                                            ? matchingData.map((item, itemIndex: number) => (
                                                  <Box
                                                      key={itemIndex}
                                                      sx={{
                                                          bgcolor: item.color + '1a',
                                                          padding: item ? '4px 12px' : '',
                                                          width: 'fit-content',
                                                          top: `${
                                                              (itemIndex / matchingData.length) *
                                                              100
                                                          }%`,
                                                          left: '0',
                                                          borderRadius: '4px',
                                                          position: 'absolute',
                                                          zIndex: '3'
                                                      }}>
                                                      <Typography
                                                          variant="body1"
                                                          fontSize="12px"
                                                          whiteSpace="nowrap"
                                                          color={item.color}>
                                                          <b> {item.startTime} </b>
                                                          {item.customer + ':'}
                                                          {item.employee}
                                                      </Typography>
                                                  </Box>
                                              ))
                                            : undefined}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default TabMonth;
