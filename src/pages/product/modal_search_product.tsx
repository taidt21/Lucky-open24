import { Search } from '@mui/icons-material';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    debounce
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import ListProductByGroup from './list_product_by_group';
import ProductService from '../../services/product/ProductService';

export default function ModalSearchProduct({ isShow, handlClose, handleChoseProduct }: any) {
    const [txtSearch, setTxtSearch] = useState('');
    const firstLoad = useRef(true);
    const [listProduct, setListProduct] = useState([]);

    // todo (if chose NhomHang)
    const getListHangHoa_groupbyNhom = async () => {
        const input = {
            IdNhomHangHoas: '',
            TextSearch: '',
            IdLoaiHangHoa: '',
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    useEffect(() => {
        getListHangHoa_groupbyNhom();
    }, []);

    // only used when change textseach
    const debounceDropDown = useRef(
        debounce(async (input: any) => {
            const data = await ProductService.GetDMHangHoa_groupByNhom(input);
            setListProduct(data);
        }, 500)
    ).current;

    useEffect(() => {
        if (isShow) {
            const input = {
                IdNhomHangHoas: '',
                TextSearch: txtSearch,
                IdLoaiHangHoa: 0,
                CurrentPage: 0,
                PageSize: 50
            };

            debounceDropDown(input);
        }
    }, [txtSearch]);

    return (
        <>
            <Dialog open={isShow} onClose={handlClose} fullWidth maxWidth="lg">
                <DialogTitle>
                    <span style={{ fontWeight: 700 }}> Chọn dịch vụ</span>
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                size="small"
                                fullWidth
                                value={txtSearch}
                                onChange={(e) => setTxtSearch(e.target.value)}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: <Search />
                                }}
                            />
                        </Grid>
                    </Grid>
                    <ListProductByGroup
                        listProduct={listProduct}
                        handleChoseItem={handleChoseProduct}
                    />
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </>
    );
}
