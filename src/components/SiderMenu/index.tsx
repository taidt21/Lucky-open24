/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { appRouters } from '../routers/index';
import './sider_menu.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import http from '../../services/httpService';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Box } from '@mui/material';
import outIcon from '../../images/Logout.svg';

interface Props {
    collapsed: boolean;
    toggle: () => void;
    onHoverChange: (isHovered: boolean) => void;
    CookieSidebar: boolean;
}
interface MenuItem {
    key: React.Key;
    icon?: React.ReactNode;
    iconActive?: React.ReactNode;
    children?: MenuItem[];
    label: React.ReactNode;
    type?: 'group';
}

function convertMenuItemsToMenu(menuItems: any[], listPermission: string[]): MenuItem[] {
    const menu: MenuItem[] = [];
    const routerMenu = menuItems.filter((x) => x.showInMenu === true);
    routerMenu.forEach((item) => {
        // Check if item has permission to be added to menu
        if (listPermission.includes(item.permission) || item.permission === '') {
            const menuItem: MenuItem = {
                key: item.path,
                label:
                    item.children.length > 0 ? (
                        item.title
                    ) : (
                        <Link to={item.path} title={item.title} style={{ textDecoration: 'none' }}>
                            {item.title}
                        </Link>
                    ),
                icon: item.icon,
                iconActive: item.iconActive,
                type: item.isLayout ? 'group' : undefined,
                children:
                    item.children.length > 0
                        ? convertMenuItemsToMenu(item.children, listPermission)
                        : undefined
            };
            menu.push(menuItem);
        }
    });
    return menu;
}
const AppSiderMenu: React.FC<Props> = ({ collapsed, toggle, onHoverChange, CookieSidebar }) => {
    const defaultPermission: string[] = [];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
    const navigate = useNavigate();
    const location = useLocation();
    const itemMenus = convertMenuItemsToMenu(mainAppRoutes, lstPermission);
    const getPermissions = () => {
        const userId = Cookies.get('userId');
        const token = Cookies.get('accessToken');
        const encryptedAccessToken = Cookies.get('encryptedAccessToken');
        if (userId !== undefined && userId !== null && token !== undefined && token !== null) {
            http.post(`api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`, {
                headers: {
                    accept: 'text/plain',
                    Authorization: 'Bearer ' + token,
                    'X-XSRF-TOKEN': encryptedAccessToken
                }
            })
                .then((response) => {
                    setListPermission(response.data.result['permissions']);
                    //Cookies.set('permissions', JSON.stringify(response.data.result['permissions']));
                    const item = {
                        value: response.data.result['permissions']
                    };
                    localStorage.setItem('permissions', JSON.stringify(item));
                })
                .catch((error) => console.log(error));
        }
        // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]') || [];
        // setListPermission(Array.isArray(permissions) ? permissions : [permissions]);
    };
    useEffect(() => {
        // Call API to get list of permissions here
        getPermissions();
    }, []);

    const [open, setOpen] = useState<{ [key: number]: boolean }>({});

    const handleDropdown = (index: number) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [index]: !prevOpen[index]
        }));
    };
    const [OpenHover, setOpenHover] = useState(false);

    const handleMouseEnter = () => {
        setOpenHover(true);
        onHoverChange(true);
    };

    const handleMouseLeave = () => {
        setOpenHover(false);
        onHoverChange(false);
    };

    return (
        <Box
            onMouseEnter={collapsed ? undefined : handleMouseEnter}
            onMouseLeave={collapsed ? undefined : handleMouseLeave}
            sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '100vh',
                position: 'fixed',
                transition: '.4s',
                left: '0',
                top: 0,
                bottom: 0,
                bgcolor: '#fff',
                zIndex: '20',
                width: collapsed || OpenHover ? '240px' : '72px',
                boxShadow: OpenHover ? '0px 0px 40px -12px rgba(124, 51, 103,0.3);' : 'unset',
                '& .MuiList-root': {
                    display: 'flex',

                    flexDirection: 'column'
                },
                '::-webkit-scrollbar-track': {
                    background: '#f1f1f1'
                },

                '::-webkit-scrollbar': {
                    width: '0px'
                },
                '::-webkit-scrollbar-thumb': {
                    borderRadius: '8px',
                    bgcolor: 'rgba(124, 51, 103,0.1)'
                }
            }}>
            <Box
                className="side-menu"
                sx={{
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                }}>
                <List
                    component="nav"
                    sx={{
                        minWidth: '218px',
                        marginTop: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        '& .Mui-selected': {
                            bgcolor: 'transparent!important'
                        }
                    }}>
                    {itemMenus.map((itemMenu, index) => (
                        <ListItem
                            key={itemMenu.key}
                            component={Link as React.ElementType}
                            to={
                                itemMenu.children && itemMenu.children.length > 0
                                    ? undefined
                                    : itemMenu.key
                            }
                            className={
                                location.pathname === itemMenu.key ||
                                itemMenu.children?.some(
                                    (dropdownItem) => location.pathname === dropdownItem.key
                                )
                                    ? 'nav-item active'
                                    : 'nav-item'
                            }
                            selected={location.pathname === itemMenu.key}
                            sx={{
                                flexWrap: 'wrap',
                                padding: '0'
                            }}>
                            <Box
                                component="button"
                                sx={{
                                    width: '100%',
                                    border: '0',
                                    display: 'flex',
                                    padding: '8px 14px',
                                    height: '40px',
                                    transition: '.4s',
                                    alignItems: 'center',
                                    backgroundColor:
                                        location.pathname === itemMenu.key ||
                                        itemMenu.children?.some(
                                            (dropdownItem) => location.pathname === dropdownItem.key
                                        )
                                            ? 'var(--color-bg)!important'
                                            : 'transparent',
                                    borderRadius: '8px',
                                    maxWidth: collapsed || OpenHover ? '500px' : '51px',
                                    maxHeight: collapsed || OpenHover ? '500px' : '51px',
                                    ':hover': {
                                        backgroundColor: 'var(--color-bg)!important'
                                    }
                                }}
                                onClick={
                                    itemMenu.children ? () => handleDropdown(index) : undefined
                                }>
                                <ListItemIcon
                                    sx={{
                                        minWidth: '40px',
                                        transition: '.4s',
                                        filter:
                                            location.pathname === itemMenu.key ||
                                            itemMenu.children?.some(
                                                (dropdownItem) =>
                                                    location.pathname === dropdownItem.key
                                            )
                                                ? 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(399%) hue-rotate(341deg) brightness(95%) contrast(87%)'
                                                : 'unset'
                                    }}>
                                    {location.pathname === itemMenu.key ||
                                    itemMenu.children?.some(
                                        (dropdownItem) => location.pathname === dropdownItem.key
                                    )
                                        ? itemMenu.iconActive
                                        : itemMenu.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={itemMenu.label}
                                    sx={{
                                        flex: 'unset!important',
                                        '& a': {
                                            fontSize: '16px',
                                            color:
                                                location.pathname === itemMenu.key ||
                                                itemMenu.children?.some(
                                                    (dropdownItem) =>
                                                        location.pathname === dropdownItem.key
                                                )
                                                    ? '#333233'
                                                    : '#3D475C',
                                            fontWeight:
                                                location.pathname === itemMenu.key ||
                                                itemMenu.children?.some(
                                                    (dropdownItem) =>
                                                        location.pathname === dropdownItem.key
                                                )
                                                    ? '500'
                                                    : '400'
                                        },
                                        transition: '.4s',
                                        left: collapsed || OpenHover ? '20%' : '50%',
                                        position: 'absolute',

                                        marginY: 0,
                                        paddingY: '4px',
                                        '& span': {
                                            fontSize: '16px',
                                            color:
                                                location.pathname === itemMenu.key ||
                                                itemMenu.children?.some(
                                                    (dropdownItem) =>
                                                        location.pathname === dropdownItem.key
                                                )
                                                    ? '#3B4758'
                                                    : '#3D475C',
                                            fontWeight:
                                                location.pathname === itemMenu.key ||
                                                itemMenu.children?.some(
                                                    (dropdownItem) =>
                                                        location.pathname === dropdownItem.key
                                                )
                                                    ? '700'
                                                    : '400'
                                        }
                                    }}
                                />
                                {itemMenu.children &&
                                    (open[index] ? (
                                        <ExpandLessIcon
                                            sx={{
                                                color: '#343234!important',
                                                ml: 'auto',
                                                transition: '.4s',
                                                position: 'relative',
                                                right: collapsed || OpenHover ? '0' : '-30px'
                                            }}
                                        />
                                    ) : (
                                        <ExpandMoreIcon
                                            sx={{
                                                color: '#343234!important',
                                                ml: 'auto',
                                                transition: '.4s',
                                                position: 'relative',
                                                right: collapsed || OpenHover ? '0' : '-30px'
                                            }}
                                        />
                                    ))}
                            </Box>
                            {itemMenu.children && (
                                <Box
                                    sx={{
                                        overflow: 'hidden',
                                        marginLeft: 'auto',
                                        width: '100%',
                                        position: 'relative',
                                        pl: '26px',
                                        left: collapsed || OpenHover ? ' 0' : '50px',
                                        transition: open[index]
                                            ? 'max-height 2.5s, left .4s,min-height .4s'
                                            : ' max-height 1s,left .4s,min-height .4s',
                                        maxHeight: open[index] == true ? '400px' : '0px',
                                        display: collapsed || OpenHover ? 'block' : 'none'
                                    }}>
                                    <List component="div" disablePadding>
                                        {itemMenu.children.map((dropdownItem) => (
                                            <ListItem
                                                key={dropdownItem.key}
                                                component={Link as React.ElementType}
                                                to={dropdownItem.key}
                                                selected={
                                                    location.pathname === dropdownItem.key ||
                                                    itemMenu.children?.some(
                                                        (dropdownItem) =>
                                                            location.pathname === dropdownItem.key
                                                    )
                                                }
                                                sx={{
                                                    backgroundColor: 'transparent!important',
                                                    padding: '2px'
                                                }}>
                                                <ListItemIcon
                                                    sx={{
                                                        '& svg': {
                                                            filter:
                                                                location.pathname ===
                                                                dropdownItem.key
                                                                    ? ' var(--color-hoverIcon)'
                                                                    : 'brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(100%) hue-rotate(251deg) brightness(97%) contrast(90%)'
                                                        },
                                                        minWidth: '20px'
                                                    }}>
                                                    {dropdownItem.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={dropdownItem.label}
                                                    sx={{
                                                        '& a': {
                                                            fontSize: '14px',
                                                            color:
                                                                location.pathname ===
                                                                dropdownItem.key
                                                                    ? 'var(--color-main)'
                                                                    : '#343234'
                                                        },
                                                        ':hover a': {
                                                            color: 'var(--color-main)'
                                                        }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};
export default AppSiderMenu;
