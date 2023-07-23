import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const BanHangNewTab = () => {
    const isOpenedRef = useRef(false);

    useEffect(() => {
        if (!isOpenedRef.current) {
            window.open('./ban-hang', '_blank');
            isOpenedRef.current = true;
        }
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
            <div className="text-primary">Trang đã được mở trong một thẻ khác !</div>
        </Box>
    );
};

export default BanHangNewTab;
