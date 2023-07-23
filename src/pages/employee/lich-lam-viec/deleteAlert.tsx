import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import {
    Dialog,
    Button,
    Typography,
    MenuItem,
    Select,
    Box,
    SelectChangeEvent
} from '@mui/material';
import viLocale from 'date-fns/locale/vi';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}
const Delete: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate);

    const daysOfWeek = [];
    let defaultDay = '';
    for (let i = 0; i < 7; i++) {
        const day = addDays(startOfCurrentWeek, i);
        const formattedDay = format(day, 'EEEE, dd/MM/yyyy', { locale: viLocale });
        if (formattedDay.includes('Thứ Hai')) {
            defaultDay = formattedDay;
        }
        daysOfWeek.push(
            <MenuItem key={i} value={formattedDay}>
                {formattedDay}
            </MenuItem>
        );
    }
    daysOfWeek.push(daysOfWeek.shift());
    const [curent, setCurent] = useState<string | typeof defaultDay>(defaultDay);
    const handleChange = (event: SelectChangeEvent<string | typeof defaultDay>) => {
        setCurent(event.target.value);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '100vw',
                    maxWidth: '448px',
                    '& button': {
                        textTransform: 'unset!important',
                        fontSize: '14px',
                        minWidth: 'unset',
                        bgcolor: '#fff'
                    },
                    padding: '28px 24px'
                }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize="24px" color="#4C4B4C" fontWeight="700" variant="h2">
                        Xóa tất cả ca làm việc
                    </Typography>
                    <Button
                        sx={{
                            bgcolor: 'transparent!important',
                            minWidth: 'unset',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Box>
                <Typography color="#4C4B4C" fontSize="14px" fontWeight="500" variant="body1">
                    Từ
                </Typography>
                <Select
                    fullWidth
                    value={curent}
                    displayEmpty
                    onChange={handleChange}
                    IconComponent={() => <ArrowDown />}
                    sx={{
                        width: '100%',
                        '[aria-expanded="true"] ~ svg': {
                            transform: 'rotate(180deg)'
                        },
                        pr: '20px',
                        color: '#4C4B4C',
                        height: '48px',
                        mt: '8px'
                    }}>
                    {daysOfWeek}
                </Select>
                <Box display="flex" justifyContent="end" gap="8px" mt="24px">
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{ bgcolor: 'var(--color-main)!important' }}
                        className="btn-container-hover">
                        Xoá
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ color: 'var(--color-main)!important' }}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
export default Delete;
