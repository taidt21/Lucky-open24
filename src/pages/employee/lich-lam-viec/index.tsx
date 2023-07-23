import { Box, Typography, Grid, Button } from '@mui/material';
import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Calendar from './FullCalendar';
const LichLamViec: React.FC = () => {
    return (
        <Box>
            <Box sx={{ padding: '16px 2.2222222222222223vw' }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography variant="h1" color="#0C050A" fontSize="18px" fontWeight="700">
                            Lịch làm việc
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            <Button
                                sx={{
                                    minWidth: 'unset',
                                    bgcolor: 'unset!important',
                                    '&:hover svg': {
                                        color: '#7C3367'
                                    }
                                }}>
                                <MoreHorizIcon
                                    sx={{
                                        color: '#231F20'
                                    }}
                                />
                            </Button>
                            <Button variant="contained" className="btn-container-hover">
                                Thêm ca
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ borderTop: '1px solid #E6E1E6', mt: '18px', pt: '16px' }}>
                    <Calendar />
                </Box>
            </Box>
        </Box>
    );
};

export default LichLamViec;
