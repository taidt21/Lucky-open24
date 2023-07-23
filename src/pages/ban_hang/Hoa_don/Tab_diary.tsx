import React, { useEffect, useState } from 'react';
import { Box, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { format } from 'date-fns';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import utils from '../../../utils/utils';

export default function TabDiary({ idHoaDon }: any) {
    const [phieuThuChi, setPhieuThuChi] = useState<QuyHoaDonDto[]>([]);
    const GetNhatKyThanhToan = async () => {
        const data = await SoQuyServices.GetNhatKyThanhToan_ofHoaDon(idHoaDon);
        setPhieuThuChi(data);
    };
    useEffect(() => {
        if (!utils.checkNull(idHoaDon)) {
            GetNhatKyThanhToan();
        }
    }, [idHoaDon]);
    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box width="100%" textAlign="center">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập phiếu',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box textAlign="center" width="100%">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'sLoaiPhieu',
            headerName: 'Loại thu/chi',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box textAlign="center" width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'sHinhThucThanhToan',
            headerName: 'Phương thức',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box textAlign="center" width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongTienThu',
            headerName: 'Tiền thu',

            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box textAlign="center" width="100%">
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box textAlign="center" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'sTrangThai',
            headerName: 'Trạng thái',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    margin="auto"
                    sx={{
                        padding: '4px',
                        borderRadius: '100px',
                        color:
                            params.row.trangThai === 1
                                ? '#50CD89'
                                : params.row.trangThai === 0
                                ? '#FF9900'
                                : '#F1416C',
                        bgcolor:
                            params.row.trangThai === 1
                                ? '#E8FFF3'
                                : params.row.trangThai === 0
                                ? '#FFF8DD'
                                : '#FFF5F8'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ];

    return (
        <Box>
            <DataGrid
                disableRowSelectionOnClick
                autoHeight
                columns={columns}
                rows={phieuThuChi}
                sx={{
                    '& p': {
                        mb: 0
                    },
                    '& .MuiBox-root': {
                        maxWidth: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
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
                    '& .MuiDataGrid-cell .MuiBox-root': {
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
                    // '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(2)':
                    //     {
                    //         fill: '#000'
                    //     },
                    // '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(1)':
                    //     {
                    //         fill: '#000'
                    //     },
                    '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                        color: 'var(--color-main)!important'
                    },
                    '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                        fontWeight: '700',
                        fontSize: '12px'
                    },
                    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
                        outline: 'none'
                    },
                    '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                        {
                            bgcolor: 'var(--color-bg)'
                        }
                }}
                localeText={TextTranslate}
            />
        </Box>
    );
}
