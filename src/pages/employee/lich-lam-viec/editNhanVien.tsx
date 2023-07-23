import { Dialog, Button, Typography, Box, Grid, TextField } from '@mui/material';
import React from 'react';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import { ReactComponent as DeleteIcon } from '../../../images/trash.svg';
import AddIcon from '@mui/icons-material/Add';

interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    openEditLich: () => void;
}
const Edit: React.FC<DialogComponentProps> = ({ open, onClose, openEditLich }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper ': {
                    maxWidth: 'unset!important'
                }
            }}>
            <Box sx={{ padding: '28px 24px', width: '100vw', maxWidth: '680px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
                    <Typography fontSize="24px" color="#4C4B4C" fontWeight="700" variant="h2">
                        Ca làm việc của Hà Đinh ngày 15/07/2023
                    </Typography>
                    <Button
                        sx={{
                            minWidth: 'unset',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={5.5}>
                        <Typography
                            variant="h3"
                            fontSize="14px"
                            fontWeight="500"
                            color="#4C4B4C"
                            mb="8px">
                            Thời gian bắt đầu
                        </Typography>
                        <TextField
                            type="time"
                            id="startTime"
                            defaultValue="09:00"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={5.5}>
                        <Typography
                            variant="h3"
                            fontSize="14px"
                            fontWeight="500"
                            color="#4C4B4C"
                            mb="8px">
                            Thời gian kết thúc
                        </Typography>
                        <TextField
                            type="time"
                            id="endTime"
                            defaultValue="10:00"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1} sx={{ p: '0!important', display: 'flex' }}>
                        <Button
                            sx={{
                                mt: 'auto',
                                minWidth: 'unset!important',
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                }
                            }}>
                            <DeleteIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Box sx={{ '& button': { minWidth: 'unset' }, marginTop: '16px' }}>
                    <Button
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{
                            paddingX: '5px',

                            transition: '.4s'
                        }}>
                        <AddIcon sx={{ color: '#4C4B4C' }} />
                    </Button>
                    <Button
                        variant="text"
                        sx={{
                            color: 'var(--color-main)',
                            fontSize: '14px',
                            fontWeight: '500',
                            textTransform: 'unset'
                        }}>
                        Thêm ca làm việc
                    </Button>
                </Box>
                <Box sx={{ color: '#4C4B4C', fontSize: '12px', marginTop: '24px' }}>
                    Để đặt ca làm việc thường xuyên, đi tới{' '}
                    <Box
                        component="span"
                        sx={{ color: 'var(--color-main)', cursor: 'pointer' }}
                        onClick={openEditLich}>
                        Lịch làm việc
                    </Box>{' '}
                </Box>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset!important',
                            textTransform: 'unset',
                            fontWeight: '400'
                        },
                        justifyContent: 'end',
                        gap: '8px',
                        display: 'flex'
                    }}>
                    <Button onClick={onClose} variant="contained" className="btn-container-hover">
                        Lưu
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ color: 'var(--color-main)!important', bgcolor: '#fff!important' }}
                        className="btn-outline-hover">
                        Hủy{' '}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Edit;
