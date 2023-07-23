import {
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    RadioGroup,
    Radio,
    Typography,
    Box,
    Grid
} from '@mui/material';
import React, { Component } from 'react';
import { SuggestDonViQuiDoiDto } from '../../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestNhanVienDichVuDto } from '../../../services/suggests/dto/SuggestNhanVienDichVuDto';
import NhanVienDichVuTab from './nhanVien_DichVu_Modal';
import DichVuNhanVienTab from './dichVu_NhanVien_Modal';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
    handleOk: () => void;
}
class CreateOrEditDichVuNhanVienModal extends Component<ModalProps> {
    state = {
        settingValue: 'Service',
        suggestDichVu: [] as SuggestDonViQuiDoiDto[],
        suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        const kyThuatViens = await suggestStore.getSuggestKyThuatVien();
        const dichVus = await suggestStore.getSuggestDichVu();
        await this.setState({
            suggestDichVus: dichVus,
            suggestkyThuatVien: kyThuatViens
        });
    }
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): React.ReactNode {
        const { visiable, handleClose } = this.props;
        return (
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={handleClose}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center">
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography style={{ float: 'left' }}>Cài đặt theo</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <RadioGroup
                                    style={{ float: 'right' }}
                                    row
                                    value={this.state.settingValue}
                                    onChange={this.handleSettingChange}>
                                    <FormControlLabel
                                        value={'Service'}
                                        control={<Radio />}
                                        label={'Dịch vụ'}
                                    />
                                    <FormControlLabel
                                        value={'Employee'}
                                        control={<Radio />}
                                        label={'Nhân viên'}
                                    />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        {this.state.settingValue == 'Employee' ? (
                            <NhanVienDichVuTab
                                suggestDichVu={suggestStore.suggestDichVu}
                                suggestKyThuatVien={suggestStore.suggestKyThuatVien}
                            />
                        ) : (
                            <DichVuNhanVienTab
                                suggestDichVu={suggestStore.suggestDichVu}
                                suggestKyThuatVien={suggestStore.suggestKyThuatVien}
                            />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }
}

export default observer(CreateOrEditDichVuNhanVienModal);
