import { Box, Button, Grid, Typography, Select, Tooltip } from '@mui/material';
import React, { Component, ReactNode, RefObject } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '../../images/add.svg';
import { AiOutlineBars, AiOutlineCalendar } from 'react-icons/ai';
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import bookingServices from '../../services/dat-lich/datLichService';
import '../../custom.css';
import '../lich-hen/calendar.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ReactComponent as SettingIcon } from '../../images/setting-00.svg';
import { SuggestNhanVienDichVuDto } from '../../services/suggests/dto/SuggestNhanVienDichVuDto';
import { SuggestKhachHangDto } from '../../services/suggests/dto/SuggestKhachHangDto';
import SuggestService from '../../services/suggests/SuggestService';
import Cookies from 'js-cookie';
import CreateOrEditLichHenModal from './components/create-or-edit-lich-hen';
import abpCustom from '../../components/abp-custom';
import { SuggestDichVuDto } from '../../services/suggests/dto/SuggestDichVuDto';
class LichHenScreen extends Component {
    calendarRef: RefObject<FullCalendar> = React.createRef();
    state = {
        initialView: 'timeGridWeek',
        viewDate: format(new Date(), 'EEEE, dd MMMM ,yyyy', { locale: vi }),
        modalVisible: false,
        events: [],
        idBooking: '',
        suggestNhanVien: [] as SuggestNhanVienDichVuDto[],
        suggestKhachHang: [] as SuggestKhachHangDto[],
        suggestDichVu: [] as SuggestDichVuDto[]
    };
    async componentDidMount() {
        this.getData();
        const suggestNhanViens = await SuggestService.SuggestNhanVienLamDichVu();
        const suggestKhachHangs = await SuggestService.SuggestKhachHang();
        const suggestDichVus = await SuggestService.SuggestDichVu();
        this.setState({
            suggestNhanVien: suggestNhanViens,
            suggestDichVu: suggestDichVus,
            suggestKhachHang: suggestKhachHangs
        });
    }
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh');
        const appointments = await bookingServices.getAllBooking({
            idChiNhanh: idChiNhanh ?? '',
            typeView: 'month',
            dateSelected: new Date()
        });
        const lstEvent: any[] = [];
        appointments.map((event) => {
            lstEvent.push({
                id: event.sourceId,
                title: event.customer,
                start: event.bookingDate,
                end: event.bookingDate,
                color: event.color !== '' && event.color != null ? event.color : '#F1FAFF',
                textColor: event.color !== '' && event.color != null ? event.color : '#009EF7',
                borderColor: event.color !== '' && event.color != null ? event.color : '#009EF7'
            });
        });
        this.setState({
            events: lstEvent
        });
    }
    // handleChangeViewCalendar = (value: { value: string; label: React.ReactNode }) => {
    //     const calendarApi = this.calendarRef.current?.getApi();
    //     calendarApi?.changeView(value.value);
    // };
    handleChangeViewCalendar = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        const calendarApi = this.calendarRef.current?.getApi();
        calendarApi?.changeView(selectedValue);
        // calendarApi?.updateSize();
    };

    changeHeaderToolbar = (value: string) => {
        const calendarApi = this.calendarRef.current?.getApi();
        if (calendarApi) {
            if (value === 'prev') {
                calendarApi.prev();
                if (calendarApi.view.type === 'timeGridDay') {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'EEEE, dd MMMM ,yyyy', {
                            locale: vi
                        })
                    });
                } else {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'MMMM ,yyyy', { locale: vi })
                    });
                }
            } else if (value === 'next') {
                calendarApi.next();
                if (calendarApi.view.type === 'timeGridDay') {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'EEEE, dd MMMM ,yyyy', {
                            locale: vi
                        })
                    });
                } else {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'MMMM ,yyyy', { locale: vi })
                    });
                }
            } else if (value === 'today') {
                calendarApi.today();
                this.setState({
                    viewDate: format(new Date(), 'EEEE, dd MMMM ,yyyy', { locale: vi })
                });
            }
        }
        this.getData();
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(entityDto: string) {
        this.setState({ idBooking: entityDto });
        this.Modal();
    }
    handleSubmit = async () => {
        await this.getData();
        this.setState({ modalVisible: false });
    };

    render(): ReactNode {
        return (
            <Box sx={{ height: '100%', padding: '0 2.2222222222222223vw' }}>
                <Box sx={{ borderBottom: '1px solid #E6E1E6', paddingBottom: '24px' }}>
                    <Grid container justifyContent="space-between" sx={{ paddingTop: '22px' }}>
                        <Grid item xs={6}>
                            <Typography
                                marginTop="4px"
                                color="#0C050A"
                                fontSize="16px"
                                variant="h5"
                                fontWeight="700">
                                Lịch hẹn
                            </Typography>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap="8px">
                                    <Button
                                        className="btn-outline-hover"
                                        variant="outlined"
                                        onClick={() => {
                                            console.log('ok');
                                        }}
                                        sx={{
                                            bgcolor: '#fff!important',
                                            borderColor: '#E6E1E6',
                                            minWidth: '40px',
                                            height: '40px',
                                            width: '40px',

                                            padding: '0'
                                        }}>
                                        <SettingIcon color="#231F20" />
                                    </Button>
                                    <Button
                                        className="btn-outline-hover"
                                        variant="outlined"
                                        startIcon={
                                            <img
                                                style={{
                                                    filter: ' brightness(0) saturate(100%) invert(29%) sepia(0%) saturate(1880%) hue-rotate(350deg) brightness(101%) contrast(97%)'
                                                }}
                                                src={AddIcon}
                                            />
                                        }
                                        sx={{
                                            textTransform: 'unset!important',
                                            height: '40px',
                                            color: '#4C4B4C',
                                            fontWeight: '400',
                                            borderColor: '#E6E1E6',
                                            bgcolor: '#fff!important'
                                        }}>
                                        Thêm thời gian chặn
                                    </Button>
                                    <Button
                                        variant="contained"
                                        hidden={
                                            !abpCustom.isGrandPermission('Pages.Booking.Create')
                                        }
                                        startIcon={<img src={AddIcon} />}
                                        sx={{
                                            textTransform: 'unset!important',
                                            backgroundColor: '#7C3367!important',
                                            height: '40px'
                                        }}
                                        onClick={() => {
                                            this.setState({
                                                modalVisible: !this.state.modalVisible
                                            });
                                        }}
                                        className="btn-container-hover">
                                        Thêm cuộc hẹn
                                    </Button>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box marginTop="16px">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                        <Box>
                            <Select
                                defaultValue="all"
                                sx={{
                                    backgroundColor: '#fff',
                                    width: 'auto',
                                    fontSize: '14px',
                                    padding: '8px 16px!important',
                                    ' & .MuiSelect-select': {
                                        padding: '0'
                                    }
                                }}>
                                <MenuItem value="all">Tất cả</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            <Box display="flex" alignItems="center">
                                <Button
                                    sx={{
                                        border: '1px solid #E6E1E6',
                                        minWidth: '32px',
                                        height: '32px',
                                        marginRight: '16px',
                                        backgroundColor: '#fff',
                                        width: '32px'
                                    }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('prev');
                                    }}
                                    className="btn-outline-hover">
                                    <KeyboardArrowLeftIcon sx={{ color: '#666466' }} />
                                </Button>
                                <Button
                                    sx={{ padding: '0', marginRight: '16px', color: '#7C3367' }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('today');
                                    }}>
                                    Hôm nay
                                </Button>
                                <div className="date-time-selected">{this.state.viewDate}</div>
                                <Button
                                    sx={{
                                        border: '1px solid #E6E1E6',
                                        minWidth: '32px',
                                        height: '32px',
                                        marginLeft: '16px',
                                        backgroundColor: '#fff',
                                        width: '32px'
                                    }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('next');
                                    }}
                                    className="btn-outline-hover">
                                    <KeyboardArrowRightIcon sx={{ color: '#666466' }} />
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            <div>
                                <Box display="flex" gap="8px">
                                    <Tooltip title="Like">
                                        <Button
                                            sx={{
                                                minWidth: 'unset',
                                                border: '1px solid transparent'
                                            }}
                                            className="btn-outline-hover">
                                            <AiOutlineCalendar color="#231F20" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Like">
                                        <Button
                                            sx={{
                                                minWidth: 'unset',
                                                border: '1px solid transparent',
                                                marginRight: '16px'
                                            }}
                                            className="btn-outline-hover">
                                            <AiOutlineBars color="#231F20" />
                                        </Button>
                                    </Tooltip>
                                    <Select
                                        defaultValue="timeGridWeek"
                                        onChange={this.handleChangeViewCalendar}
                                        sx={{
                                            width: 'auto',
                                            fontSize: '14px',
                                            padding: '8px 16px!important',
                                            marginRight: '8px',
                                            float: 'left',
                                            color: '#4C4B4C',
                                            bgcolor: '#fff',
                                            '& .MuiSelect-select': {
                                                padding: '0'
                                            }
                                        }}>
                                        <MenuItem value="timeGridWeek">Tuần</MenuItem>
                                        <MenuItem value="timeGridDay">Ngày</MenuItem>
                                    </Select>
                                    <Select
                                        defaultValue="service"
                                        sx={{
                                            width: 'auto',
                                            fontSize: '14px',
                                            padding: '8px 16px!important',
                                            float: 'left',
                                            bgcolor: '#fff',
                                            '& .MuiSelect-select': {
                                                padding: '0'
                                            }
                                        }}>
                                        <MenuItem value="service">Dịch vụ</MenuItem>
                                    </Select>
                                </Box>
                            </div>
                        </Box>
                    </Box>
                    <Box
                        bgcolor="#fff"
                        sx={{
                            '& table': {
                                width: '100%!important'
                            },
                            '& .fc-timegrid-body': {
                                width: '100%!important'
                            }
                        }}>
                        <FullCalendar
                            ref={this.calendarRef}
                            viewHeight={650}
                            height={650}
                            firstDay={1}
                            eventClick={(e) => {
                                this.createOrUpdateModalOpen(e.event.id);
                            }}
                            headerToolbar={false}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                            allDaySlot={false}
                            slotMinTime={'06:00:00'}
                            slotMaxTime={'23:00:00'}
                            locale={'vi'}
                            initialView={this.state.initialView}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            themeSystem="boostrap"
                            events={this.state.events}
                        />
                    </Box>
                </Box>
                <CreateOrEditLichHenModal
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }}
                    onOk={this.handleSubmit}
                    idLichHen={this.state.idBooking}
                    suggestNhanVien={this.state.suggestNhanVien}
                    suggestDichVu={this.state.suggestDichVu}
                    suggestKhachHang={this.state.suggestKhachHang}></CreateOrEditLichHenModal>
            </Box>
        );
    }
}
export default LichHenScreen;
