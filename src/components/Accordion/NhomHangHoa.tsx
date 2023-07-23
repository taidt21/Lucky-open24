import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Button
} from '@mui/material';
import { useState } from 'react';
import { OpenInNew, LocalOffer } from '@mui/icons-material';
import { ModelNhomHangHoa } from '../../services/product/dto';

export default function AccordionNhomHangHoa({ dataNhomHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<ModelNhomHangHoa>(new ModelNhomHangHoa({ id: '' }));
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');

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
    const handleClickTreeItem = (isEdit = false, idChosing: string) => {
        clickTreeItem(isEdit, rowHover);
        setIdChosing(idChosing);
    };
    return (
        <>
            {dataNhomHang.map((item: any, index: any) => (
                <Accordion
                    disableGutters
                    key={index}
                    sx={{
                        border: 'none!important',
                        marginTop: '12px',
                        boxShadow: 'unset',
                        '&.MuiAccordion-root::before': { content: 'none' }
                    }}>
                    <AccordionSummary
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: idChosing === item.id ? 'var(--color-bg)' : '',
                            borderRadius: '8px',
                            '&:hover': {
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}>
                        <LocalOffer sx={{ color: item.color }} />
                        <Typography
                            variant="subtitle1"
                            color="#333233"
                            fontSize="14px"
                            fontWeight="700"
                            textTransform="capitalize"
                            sx={{
                                marginLeft: '9px',
                                alignItems: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                                paddingRight: '20px'
                            }}
                            onClick={() => handleClickTreeItem(false, item.id)}
                            title={item.tenNhomHang}>
                            {item.tenNhomHang}
                        </Typography>
                        {isHover && item.id !== '' && rowHover.id === item.id && (
                            <OpenInNew
                                onClick={() => handleClickTreeItem(true, item.id)}
                                sx={{ position: 'absolute', right: 16 }}
                            />
                        )}
                    </AccordionSummary>

                    {item.children?.map((child: any, index2: any) => (
                        <AccordionDetails
                            key={index2}
                            sx={{
                                padding: '8px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                margin: 'auto',
                                bgcolor: idChosing === child.id ? '#F2EBF0' : '',
                                borderRadius: '8px',
                                '&:hover': {
                                    bgcolor: '#F2EBF0'
                                }
                            }}
                            onMouseLeave={(event: any) => {
                                handleHover(event, child, index2);
                            }}
                            onMouseEnter={(event: any) => {
                                handleHover(event, child, index2);
                            }}>
                            <LocalOffer sx={{ color: item.color, opacity: '0' }} />
                            <Typography
                                variant="subtitle1"
                                color="#333233"
                                fontSize="14px"
                                textTransform="capitalize"
                                sx={{
                                    cursor: 'poitner',
                                    marginLeft: '9px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1
                                }}
                                onClick={() => handleClickTreeItem(false, child.id)}
                                title={child.tenNhomHang}>
                                {child.tenNhomHang}
                            </Typography>
                            {isHover && rowHover.id === child.id && (
                                <OpenInNew
                                    onClick={() => handleClickTreeItem(true, child.id)}
                                    sx={{ position: 'absolute', right: 16 }}
                                />
                            )}
                        </AccordionDetails>
                    ))}
                </Accordion>
            ))}
        </>
    );
}
