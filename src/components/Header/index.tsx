import { useEffect, useState } from 'react';
// import avatar from '../../images/user.png';
import avatar from '../../images/xinh.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
    Grid,
    Box,
    Typography,
    Select,
    MenuItem,
    Menu,
    Button,
    Badge,
    Avatar,
    IconButton,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import './header.css';
import { ReactComponent as LogoNew } from '../../images/logoNew.svg';
// import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
import { ReactComponent as SuportIcon } from '../../images/messageChat.svg';
import * as React from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from '../../images/notification.svg';
import Cookies from 'js-cookie';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import chiNhanhService from '../../services/chi_nhanh/chiNhanhService';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ReactComponent as LocationIcon } from '../../images/location.svg';
import { ReactComponent as ProfileIcon } from '../../images/profile-circle.svg';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as LogoutIcon } from '../../images/logoutInner.svg';
import { ReactComponent as RestartIcon } from '../../images/restart_alt.svg';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import CakeIcon from '../../images/cake.svg';
import avatarThongBao from '../../images/xinh.png';
import useWindowWidth from '../StateWidth';
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
    isChildHovered: boolean;
    CookieSidebar: boolean;
    handleChangeChiNhanh: (currentChiNhanh: SuggestChiNhanhDto) => void;
}

const Header: React.FC<HeaderProps> = (
    { collapsed, toggle, isChildHovered, handleChangeChiNhanh },
    props: HeaderProps
) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [ThongBaoAnchorEl, setThongBaoAnchorEl] = React.useState<null | HTMLElement>(null);
    const [settingThongBao, setSettingThongBao] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openThongBao = Boolean(ThongBaoAnchorEl);
    const openSettingThongBao = Boolean(settingThongBao);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleThongBaoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setThongBaoAnchorEl(event.currentTarget);
    };
    const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSettingThongBao(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseThongBao = () => {
        setThongBaoAnchorEl(null);
    };
    const CloseSettingThongBao = () => {
        setSettingThongBao(null);
    };

    const [chiNhanhs, setListChiNhanh] = useState([] as SuggestChiNhanhDto[]);
    const [currentChiNhanh, setCurrentChiNhanh] = useState('');
    useEffect(() => {
        // Call API to get list of permissions here

        const getChiNhanhs = async () => {
            if (Cookies.get('accessToken') !== null && Cookies.get('accessToken') !== undefined) {
                const listChiNhanh = await chiNhanhService.GetChiNhanhByUser();
                if (listChiNhanh != null && listChiNhanh.length > 0) {
                    setListChiNhanh(listChiNhanh);

                    if (
                        Cookies.get('IdChiNhanh') === undefined ||
                        Cookies.get('IdChiNhanh') === ''
                    ) {
                        const idChiNhanh = listChiNhanh[0].id;
                        const tenChiNhanh = listChiNhanh[0].tenChiNhanh;

                        setCurrentChiNhanh(idChiNhanh);
                        const remember = Cookies.get('isRememberMe');
                        Cookies.set('IdChiNhanh', idChiNhanh, {
                            expires: remember === 'true' ? 1 : undefined
                        });
                        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
                    } else {
                        const idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
                        setCurrentChiNhanh(idChiNhanh);
                        // todo tenChiNhanh
                        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: '' });
                    }
                }
            }
        };
        getChiNhanhs();
    }, []);

    const changeChiNhanh = (e: any, item: any) => {
        const idChiNhanh = item.props.value;
        const tenChiNhanh = item.props.children;
        setCurrentChiNhanh(idChiNhanh);
        const remember = Cookies.get('isRememberMe');
        Cookies.set('IdChiNhanh', idChiNhanh, {
            expires: remember === 'true' ? 1 : undefined
        });
        //window.location.reload();
        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
    };
    const dataThongBao = [
        {
            title: '2 khách hàng sinh nhật hôm nay',
            description: 'Khách hàng Lương Tuệ Nhi và Hồng có sinh nhật hôm nay.',
            image: CakeIcon,
            time: '30min'
        },
        {
            title: 'Phan Thị Quỳnh',
            description: 'Đã đặt lịch uốn tóc với Tài Đinh',
            image: avatarThongBao,
            time: '1day'
        },
        {
            title: 'Lê Nữ Quỳnh Nho',
            description: 'Đã thanh toán hóa đơn',
            image: avatarThongBao,
            time: '8h'
        }
    ];
    const dataSettingThongBao = [
        {
            title: 'Lịch hẹn',
            option: ['Lịch hẹn mới', 'Cập nhật lịch hẹn']
        },
        {
            title: 'Hoạt động',
            option: ['Sản phẩm', 'Sinh nhật khách hàng', 'Khách Đánh giá']
        }
    ];
    // kéo thả nút

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
        x: useWindowWidth() - 120,
        y: window.innerHeight - 90
    });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: any) => {
                setPosition((prevPosition) => ({
                    x: e.clientX - startPosition.x,
                    y: e.clientY - startPosition.y
                }));
            };

            document.addEventListener('mousemove', handleMouseMove);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isDragging, startPosition]);
    const handleMouseDown = (e: any) => {
        setIsDragging(true);
        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <Box
            display="flex"
            className="header"
            sx={{ position: 'fixed', right: '0', top: '0', zIndex: 20 }}>
            {' '}
            <Grid container className={'header-container'} justifyContent="space-between">
                <Grid item sx={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <Box display="flex" gap="8px" marginLeft="16px">
                        <LogoNew />
                        <Typography
                            fontFamily="vinhan"
                            color="var(--color-main)"
                            fontSize="18px"
                            sx={{
                                opacity: collapsed && !isChildHovered ? '0' : '1',
                                transform:
                                    collapsed && !isChildHovered
                                        ? 'translateX(-40px)'
                                        : 'translateX(0)',
                                transition: '.4s'
                            }}>
                            Lucky Beauty
                        </Typography>
                    </Box>
                    <Button
                        sx={{
                            minWidth: 'unset!important',
                            marginLeft: collapsed && !isChildHovered ? '-116px' : '0',
                            backgroundColor: 'unset!important',
                            transition: '.4s',
                            ':hover': {
                                backgroundColor: 'unset!important'
                            },
                            ':hover .icon1': {
                                color: 'rgba(49, 157, 255, 1)!important'
                            },
                            ':hover .icon2': {
                                color: 'rgba(49, 157, 255, 0.7)'
                            },
                            '& .MuiTouchRipple-root': {
                                display: 'none'
                            },
                            transform:
                                collapsed && !isChildHovered ? 'rotate(-180deg)' : 'rotate(0deg)'
                        }}
                        onClick={toggle}>
                        <ArrowBackIosIcon
                            className="icon1"
                            sx={{ color: 'rgba(49, 157, 255, 0.7)', fontSize: '16px' }}
                        />
                        <ArrowBackIosIcon
                            className="icon2"
                            sx={{
                                color: 'rgba(49, 157, 255, 0.4)',
                                fontSize: '16px',
                                marginLeft: '-8px'
                            }}
                        />
                    </Button>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }}>
                    <Box display="flex" sx={{ marginRight: '30px', alignItems: 'center' }}>
                        <Box display="flex">
                            <LocationIcon />
                            <Select
                                sx={{
                                    ml: '10px',
                                    border: 'none!important',
                                    '& *': {
                                        border: '0!important'
                                    },
                                    '& .MuiSelect-select': {
                                        padding: '0',
                                        fontSize: '14px'
                                    },
                                    '&:hover': {
                                        color: 'var(--color-main)'
                                    }
                                }}
                                size="small"
                                value={currentChiNhanh}
                                onChange={(e, item) => changeChiNhanh(e, item)}>
                                {chiNhanhs.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.tenChiNhanh}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>

                        <Badge
                            color="error"
                            variant="dot"
                            sx={{
                                '& .MuiBadge-dot.MuiBadge-badge': {
                                    top: '5px!important',
                                    right: '5px!important'
                                }
                            }}>
                            <Button
                                id="btnThongBao"
                                onClick={handleThongBaoClick}
                                aria-controls={openThongBao ? 'thongBao' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openThongBao ? 'true' : undefined}
                                sx={{
                                    padding: '0',
                                    bgcolor: 'transparent!important',
                                    minWidth: 'unset!important',
                                    '&:hover img': {
                                        filter: 'var(--color-hoverIcon)'
                                    }
                                }}>
                                <img src={NotificationIcon} alt="notification" />
                            </Button>
                        </Badge>
                        <Menu
                            open={openThongBao}
                            id="thongBao"
                            anchorEl={ThongBaoAnchorEl}
                            onClose={handleCloseThongBao}
                            MenuListProps={{
                                'aria-labelledby': 'btnThongBao'
                            }}
                            sx={{
                                '& ul': { width: '400px' }
                            }}>
                            <MenuItem
                                sx={{
                                    cursor: 'auto!important',
                                    bgcolor: 'transparent!important',
                                    '&> .MuiTouchRipple-root': {
                                        display: 'none'
                                    }
                                }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '18px 0',
                                        borderBottom: '1px solid #F2F2F2'
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '3px',
                                            aignItems: 'center'
                                        }}>
                                        <Typography
                                            variant="body1"
                                            color="#4C4B4C"
                                            fontWeight="700">
                                            Thông báo
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                bgcolor: '#F1416C',
                                                color: '#fff',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                lineHeight: '16px',
                                                margin: 'auto'
                                            }}>
                                            4
                                        </Box>
                                    </Box>
                                    <IconButton
                                        onClick={handleSettingClick}
                                        sx={{
                                            '&:hover svg': {
                                                filter: 'var(--color-hoverIcon)'
                                            }
                                        }}>
                                        <SettingIcon />
                                    </IconButton>
                                </Box>
                            </MenuItem>
                            {dataThongBao.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={handleCloseThongBao}
                                    sx={{ whiteSpace: 'normal' }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',

                                            gap: '10px',
                                            paddingY: '16px',
                                            borderBottom: '1px solid #F2F2F2'
                                        }}>
                                        <Box
                                            sx={{
                                                '& img': {
                                                    height: '32px',
                                                    width: '32px',
                                                    borderRadius: index === 0 ? '0' : '50%'
                                                }
                                            }}>
                                            <img src={item.image} alt="image" />
                                        </Box>
                                        <Box sx={{ maxWidth: '75%' }}>
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                fontWeight="500"
                                                color="#4C4B4C">
                                                {item.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="#666466"
                                                fontSize="14px">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                marginLeft: 'auto',
                                                fontSize: '10px',
                                                color: '#666466',
                                                fontWeight: '300'
                                            }}>
                                            {item.time}
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                            <MenuItem
                                sx={{
                                    cursor: 'auto!important',
                                    bgcolor: 'transparent!important',
                                    '&> .MuiTouchRipple-root': {
                                        display: 'none'
                                    }
                                }}>
                                <Button variant="text" sx={{ color: '#319DFF', margin: 'auto' }}>
                                    Xem tất cả
                                </Button>
                            </MenuItem>
                        </Menu>
                        <Menu
                            id="setting-thongbao"
                            anchorEl={settingThongBao}
                            open={openSettingThongBao}
                            onClose={CloseSettingThongBao}
                            sx={{
                                '& ul': {
                                    width: '400px'
                                },
                                '& li': {
                                    bgcolor: 'transparent!important',
                                    cursor: 'auto!important'
                                },
                                '& li > .MuiTouchRipple-root': {
                                    display: 'none'
                                }
                            }}>
                            <MenuItem>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        '& button:hover svg': {
                                            filter: 'var(--color-hoverIcon)'
                                        }
                                    }}>
                                    <Typography
                                        color="#4C4B4C"
                                        variant="body1"
                                        fontSize="16px"
                                        fontWeight="700">
                                        Thiết lập thông báo
                                    </Typography>
                                    <Box>
                                        <IconButton>
                                            <RestartIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={CloseSettingThongBao}
                                            sx={{
                                                '& svg': {
                                                    width: '16px',
                                                    height: '16px'
                                                }
                                            }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </MenuItem>
                            {dataSettingThongBao.map((item, index) => (
                                <MenuItem key={index}>
                                    <Box>
                                        <Typography
                                            variant="body1"
                                            fontSize="12px"
                                            fontWeight="500"
                                            color="#4C4B4C">
                                            {item.title}
                                        </Typography>
                                        <FormGroup>
                                            {item.option.map((label, indexChild) => (
                                                <FormControlLabel
                                                    sx={{
                                                        '& .Mui-checked': {
                                                            color: 'var(--color-main)!important'
                                                        }
                                                    }}
                                                    key={indexChild}
                                                    control={<Checkbox />}
                                                    label={
                                                        <Typography
                                                            variant="body1"
                                                            fontSize="12px"
                                                            fontWeight="400"
                                                            color="#333233">
                                                            {' '}
                                                            {label}
                                                        </Typography>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: '#CDC9CD',
                                            borderColor: '#CDC9CD',
                                            bgcolor: '#fff'
                                        }}
                                        className="btn-outline-hover">
                                        Đặt lại
                                    </Button>
                                    <Button
                                        onClick={CloseSettingThongBao}
                                        variant="contained"
                                        fullWidth
                                        className="btn-container-hover"
                                        sx={{ color: '#fff', bgcolor: 'var(--color-main)' }}>
                                        Áp dụng
                                    </Button>
                                </Box>
                            </MenuItem>
                        </Menu>

                        <Button
                            id="btnAuthor"
                            aria-controls={open ? 'author' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ pr: '25px', mr: '-20px' }}>
                            <Avatar src={avatar} sx={{ height: 36, width: 36 }} alt={'profile'} />
                        </Button>

                        <Menu
                            open={open}
                            id="author"
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'btnAuthor'
                            }}
                            sx={{
                                '& .typo': {
                                    color: '#4C4B4C',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    bgcolor: 'transparent',
                                    border: '0'
                                },
                                '& a': {
                                    display: 'flex',
                                    gap: '16px'
                                },
                                '& .hover:hover button': {
                                    color: 'var(--color-main)'
                                },
                                '& .hover:hover svg': {
                                    filter: 'var(--color-hoverIcon)'
                                }
                            }}>
                            <MenuItem>
                                <Box sx={{ display: 'flex', gap: '12px' }}>
                                    <Avatar
                                        src={avatar}
                                        alt="avatar"
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box
                                        sx={{
                                            '& h2': {
                                                fontWeight: '700',
                                                color: '#333233',
                                                fontSize: '16px',
                                                marginBottom: '0'
                                            },
                                            '& p': {
                                                color: '#666466',
                                                fontSize: '12px'
                                            }
                                        }}>
                                        <Box component="h2">Nail salon</Box>
                                        <Box component="p">nailsalon@mail.com</Box>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={handleClose} className="hover">
                                <Link
                                    to="/account/profile"
                                    style={{ textDecoration: 'none', listStyle: 'none' }}>
                                    <ProfileIcon />
                                    <Box component="button" className="typo">
                                        {' '}
                                        Hồ sơ{' '}
                                    </Box>
                                </Link>
                            </MenuItem>
                            <MenuItem className="hover">
                                <Box component="a" sx={{ textDecoration: 'none' }}>
                                    <SettingIcon />
                                    <Box component="button" className="typo">
                                        Cài đặt
                                    </Box>
                                </Box>
                            </MenuItem>

                            <MenuItem onClick={handleClose} className="hover">
                                <Link
                                    to="/login"
                                    style={{ textDecoration: 'none', listStyle: 'none' }}
                                    onClick={() => {
                                        Object.keys(Cookies.get()).forEach((cookieName) => {
                                            if (cookieName !== 'TenantName') {
                                                Cookies.remove(cookieName);
                                            }
                                        });
                                        localStorage.clear();
                                    }}>
                                    <LogoutIcon />
                                    <Box component="button" className="typo">
                                        {' '}
                                        Đăng xuất{' '}
                                    </Box>
                                </Link>
                            </MenuItem>
                        </Menu>
                        {!open && <ExpandMoreIcon />}
                        {open && <ExpandLessIcon />}
                    </Box>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                sx={{
                    position: 'fixed',
                    transition: '.1s',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: '48px',
                    height: '48px',
                    paddingX: '12px!important',
                    minWidth: 'unset',
                    borderRadius: '50%',
                    bgcolor: 'var(--color-main)!important',
                    '& svg': {
                        width: '24px',
                        height: '24px'
                    }
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                <SuportIcon />
            </Button>
        </Box>
    );
};
export default Header;
