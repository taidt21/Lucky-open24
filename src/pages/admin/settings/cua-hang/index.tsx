import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import AddLogoIcon from '../../../../images/add-logo.svg';
import cuaHangService from '../../../../services/cua_hang/cuaHangService';
import Cookies from 'js-cookie';
import { EditCuaHangDto } from '../../../../services/cua_hang/Dto/EditCuaHangDto';
import { enqueueSnackbar } from 'notistack';
class StoreDetail extends Component {
    state = {
        editCuaHang: {
            id: '',
            diaChi: '',
            facebook: '',
            ghiChu: '',
            instagram: '',
            logo: '',
            maSoThue: '',
            soDienThoai: '',
            tenCongTy: '',
            twitter: '',
            website: '',
            fileLogo: ''
        } as EditCuaHangDto
    };
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
        const cuaHang = await cuaHangService.getCongTyEdit(idChiNhanh);
        this.setState({
            editCuaHang: cuaHang
        });
    }
    async componentDidMount() {
        await this.getData();
    }
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({
            editCuaHang: {
                ...this.state.editCuaHang,
                [name]: value
            }
        });
    };

    handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileLogo = URL.createObjectURL(file);

            this.setState({
                editCuaHang: {
                    ...this.state.editCuaHang,
                    fileLogo: fileLogo
                }
            });
        }
    };
    handSubmit = async () => {
        const result = await cuaHangService.Update(this.state.editCuaHang);
        result != null
            ? enqueueSnackbar('Cập nhật thông tin thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
    };

    render(): ReactNode {
        const { editCuaHang } = this.state;

        return (
            <Box bgcolor="#fff" padding="24px" borderRadius="8px">
                <Typography variant="h2" fontSize="24px" fontWeight="700" color="#0C050A" mb="32px">
                    Chi tiết cửa hàng
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box padding="20px" border="1px solid #E6E1E6" borderRadius="8px">
                            <Typography
                                variant="body1"
                                fontSize="14px"
                                color="#3A3C40"
                                fontWeight="500">
                                Logo cửa hàng
                            </Typography>
                            <Box position="relative" sx={{ textAlign: 'center', mt: '20px' }}>
                                {editCuaHang.fileLogo ? (
                                    <img
                                        src={editCuaHang.fileLogo}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'contain'
                                        }}
                                        alt="logo"
                                    />
                                ) : (
                                    <img
                                        style={{
                                            width: '6.944444444444445vw',
                                            height: '6.944444444444445vw'
                                        }}
                                        src={AddLogoIcon}
                                        alt="default logo"
                                    />
                                )}
                                <input
                                    onChange={this.handleLogoChange}
                                    type="file"
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%',
                                        opacity: '0',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h6"
                                fontWeight="400"
                                fontSize="12px"
                                color="#999699"
                                textAlign="center"
                                mt="24px"
                                maxWidth="152px"
                                marginX="auto">
                                Kích thước tối thiểu 3.1 mb
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& label': {
                                fontWeight: '500',
                                color: '#4C4B4C',
                                fontSize: '14px',
                                mb: '8px'
                            },
                            '& input': {
                                fontSize: '14px'
                            }
                        }}>
                        <Typography variant="h3" fontWeight="700" fontSize="16px" color="#4C4B4C">
                            Thông tin cửa hàng
                        </Typography>
                        <Grid container spacing={1} mt="5px" rowSpacing={2}>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="name">Tên cửa hàng</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="tenCongTy"
                                    placeholder="Nhập tên"
                                    onChange={this.handleChange}
                                    value={editCuaHang.tenCongTy}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="location">Địa chỉ</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="diaChi"
                                    placeholder="Nhập địa chỉ"
                                    onChange={this.handleChange}
                                    value={editCuaHang.diaChi}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="phone">Số điện thoại</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="soDienThoai"
                                    placeholder="Nhập số điện thoại"
                                    onChange={this.handleChange}
                                    value={editCuaHang.soDienThoai}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="code">Mã số thuế</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="maSoThue"
                                    placeholder="Nhập mã số thuế"
                                    onChange={this.handleChange}
                                    value={editCuaHang.maSoThue}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    borderTop: '1px solid #E3E6EB',
                                    paddingTop: '24px',
                                    mt: '24px'
                                }}>
                                <Typography
                                    variant="h3"
                                    fontWeight="700"
                                    fontSize="16px"
                                    color="#4C4B4C">
                                    Liên kết trực tuyến
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <label htmlFor="code">Website</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="website"
                                    placeholder="Website"
                                    onChange={this.handleChange}
                                    value={editCuaHang.website}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="code">Facebook</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="facebook"
                                    placeholder="Facebook"
                                    onChange={this.handleChange}
                                    value={editCuaHang.facebook}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="code">Instagram</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="instagram"
                                    placeholder="Instagram"
                                    onChange={this.handleChange}
                                    value={editCuaHang.instagram}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor="code">Twitter</label>
                                <TextField
                                    size="small"
                                    fullWidth
                                    name="twitter"
                                    placeholder="twitter"
                                    onChange={this.handleChange}
                                    value={editCuaHang.twitter}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="contained"
                            onClick={this.handSubmit}
                            sx={{
                                width: 'fit-content',
                                minWidth: 'unset',
                                textTransform: 'unset',
                                fontSize: '14px',
                                fontWeight: '400',
                                ml: 'auto',

                                mt: '16px'
                            }}
                            className="btn-container-hover">
                            Cập nhật
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
export default StoreDetail;
