import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const ConfirmDelete = ({ isShow, onOk, onCancel, title = '', mes = '' }: any) => {
    return (
        <Dialog
            open={isShow}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    height: 'auto',
                    width: '450px'
                }
            }}>
            <DialogTitle>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h6" component="h6" style={{ color: 'blue' }}>
                        {title != '' ? title : 'Thông báo xóa'}
                    </Typography>
                    <CloseOutlinedIcon sx={{ height: '24px' }} onClick={onCancel} />
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">
                    <Typography variant="subtitle1" component="h2">
                        {mes != '' ? mes : 'Bạn có chắc chắn muốn xóa bản ghi này không?'}
                    </Typography>
                    <Stack
                        mt={3}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={2}>
                        <Button variant="contained" color="error" onClick={onCancel}>
                            Bỏ qua
                        </Button>
                        <Button variant="contained" onClick={onOk}>
                            Đồng ý
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;
