import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Avatar,
    Typography,
    Button,
    Select,
    MenuItem,
    ButtonGroup,
    SelectChangeEvent
} from '@mui/material';
import { ReactComponent as EditIcon } from '../../../images/edit-2.svg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as CalendarIcon } from '../../../images/calendar.svg';
import { ReactComponent as ListIcon } from '../../../images/list.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import CustomEmployee from './DialogCustom';
import ThemLich from './them_lich_lam_viec';
import Delete from './deleteAlert';
import Edit from './editNhanVien';
import { LichLamViecNhanVienDto } from '../../../services/nhan-vien/lich_lam_viec/dto/LichLamViecNhanVienDto';
import Cookies from 'js-cookie';
import lichLamViecStore from '../../../stores/lichLamViecStore';
import { observer } from 'mobx-react';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import SuggestService from '../../../services/suggests/SuggestService';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { SuggestChiNhanhDto } from '../../../services/suggests/dto/SuggestChiNhanhDto';
class Calendar extends Component {
    static contextType = ChiNhanhContext;
    state = {
        weekDates: [],
        data: [] as LichLamViecNhanVienDto[],
        filter: '',
        skipCount: 1,
        dateFrom: new Date(),
        maxResultCount: 10,
        dateSelected: new Date(),
        dateView: '',
        suggestNhanVien: [] as SuggestNhanSuDto[],
        idNhanVien: '',
        idLichLamViec: '',
        idChiNhanh: Cookies.get('IdChiNhanh'),
        totalPage: 0,
        totalCount: 0,
        anchorEl: null,
        selectedId: '',
        open: false,
        openDialog: false,
        openDelete: false,
        openEdit: false,
        value: '',
        employ: ''
    };
    componentDidMount() {
        this.getCurrentDateInVietnamese(new Date());
        this.getWeekDate(new Date());
        this.getData();
        this.getSuggestNhanVien();
    }
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
        const chiNhanhContext = this.context as SuggestChiNhanhDto;
        if (this.state.idChiNhanh !== chiNhanhContext.id) {
            // ChiNhanhContext has changed, update the component
            this.setState({
                idChiNhanh: chiNhanhContext.id
            });
            this.getData();
        }
    }
    getSuggestNhanVien = async () => {
        const result = await SuggestService.SuggestNhanSu();
        this.setState({ suggestNhanVien: result });
    };

    getWeekDate = (dateCurrent: Date) => {
        const firstDayOfWeek = new Date(
            dateCurrent.setDate(dateCurrent.getDate() - dateCurrent.getDay() + 1)
        );

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(date.getDate() + i);
            const formattedDate = this.formatDate(date);
            dates.push(formattedDate);
        }

        this.setState({ weekDates: dates });
    };

    getData = async () => {
        const chiNhanhContext = this.context as SuggestChiNhanhDto;
        await lichLamViecStore.getLichLamViecNhanVienWeek({
            dateFrom: this.state.dateFrom,
            dateTo: this.state.dateFrom,
            idChiNhanh: chiNhanhContext.id,
            keyword: this.state.filter,
            skipCount: this.state.skipCount,
            maxResultCount: this.state.maxResultCount,
            idNhanVien: this.state.employ === '' ? undefined : this.state.employ
        });

        this.setState({
            data: lichLamViecStore.listLichLamViec.items,
            totalPage: lichLamViecStore.listLichLamViec.totalPage,
            totalCount: lichLamViecStore.listLichLamViec.totalCount,
            idChiNhanh: chiNhanhContext.id
        });
    };

    handleFilterChange = (event: any) => {
        this.setState({ filter: event.target.value }, () => this.getData());
    };

    handleDateChange = (event: any) => {
        this.setState({ dateSelected: new Date(event.target.value) }, () => {
            this.getCurrentDateInVietnamese(this.state.dateSelected);
            this.getWeekDate(this.state.dateSelected);
            this.getData();
        });
    };

    getCurrentDateInVietnamese = (date: Date) => {
        const daysOfWeek = [
            'Chủ nhật',
            'Thứ hai',
            'Thứ ba',
            'Thứ tư',
            'Thứ năm',
            'Thứ sáu',
            'Thứ bảy'
        ];
        const monthsOfYear = [
            'tháng 1',
            'tháng 2',
            'tháng 3',
            'tháng 4',
            'tháng 5',
            'tháng 6',
            'tháng 7',
            'tháng 8',
            'tháng 9',
            'tháng 10',
            'tháng 11',
            'tháng 12'
        ];

        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();

        const formattedDate = `${dayOfWeek},  ${dayOfMonth} ${month}, năm ${year}`;
        //const formattedDate = formatter.format(date);
        this.setState({ dateView: formattedDate });
    };

    formatDate = (date: Date) => {
        // const year = date.getFullYear();
        // let month = (date.getMonth() + 1).toString();
        // let day = date.getDate().toString();
        // month = month.length === 1 ? '0' + month : month;
        // day = day.length === 1 ? '0' + day : day;

        const day = date.toLocaleDateString('vi', { weekday: 'long' });
        const month = date.toLocaleDateString('vi', { month: 'long' });
        const dayOfMonth = date.getDate();
        return (
            <>
                <Box sx={{ fontWeight: '400', fontSize: '12px' }}>{day}</Box>
                <div>
                    {dayOfMonth} {month}
                </div>
            </>
        );
    };

    handlePreviousWeek = () => {
        const datePreviousWeek = new Date(this.state.dateSelected);
        datePreviousWeek.setDate(datePreviousWeek.getDate() - 7);
        this.setState({ dateSelected: datePreviousWeek }, () => {
            this.getCurrentDateInVietnamese(this.state.dateSelected);
            this.getWeekDate(this.state.dateSelected);
            this.getData();
        });
    };

    handleNextWeek = () => {
        const dateNextWeek = new Date(this.state.dateSelected);
        dateNextWeek.setDate(dateNextWeek.getDate() + 7);
        this.setState({ dateSelected: dateNextWeek }, () => {
            this.getCurrentDateInVietnamese(this.state.dateSelected);
            this.getWeekDate(this.state.dateSelected);
            this.getData();
        });
    };
    toDayClick = async () => {
        const newDate = new Date();
        lichLamViecStore.updateDate(newDate);
        this.setState({ dateSelected: newDate }, () => {
            this.getCurrentDateInVietnamese(this.state.dateSelected);
            this.getWeekDate(this.state.dateSelected);
            this.getData();
        });
    };
    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, anchorEl: null });
    };

    handleDialogOpen = () => {
        this.setState({ openDialog: true });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

    handleDeleteOpen = () => {
        this.setState({ openDelete: true });
    };

    handleDeleteClose = () => {
        this.setState({ openDelete: false });
    };

    handleEditOpen = () => {
        this.setState({ openEdit: true });
    };

    handleEditClose = () => {
        this.setState({ openEdit: false });
    };

    handlePageChange = async (event: any, pageNumber: number) => {
        await this.setState({ skipCount: pageNumber }, () => this.getData());
        this.getData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            skipCount: 1,
            maxResultCount: parseInt(event.target.value.toString(), 10)
        });

        this.getData();
    };
    handleEmployeeChange = (event: any) => {
        this.setState({ employ: event.target.value }, () => this.getData());
    };
    handleOpenCustom = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            anchorEl: event.currentTarget,
            selectedId: event.currentTarget.className
        });
    };
    render(): React.ReactNode {
        return (
            <Box>
                <CustomEmployee
                    open={this.state.open}
                    handleClose={this.handleClose}
                    anchorEl={this.state.anchorEl}
                    selectedRowId={this.state.selectedId}
                    handleOpenDelete={this.handleDeleteOpen}
                    handleOpenDialog={this.handleDialogOpen}
                    handleCloseDialog={this.handleDialogClose}
                    handleOpenEdit={this.handleEditOpen}
                />
                <Edit
                    open={this.state.openEdit}
                    onClose={this.handleEditClose}
                    openEditLich={() => undefined}
                />
                <Delete open={this.state.openDelete} onClose={this.handleDeleteClose} />
                <ThemLich open={this.state.openDialog} onClose={this.handleDialogClose} />
                <Box mb="16px" display="flex" justifyContent="space-between">
                    <Box>
                        <Select
                            onChange={this.handleEmployeeChange}
                            value={this.state.employ}
                            displayEmpty
                            size="small"
                            sx={{
                                '& svg': {
                                    position: 'relative',
                                    left: '-10px'
                                },
                                bgcolor: '#fff',
                                '[aria-expanded="true"] ~ svg': {
                                    transform: 'rotate(180deg)'
                                }
                            }}
                            IconComponent={() => <ArrowDown />}>
                            <MenuItem value="">Tất cả nhân viên</MenuItem>
                            {this.state.suggestNhanVien.map((item) => {
                                return (
                                    <MenuItem value={item.id} key={item.id}>
                                        {item.tenNhanVien}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                    <Box
                        display="flex"
                        sx={{
                            '& button:not(.btn-to-day)': {
                                minWidth: 'unset',
                                borderColor: '#E6E1E6',
                                bgcolor: '#fff!important',
                                px: '7px!important'
                            },
                            '& svg': {
                                color: '#666466!important'
                            },
                            alignItems: 'center'
                        }}>
                        <Button
                            variant="outlined"
                            sx={{ mr: '16px' }}
                            onClick={() => {
                                this.handlePreviousWeek();
                                this.getData();
                            }}
                            className="btn-outline-hover">
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            className="btn-to-day"
                            variant="text"
                            onClick={() => {
                                this.toDayClick();
                                this.getData();
                            }}
                            sx={{
                                color: '#7C3367!important',
                                fontSize: '16px!important',
                                textTransform: 'unset!important',
                                bgcolor: 'transparent!important',
                                fontWeight: '400',
                                paddingX: '0',
                                pb: '10px',
                                mr: '20px'
                            }}>
                            Hôm nay
                        </Button>
                        <Typography variant="h3" color="#333233" fontSize="16px" fontWeight="700">
                            {this.state.dateView}
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{ ml: '16px' }}
                            className="btn-outline-hover"
                            onClick={() => {
                                this.handleNextWeek();
                                this.getData();
                            }}>
                            <ChevronRightIcon />
                        </Button>
                    </Box>
                    <Box display="flex" alignItems="center" gap="8px">
                        <ButtonGroup
                            variant="outlined"
                            sx={{
                                '& button': {
                                    minWidth: 'unset!important',
                                    paddingX: '6px!important',
                                    height: '32px',
                                    borderColor: '#E6E1E6!important'
                                }
                            }}>
                            <Button className="btn-outline-hover" sx={{ mr: '1px' }}>
                                <CalendarIcon />
                            </Button>
                            <Button className="btn-outline-hover">
                                <ListIcon />
                            </Button>
                        </ButtonGroup>
                        <Select
                            // onChange={this.c}
                            // value={value}
                            IconComponent={() => <ArrowDown />}
                            displayEmpty
                            size="small"
                            sx={{
                                '& .MuiSelect-select': {
                                    lineHeight: '32px',
                                    p: '0',
                                    height: '32px',
                                    pl: '10px'
                                },
                                bgcolor: '#fff',
                                '& svg': {
                                    position: 'relative',
                                    left: '-10px',
                                    width: '20px',
                                    height: '20px'
                                },
                                '[aria-expanded="true"] ~ svg': {
                                    transform: 'rotate(180deg)'
                                }
                            }}>
                            <MenuItem value="">Tuần</MenuItem>
                            <MenuItem value="Tháng">Tháng</MenuItem>
                            <MenuItem value="Năm">Năm</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow
                                sx={{
                                    '& .MuiTableCell-root': {
                                        paddingTop: '8px',
                                        paddingLeft: '4px',
                                        paddingRight: '4px'
                                    }
                                }}>
                                <TableCell sx={{ border: 'none' }}>Nhân viên</TableCell>
                                {this.state.weekDates.map((date, index) => (
                                    <TableCell key={index}>{date}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody
                            sx={{
                                '& .custom-time': {
                                    fontFamily: 'Roboto',
                                    height: '32px',
                                    bgcolor: '#F2EBF0',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    fontSize: '12px',
                                    color: '#333233'
                                },
                                '& .bodder-inline': {
                                    borderInline: '1px solid #E6E1E6',
                                    padding: '4px 4px 20px 4px'
                                }
                            }}>
                            {this.state.data.map((item) => (
                                <TableRow key={item.tenNhanVien.replace(/\s/g, '')}>
                                    <TableCell sx={{ border: '0!important' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                            <Avatar
                                                sx={{ width: 32, height: 32 }}
                                                src={item.avatar}
                                                alt={item.tenNhanVien}
                                            />
                                            <Box>
                                                <Typography
                                                    fontSize="14px"
                                                    color="#4C4B4C"
                                                    variant="body1">
                                                    {item.tenNhanVien}
                                                </Typography>
                                                <Typography
                                                    fontSize="12px"
                                                    color="#999699"
                                                    variant="body1">
                                                    {item.tongThoiGian}h
                                                </Typography>
                                            </Box>
                                            <Button
                                                onClick={() => {
                                                    this.setState({
                                                        idNhanVien: item.idNhanVien,
                                                        idLichLamViec: item.id
                                                    });
                                                    //this.handleOpenCustom;
                                                }}
                                                variant="text"
                                                sx={{
                                                    minWidth: 'unset',
                                                    ml: 'auto',
                                                    '&:hover svg': {
                                                        filter: 'brightness(0) saturate(100%) invert(23%) sepia(23%) saturate(1797%) hue-rotate(267deg) brightness(103%) contrast(88%)'
                                                    }
                                                }}>
                                                <EditIcon />
                                            </Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.monday == '' || item.monday == null
                                                ? 'Trống'
                                                : item.monday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.tuesday == '' || item.tuesday == null
                                                ? 'Trống'
                                                : item.tuesday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.wednesday == '' || item.wednesday == null
                                                ? 'Trống'
                                                : item.wednesday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.thursday == '' || item.thursday == null
                                                ? 'Trống'
                                                : item.thursday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.friday == '' || item.friday == null
                                                ? 'Trống'
                                                : item.friday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.saturday == '' || item.saturday == null
                                                ? 'Trống'
                                                : item.saturday}
                                        </Box>
                                    </TableCell>
                                    <TableCell className="bodder-inline">
                                        <Box className="custom-time">
                                            {item.sunday == '' || item.sunday == null
                                                ? 'Trống'
                                                : item.sunday}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <CustomTablePagination
                    currentPage={this.state.skipCount}
                    rowPerPage={this.state.maxResultCount}
                    totalRecord={lichLamViecStore.totalCount}
                    totalPage={lichLamViecStore.totalPage}
                    handlePerPageChange={this.handlePerPageChange}
                    handlePageChange={this.handlePageChange}
                />
            </Box>
        );
    }
}
export default observer(Calendar);
