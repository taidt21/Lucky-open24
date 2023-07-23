import * as React from 'react';
import { Typography, Box, TextField, InputAdornment, Stack } from '@mui/material';
import { OpenInNew, LocalOffer } from '@mui/icons-material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { ModelNhomHangHoa } from '../../services/product/dto';
//import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function TreeViewGroupProduct({ dataNhomHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = React.useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({ id: '' })
    );
    const [isHover, setIsHover] = React.useState(false);

    const handleHover = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(rowData);
    };
    const handleClickTreeItem = (isEdit = false) => {
        console.log('click ', rowHover);
        clickTreeItem(isEdit, rowHover);
    };
    return (
        <TreeView
            aria-label="file system navigator"
            sx={{ flexGrow: 1, minWidth: 200, overflowY: 'auto' }}>
            {dataNhomHang.map((item: any, index: any) => (
                <TreeItem
                    key={item.id}
                    nodeId={item.id}
                    label={
                        <Stack direction="row">
                            <Typography sx={{ width: 8 / 10 }}>{item.tenNhomHang}</Typography>
                            {isHover && rowHover.id === item.id && (
                                <OpenInNew onClick={() => handleClickTreeItem(true)} />
                            )}
                        </Stack>
                    }
                    icon={<LocalOffer style={{ color: item.color }} />}
                    onMouseLeave={(event: any) => {
                        handleHover(event, item, index);
                    }}
                    onMouseEnter={(event: any) => {
                        handleHover(event, item, index);
                    }}
                    onClick={() => handleClickTreeItem(false)}>
                    {item.children.map((child: any, index2: any) => (
                        <TreeItem
                            key={child.id}
                            nodeId={child.id}
                            onClick={() => handleClickTreeItem(false)}
                            label={
                                <Stack direction="row">
                                    <Typography sx={{ width: 7.9 / 10 }}>
                                        {child.tenNhomHang}
                                    </Typography>
                                    {isHover && rowHover.id === child.id && (
                                        <OpenInNew onClick={() => handleClickTreeItem(true)} />
                                    )}
                                </Stack>
                            }
                            onMouseLeave={(event: any) => {
                                handleHover(event, child, index2);
                            }}
                            onMouseEnter={(event: any) => {
                                handleHover(event, child, index2);
                            }}></TreeItem>
                    ))}
                </TreeItem>
            ))}
        </TreeView>
    );
}
