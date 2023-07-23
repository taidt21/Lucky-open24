import React from 'react';
import OverViewNew from './components/OverView/overViewNew';
import './dashboardNew.css';
import AppoimentsNew from './components/Appointment/AppointmentsNew';
import LineChartNew from './components/Charts/LineChartNew';
import ColumnChartNew from './components/Charts/ColumnChartNew';
import HotServicesNew from './components/Statistical/HotServicesNew';
import Box from '@mui/material/Box';

const Dashboard: React.FC = () => {
    const [month, setMonth] = React.useState('Tháng này');
    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };
    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                sx={{ padding: '0 2.2222222222222223vw', paddingTop: '1.6666666666666667vw' }}>
                <div className="page-header_col-1">
                    <div className="breadcrumb">Trang chủ</div>
                </div>
                {/* <Box>
                    <TextField
                        sx={{
                            backgroundColor: '#FFFAFF',
                            borderColor: '#CDC9CD',
                            height: '40px',
                            ml: '12px'
                        }}
                        size="small"
                        className="search-field"
                        variant="outlined"
                        placeholder="Tìm kiếm"
                        InputProps={{
                            startAdornment: (
                                <IconButton type="button">
                                    <img src={SearchIcon} />
                                </IconButton>
                            )
                        }}
                    />
                </Box> */}
            </Box>
            <div className="page-body">
                <div className="page-body_row-1">
                    <OverViewNew />
                </div>
                <div className="page-body_row-2">
                    <div className="page-body_row-2_col-1">
                        <h3>Danh sách cuộc hẹn hôm nay</h3>
                        <p>Cuộc hẹn mới nhất</p>
                        <AppoimentsNew />
                    </div>
                    <div className="page-body_row-2_col-2">
                        <h3>Tổng số cuộc hẹn hàng tuần</h3>
                        <LineChartNew />
                    </div>
                </div>
                <div className="page-body_row-3">
                    <div className="page-body_row-3_col-1">
                        <div className="page-body_row-3_col-1_row-1">
                            <div>
                                <h3>Doanh thu</h3>
                                <p>Doanh thu cửa hàng</p>
                            </div>
                            <div>
                                {/* <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={month}
                                            onChange={handleChange}>
                                            <MenuItem value="Tháng này">Tháng này</MenuItem>
                                            <MenuItem value="Tháng trước">Tháng trước</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box> */}
                            </div>
                        </div>
                        <div className="page-body_row-3_col-1_row-2">
                            <div>
                                <div className="danh-thu">36,2531.00</div>
                                <div className="doanh-thu-rario">(+1.37%)</div>
                            </div>
                            <div>
                                <div className="bar-tootilp">
                                    <div className="tootilp-item">
                                        <div className="tooltilp-dot"></div>
                                        <div className="tooltilp-text">Tuần này</div>
                                    </div>
                                    <div className="tootilp-item">
                                        <div className="tooltilp-dot"></div>
                                        <div className="tooltilp-text">Tuần trước</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ColumnChartNew />
                    </div>
                    <div className="page-body_row-3_col-2">
                        <h3>Top 5 dịch vụ hot</h3>
                        <HotServicesNew />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
