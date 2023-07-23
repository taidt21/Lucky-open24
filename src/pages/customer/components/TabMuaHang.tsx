import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
const TabMuaHang: React.FC = () => {
    const columns = [
        {
            field: 'id',
            headerName: 'Mã hóa đơn',
            minWidth: 70,
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayBan',
            headerName: 'Ngày bán',
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box sx={{ width: '100%', textAlign: 'center' }} title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongTienHang',
            headerName: 'Tổng tiền hàng',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box sx={{ width: '100%', textAlign: 'center' }} title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongGiamGia',
            headerName: 'Tổng giảm giá',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%', textAlign: 'center' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongPhaiTra',
            headerName: 'Tổng phải trả',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box margin="auto" title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'khachDaTra',
            headerName: 'Khách đã trả',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        margin: 'auto'
                    }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'conNo',
            headerName: 'Còn nợ',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        margin: 'auto'
                    }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'state',
            headerName: 'Trạng thái',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        margin: 'auto',
                        color:
                            params.value == 'Hoàn thành'
                                ? '#50CD89'
                                : params.value == 'Hủy'
                                ? '#F1416C'
                                : '#FF9900',
                        backgroundColor:
                            params.value == 'Hoàn thành'
                                ? '#E8FFF3'
                                : params.value == 'Hủy'
                                ? '#FFF5F8'
                                : '#FFF8DD'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ];
    const rows = [
        {
            id: '09785srdf',
            ngayBan: '21/01/2000',
            tongTienHang: '1.200.000đ',
            tongGiamGia: '700.000đ',
            tongPhaiTra: '780.000đ',
            khachDaTra: '2.500.000đ',
            conNo: '25.000đ',
            state: 'Hủy'
        },
        {
            id: '0rdf',
            ngayBan: '21/01/2004',
            tongTienHang: '1.200.000đ',
            tongGiamGia: '700.000đ',
            tongPhaiTra: '780.000đ',
            khachDaTra: '2.500.000đ',
            conNo: '25.000đ',
            state: 'Chưa hoàn thành'
        },
        {
            id: '09785srdfghvj',
            ngayBan: '21/01/2004',
            tongTienHang: '1.200.000đ',
            tongGiamGia: '700.000đ',
            tongPhaiTra: '780.000đ',
            khachDaTra: '2.500.000đ',
            conNo: '25.000đ',
            state: 'Hoàn thành'
        }
    ];
    return (
        <>
            <Box mt="24px">
                <DataGrid
                    disableRowSelectionOnClick
                    hideFooter
                    autoHeight
                    columns={columns}
                    rows={rows}
                    localeText={TextTranslate}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: '#F2EBF0'
                        },
                        '& .MuiDataGrid-iconButtonContainer': {
                            display: 'none'
                        },
                        '& .MuiBox-root': {
                            fontSize: '12px'
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            bgcolor: '#fff'
                        },
                        '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                            outline: 'none!important'
                        },
                        '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                            outline: 'none '
                        },
                        '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                            color: '#7C3367'
                        },
                        '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                            fill: '#7C3367'
                        },
                        '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(2)':
                            {
                                fill: '#000'
                            },
                        '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(1)':
                            {
                                fill: '#000'
                            },
                        '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                            color: '#7C3367!important'
                        },
                        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                            {
                                outline: 'none'
                            }
                    }}
                />
            </Box>
        </>
    );
};
export default TabMuaHang;
