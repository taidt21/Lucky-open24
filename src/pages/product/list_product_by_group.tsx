import { Grid, Stack, Box } from '@mui/material';

export default function ListProductByGroup({ listProduct, handleChoseItem }: any) {
    return (
        <>
            {listProduct.map((nhom: any, index: any) => (
                <Grid container paddingTop={2} gap={2}>
                    <Grid item xs={12} key={index} padding=" 8px 8px 8px 0px">
                        <span
                            style={{
                                fontSize: '16px',
                                color: '#000',
                                fontWeight: '700'
                            }}>
                            {nhom.tenNhomHang}
                        </span>
                    </Grid>

                    {nhom.hangHoas.map((item: any, index2: any) => (
                        <Grid
                            key={index2}
                            item
                            xs={12}
                            sm={4}
                            md={3}
                            lg={3}
                            sx={{
                                border: '1px solid transparent',
                                cursor: 'pointer',
                                transition: '.4s',
                                backgroundColor: 'var(--color-bg)',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}
                            onClick={() => handleChoseItem(item)}>
                            <Stack
                                direction="column"
                                padding={2}
                                spacing={2}
                                justifyContent="space-around">
                                <Box
                                    height={40}
                                    style={{
                                        fontSize: 12,
                                        color: '#333233',
                                        fontWeight: '700'
                                    }}>
                                    {item.tenHangHoa}
                                </Box>
                                <Box
                                    style={{
                                        fontSize: 14,
                                        color: '#333233'
                                    }}>
                                    {new Intl.NumberFormat('vi-VN').format(item.giaBan)}
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            ))}
        </>
    );
}
