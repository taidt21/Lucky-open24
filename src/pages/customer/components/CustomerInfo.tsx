import React, { useState } from 'react';
import { Box, Tab, Typography, Button, IconButton, Tabs } from '@mui/material';

import { ReactComponent as ExportIcon } from '../../../images/download.svg';
import { ReactComponent as PrintIcon } from '../../../images/printer.svg';
import Avatar from '../../../images/xinh.png';
import { ReactComponent as EditIcon } from '../../../images/pencil-fiiled.svg';
import { ReactComponent as DeleteIcon } from '../../../images/the-bin.svg';
import { ReactComponent as EditUserIcon } from '../../../images/edituser.svg';
import TabInfor from './TabInfor';
import TabCuocHen from './TabCuocHen';
import TabMuaHang from './TabMuaHang';
import { ReactComponent as ArrowLeft } from '../../../images/arrow_back.svg';
interface Custom {
    onClose: () => void;
}
const CustomerInfo: React.FC<Custom> = ({ onClose }) => {
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </div>
        );
    };
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    return (
        <Box
            paddingLeft="2.2222222222222223vw"
            paddingRight="2.2222222222222223vw"
            paddingTop="1.5277777777777777vw"
            sx={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3" fontWeight="700" fontSize="16px" color="#333233">
                    Khách hàng
                </Typography>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset'
                        },
                        '& .btn-outline-hover': {
                            bgcolor: '#fff'
                        },
                        display: 'flex',
                        gap: '8px'
                    }}>
                    <Button
                        variant="outlined"
                        sx={{ color: '#666466' }}
                        className="btn-outline-hover"
                        startIcon={<PrintIcon />}>
                        In
                    </Button>
                    <Button
                        className="btn-outline-hover"
                        startIcon={<ExportIcon />}
                        variant="outlined"
                        sx={{ color: '#666466' }}>
                        Xuất
                    </Button>
                    <Button
                        className="btn-container-hover"
                        variant="contained"
                        sx={{ bgcolor: '#7C3367' }}>
                        Sao chép
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    bgcolor: '#fff',
                    padding: '24px',
                    pb: '0',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px 0px #AAA9B81A',
                    mt: '16px'
                }}>
                <Box sx={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <Box>
                        <Box
                            sx={{
                                '& img': {
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    height: '100px',
                                    width: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '6px'
                                }
                            }}>
                            <img src={Avatar} alt="avatar" />
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '& button': {
                                    padding: '4px'
                                }
                            }}>
                            <Typography
                                variant="h3"
                                color="#3B4758"
                                fontWeight="700"
                                fontSize="24px"
                                mr="12px">
                                Đinh Tuấn Tài
                            </Typography>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                            <IconButton>
                                <EditUserIcon />
                            </IconButton>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '30px',
                                mt: '12px',
                                '& p': {
                                    fontSize: '14px',
                                    color: '#333233',
                                    mt: '4px'
                                }
                            }}>
                            <Box>
                                <Typography sx={{ mt: '0' }} variant="body1">
                                    Nhóm khách :
                                </Typography>
                                <Typography variant="body1">Số điện thoại :</Typography>
                                <Typography variant="body1">Địa chỉ :</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ mt: '0' }} variant="body1">
                                    HD4545675
                                </Typography>
                                <Typography variant="body1">0911290476</Typography>
                                <Typography variant="body1">Ninh Bình</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{
                        mt: '20px',
                        '& button': {
                            textTransform: 'unset',
                            color: '#4C4B4C',
                            padding: '0',
                            pb: '12px',
                            minWidth: 'unset',
                            fontWeight: '400'
                        },
                        '& button.Mui-selected': {
                            color: '#7C3367'
                        },
                        '& .MuiTabs-indicator': {
                            bgcolor: '#7C3367'
                        },
                        '& .MuiTabs-flexContainer': {
                            gap: '32px'
                        }
                    }}>
                    <Tab label="Thông tin" />
                    <Tab label="Cuộc hẹn" />
                    <Tab label="Mua hàng" />
                </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
                <TabInfor />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TabCuocHen />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
                <TabMuaHang />
            </TabPanel>
            <Box
                sx={{
                    bgcolor: '#fff',
                    mt: 'auto',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    marginX: '-2.2222222222222223vw'
                }}>
                <Button
                    onClick={onClose}
                    sx={{ color: '#666466', ml: '32px' }}
                    className="btn-outline-hover"
                    variant="outlined"
                    startIcon={<ArrowLeft />}>
                    Quay trở lại
                </Button>
            </Box>
        </Box>
    );
};
export default CustomerInfo;
