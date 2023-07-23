import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
const TabCuocHen: React.FC = () => {
    const columns = [
        {
            field: 'date',
            headerName: 'Ngày',
            minWidth: 70,
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
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
            field: 'dichvu',
            headerName: 'Dịch vụ',
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'time',
            headerName: 'Thời gian',
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
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
            field: 'price',
            headerName: 'Gía',
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
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
            field: 'nhanVienPhucVu',
            headerName: 'Nhân viên phục vụ',
            flex: 1.1,
            renderHeader: (params: any) => (
                <Box
                    sx={{
                        fontWeight: '700',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: '100%'
                    }}
                    title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'state',
            headerName: 'Tình trạng',
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    sx={{
                        margin: 'auto',
                        color: params.value == 'Hoàn thành' ? '#50CD89' : '#F1416C',
                        backgroundColor: params.value == 'Hoàn thành' ? '#E8FFF3' : '#FFF5F8'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ];
    const rows = [
        {
            id: '09785srdf',
            date: '21/01/2004',
            dichvu: 'Chăm sóc da mặt',
            time: '2h',
            price: '700.000đ',
            nhanVienPhucVu: 'Đinh Tuấn Tài',
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
export default TabCuocHen;
