import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import utils from '../../../utils/utils';

export default function TabInfo({ hoadon, chitietHoaDon }: any) {
    const columns: GridColDef[] = [
        // {
        //     field: 'maHangHoa',
        //     headerName: 'Mã hàng',
        //     minWidth: 50,
        //     flex: 0.8,
        //     renderHeader: (params) => (
        //         <Box>
        //             {params.colDef.headerName}
        //             <IconSorting />
        //         </Box>
        //     ),
        //     renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        // },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            // minWidth: 150,
            flex: 5,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'soLuong',
            headerName: 'Số lượng',
            headerAlign: 'center',
            align: 'center',
            minWidth: 80,
            flex: 2,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'donGiaTruocCK',
            headerName: 'Đơn giá',
            headerAlign: 'right',
            align: 'right',
            minWidth: 90,
            flex: 0.6,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {' '}
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tienChietKhau',
            headerName: 'Chiết khấu',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 2,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        // {
        //     field: 'donGiaSauCK',
        //     headerName: 'Giá bán',
        //     headerAlign: 'right',
        //     align: 'right',
        //     minWidth: 100,
        //     flex: 2,
        //     renderHeader: (params) => (
        //         <Box>
        //             {params.colDef.headerName}
        //             <IconSorting />
        //         </Box>
        //     ),
        //     renderCell: (params) => (
        //         <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
        //             {new Intl.NumberFormat('vi-VN').format(params.value)}
        //         </Box>
        //     )
        // },
        {
            field: 'thanhTienSauCK',
            headerName: 'Thành tiền',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 2,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        }
    ];

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        columns={columns}
                        rows={chitietHoaDon}
                        sx={{
                            '& p': {
                                mb: 0
                            },
                            '& .MuiBox-root': {
                                maxWidth: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: 'var(--color-bg)'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainerContent .MuiBox-root': {
                                fontWeight: '700',
                                fontSize: '12px'
                            },
                            '& .MuiIconButton-root': {
                                display: 'none'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none '
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                color: 'var(--color-main)'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                fill: 'var(--color-main)'
                            },
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(2)':
                                {
                                    fill: 'var(--color-main)'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(1)':
                                {
                                    fill: 'var(--color-main)'
                                },
                            '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                color: 'var(--color-main)!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: 'var(--color-bg)'
                                }
                        }}
                        localeText={TextTranslate}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box
                        sx={{
                            padding: '24px',
                            bgcolor: '#fff',
                            boxShadow: '0px 4px 20px 0px #AAA9B81A',
                            borderRadius: '12px'
                        }}>
                        <Typography
                            variant="h2"
                            fontSize="16px"
                            fontWeight="700"
                            color="#3B4758"
                            mb="36px">
                            Chi tiết thanh toán
                        </Typography>
                        <Grid
                            container
                            alignItems="center"
                            rowGap="24px"
                            sx={{
                                '& .MuiGrid-item:nth-child(even) .MuiTypography-root': {
                                    textAlign: 'right'
                                }
                            }}>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Tổng tiền hàng{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongTienHang)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Giảm hóa đơn{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongGiamGiaHD)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Tổng thanh toán{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongThanhToan)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Khách đã trả{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.daThanhToan)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="18px"
                                    fontWeight="700">
                                    Còn nợ
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography
                                    variant="body1"
                                    fontSize="18px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.conNo)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
