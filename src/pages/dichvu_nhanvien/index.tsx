import { Component, ReactNode } from 'react';
import { SuggestDonViQuiDoiDto } from '../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestNhanVienDichVuDto } from '../../services/suggests/dto/SuggestNhanVienDichVuDto';
import { Button } from '@mui/material';
import CreateOrEditDichVuNhanVienModal from './components/create-or-edit-dichVu_nhanVien';

class SettingDichVuNhanVien extends Component {
    state = {
        visiableModal: false,
        suggestDichVu: [] as SuggestDonViQuiDoiDto[],
        suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    };

    onModal = () => {
        this.setState({ visiableModal: !this.state.visiableModal });
    };
    handleCloseModal = () => {
        this.setState({ visiableModal: false });
    };
    render(): ReactNode {
        return (
            <div>
                <Button onClick={this.onModal}>Show</Button>
                <CreateOrEditDichVuNhanVienModal
                    visiable={this.state.visiableModal}
                    handleClose={this.handleCloseModal}
                    handleOk={this.onModal}
                />
            </div>
        );
    }
}
export default SettingDichVuNhanVien;
