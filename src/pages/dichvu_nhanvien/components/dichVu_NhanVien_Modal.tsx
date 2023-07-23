import {
    Grid,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { SuggestNhanVienDichVuDto } from '../../../services/suggests/dto/SuggestNhanVienDichVuDto';
import { SuggestDichVuDto } from '../../../services/suggests/dto/SuggestDichVuDto';

interface DichVuProps {
    suggestKyThuatVien: SuggestNhanVienDichVuDto[];
    suggestDichVu: SuggestDichVuDto[];
}
class DichVuNhanVienTab extends Component<DichVuProps> {
    render(): ReactNode {
        return (
            <Box component={'div'}>
                <Grid container>
                    <Grid item xs={7}>
                        <Typography>Dịch vụ</Typography>
                        <RadioGroup>
                            {this.props.suggestDichVu.map((item) => {
                                return (
                                    <FormControlLabel
                                        control={<Radio />}
                                        label={item.tenDichVu}
                                        value={item.id}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>Nhân viên</Typography>
                        <FormGroup>
                            {this.props.suggestKyThuatVien.map((item) => {
                                return (
                                    <FormControlLabel
                                        value={item.id}
                                        control={<Checkbox />}
                                        label={item.tenNhanVien + '-' + item.chucVu}
                                        labelPlacement="end"
                                    />
                                );
                            })}
                        </FormGroup>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
export default DichVuNhanVienTab;
