import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    Grid,
    IconButton,
    Button,
    Autocomplete,
    TextField
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import nhanVienStore from '../../../stores/nhanVienStore';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface DialogProps {
    open: boolean;
    onClose: () => void;
}

const ThemThoiGianChan: React.FC<DialogProps> = ({ open, onClose }) => {
    const { listNhanVien } = nhanVienStore;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <Box
                sx={{
                    padding: '24px',
                    '& .MuiPaper-elevation': { width: '100vw' },
                    '& .MuiInputBase-root': {
                        fontSize: '14px'
                    }
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: '24px'
                    }}>
                    <Typography variant="h2" color="#333233" fontSize="24px" fontWeight="700">
                        Thời gian bị chặn
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Grid
                    container
                    sx={{
                        '& .MuiFormControl-root': { width: '100%!important' },
                        '& .MuiOutlinedInput-root': {
                            height: '48px'
                        }
                    }}
                    rowSpacing={3}
                    columnSpacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="#666466" fontSize="14px" mb={1}>
                            Ngày
                        </Typography>
                        <DatePickerCustom />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="#666466" fontSize="14px" mb={1}>
                            Nhân viên
                        </Typography>
                        <Autocomplete
                            options={listNhanVien === undefined ? [] : listNhanVien.items}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Tất cả nhân viên"
                                    sx={{
                                        '& input': {
                                            padding: '0!important'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#666466" fontSize="14px" mb={1}>
                            Thời gian bắt đầu
                        </Typography>
                        <TextField type="time" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#666466" fontSize="14px" mb={1}>
                            Thời gian kết thúc
                        </Typography>
                        <TextField type="time" />
                    </Grid>
                </Grid>
                <Box display="flex" gap="8px" justifyContent="end" mt="40px">
                    <Button
                        size="small"
                        variant="contained"
                        className="btn-container-hover"
                        sx={{ bgcolor: '#7C3367' }}>
                        Lưu
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{ color: '#7C3367' }}>
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
export default ThemThoiGianChan;
