import { Component, ReactNode } from 'react';
import ChietKhauDichVuScreen from '../hoa-hong-nhan-vien/chiet-khau-dich-vu/index';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import ChietKhauHoaDonScreen from '../hoa-hong-nhan-vien/chiet-khau-hoa-don/index';

class CaiDatHoaHongScreen extends Component {
    state = {
        isChietKhauHoaDon: true
    };
    render(): ReactNode {
        return (
            <>
                <Box>
                    <Box component={'div'}>
                        <Grid container rowSpacing={2} sx={{ marginTop: '-72px' }}>
                            <Grid item xs={12}>
                                <ButtonGroup
                                    sx={{
                                        height: '40px',
                                        bottom: '24px',
                                        right: '50px',
                                        float: 'right',
                                        '& button': {
                                            padding: '8px 10px!important',
                                            lineHeight: '24px'
                                        }
                                    }}>
                                    <Button
                                        variant={
                                            this.state.isChietKhauHoaDon ? 'outlined' : 'contained'
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            textTransform: 'unset',
                                            borderRadius: '8px 0px 0px 8px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#FFF'
                                                : '#666466',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? 'var(--color-main)!important'
                                                : '#FFFFFF!important',
                                            borderColor: 'transparent!important',
                                            boxShadow: 'none!important',
                                            '&:hover': {
                                                color: this.state.isChietKhauHoaDon
                                                    ? '#fff'
                                                    : 'var(--color-main)'
                                            }
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: true });
                                        }}>
                                        Theo dịch vụ
                                    </Button>
                                    <Button
                                        variant={
                                            this.state.isChietKhauHoaDon ? 'contained' : 'outlined'
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            textTransform: 'unset',
                                            borderRadius: '0px 8px 8px 0px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#666466'
                                                : '#fff',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? '#FFFFFF!important'
                                                : 'var(--color-main)!important',
                                            border: 'none!important',
                                            boxShadow: 'none!important',
                                            '&:hover': {
                                                color: this.state.isChietKhauHoaDon
                                                    ? 'var(--color-main)'
                                                    : '#fff'
                                            }
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: false });
                                        }}>
                                        Theo hóa đơn
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={12}>
                                {this.state.isChietKhauHoaDon ? (
                                    <ChietKhauDichVuScreen />
                                ) : (
                                    <ChietKhauHoaDonScreen />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </>
        );
    }
}
export default CaiDatHoaHongScreen;
