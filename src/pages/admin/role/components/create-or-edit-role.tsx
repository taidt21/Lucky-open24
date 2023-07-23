import { Component, ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tab,
    TextField,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';

import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import roleService from '../../../../services/role/roleService';
import { PermissionTree } from '../../../../services/role/dto/permissionTree';
import { CreateOrEditRoleDto } from '../../../../services/role/dto/createOrEditRoleDto';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import rules from './createOrUpdateRole.validation';
export interface ICreateOrEditRoleProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    permissionTree: PermissionTree[];
    formRef: CreateOrEditRoleDto;
}

interface ICreateOrEditRoleState {
    selectedPermissions: string[];
    expandedPermissions: string[];
    tabIndex: string;
    searchKeyWord: string;
    filteredPermissions: PermissionTree[];
}
class CreateOrEditRoleModal extends Component<ICreateOrEditRoleProps, ICreateOrEditRoleState> {
    state = {
        selectedPermissions: this.props.formRef.grantedPermissions ?? ['Pages'],
        expandedPermissions: ['Pages'],
        tabIndex: '1',
        searchKeyWord: '',
        filteredPermissions: this.props.permissionTree
    };
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        const defaultExpand = this.getDefaultExpandPermission(this.props.permissionTree);
        const permissions =
            this.state.selectedPermissions.length === 0 ||
            (this.state.selectedPermissions.length === 1 &&
                this.state.selectedPermissions[0] == 'Pages')
                ? this.props.formRef.grantedPermissions ?? ['Pages']
                : this.state.selectedPermissions;
        this.setState({
            tabIndex: newValue,
            selectedPermissions: permissions,
            expandedPermissions: defaultExpand,
            filteredPermissions: this.props.permissionTree
        });
    };
    filterPermissions = (
        permissions: PermissionTree[],
        searchKeyword: string
    ): PermissionTree[] => {
        return permissions.filter((permission) => {
            const matchesKeyword = permission.displayName.toLowerCase().includes(searchKeyword);
            const hasMatchingChildren =
                this.filterPermissions(permission.children, searchKeyword).length > 0;
            return matchesKeyword || hasMatchingChildren;
        });
    };
    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchKeyword = event.target.value.toLowerCase().toString();
        const filteredPermissions = this.filterPermissions(
            this.props.permissionTree,
            searchKeyword
        );
        this.setState({
            searchKeyWord: searchKeyword,
            filteredPermissions: filteredPermissions
        });
    };
    getDefaultExpandPermission = (permissions: PermissionTree[]) => {
        const defaultExpand: string[] = [];
        permissions.forEach((item: PermissionTree) => {
            if (item.children.length > 0) {
                const childrenExpand = this.getDefaultExpandPermission(item.children);
                defaultExpand.push(item.name, ...childrenExpand);
            }
        });

        return defaultExpand;
    };
    handleSubmit = async (values: CreateOrEditRoleDto) => {
        const permission = this.state.selectedPermissions.filter((x) => x != '');
        const createOrEdit = await roleService.createOrEdit({
            ...values,
            grantedPermissions: permission
        });
        createOrEdit != null
            ? values.id === 0
                ? enqueueSnackbar('Thêm mới thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
                : enqueueSnackbar('Cập nhật thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.setState({
            tabIndex: '1',
            selectedPermissions: []
        });
        this.props.onOk();
    };
    handleCheck = (event: any, node: PermissionTree) => {
        const checked = event.target.checked;
        const updatedSelected = [...this.state.selectedPermissions];

        if (checked) {
            this.addPermission(updatedSelected, node);
            this.addChildrenPermissions(updatedSelected, node.children);
        } else {
            this.removePermission(updatedSelected, node);
            this.removeChildrenPermissions(updatedSelected, node.children);
        }
        this.setState({ selectedPermissions: updatedSelected });
    };

    addPermission = (selectedPermissions: string[], node: PermissionTree) => {
        if (selectedPermissions.indexOf(node.name) === -1) {
            selectedPermissions.push(node.name);
            if (selectedPermissions?.includes(node.parentNode) == false) {
                selectedPermissions.push(node.parentNode);
            }
        }
    };

    addChildrenPermissions = (selectedPermissions: string[], children: PermissionTree[]) => {
        if (Array.isArray(children)) {
            children.forEach((child: PermissionTree) => {
                this.addPermission(selectedPermissions, child);
                this.addChildrenPermissions(selectedPermissions, child.children);
            });
        }
    };

    removePermission = (selectedPermissions: string[], node: PermissionTree) => {
        const index = selectedPermissions?.indexOf(node.name);
        if (index !== -1) {
            selectedPermissions.splice(index, 1);
        }
    };

    removeChildrenPermissions = (selectedPermissions: string[], children: PermissionTree[]) => {
        if (Array.isArray(children)) {
            children.forEach((child: PermissionTree) => {
                this.removePermission(selectedPermissions, child);
                this.removeChildrenPermissions(selectedPermissions, child.children);
            });
        }
    };

    renderTree = (nodes: PermissionTree[], isCollapsed = false) => {
        const { searchKeyWord } = this.state;
        return nodes.map((node) => {
            const hasMatchingChildren =
                this.filterPermissions(node.children, searchKeyWord).length > 0;

            if (!hasMatchingChildren && !node.displayName.toLowerCase().includes(searchKeyWord)) {
                return null; // Skip rendering if no match found
            }
            const hasChildren = node.children && node.children.length > 0;
            const isItemCollapsed =
                isCollapsed || !this.state.expandedPermissions?.includes(node.name);

            return (
                <ListItem key={node.name} disablePadding>
                    <ListItemText>
                        {hasChildren && (
                            <>
                                {isItemCollapsed ? (
                                    <ExpandMoreIcon
                                        onClick={() => this.toggleCollapse(node.name)}
                                    />
                                ) : (
                                    <ChevronRightIcon
                                        onClick={() => this.toggleCollapse(node.name)}
                                    />
                                )}
                            </>
                        )}
                        <Checkbox
                            onChange={(e) => this.handleCheck(e, node)}
                            checked={this.state.selectedPermissions?.includes(node.name)}
                            sx={{
                                color: 'var(--color-main)!important'
                            }}
                        />
                        <>
                            {node.children !== null && node.children.length > 0 ? (
                                <FolderIcon sx={{ color: '#FFA800' }} />
                            ) : (
                                <InsertDriveFileOutlinedIcon sx={{ color: '#FFA800' }} />
                            )}{' '}
                            {node.displayName}
                        </>
                        {hasChildren && (
                            <>
                                {!isItemCollapsed && (
                                    <List disablePadding sx={{ pl: 4 }}>
                                        {this.renderTree(node.children)}
                                    </List>
                                )}
                            </>
                        )}
                    </ListItemText>
                </ListItem>
            );
        });
    };

    toggleCollapse = (nodeName: string) => {
        const expandedPermissions = [...this.state.expandedPermissions];
        const index = expandedPermissions.indexOf(nodeName);

        if (index > -1) {
            expandedPermissions.splice(index, 1);
        } else {
            expandedPermissions.push(nodeName);
        }

        this.setState({ expandedPermissions: expandedPermissions });
    };
    handleFormKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
        }
    };
    render(): ReactNode {
        const { visible, onCancel, modalType, formRef } = this.props;
        const initialValues = {
            description: formRef.description,
            displayName: formRef.displayName,
            name: formRef.name,
            grantedPermissions: formRef.grantedPermissions,
            id: formRef.id
        };
        return (
            <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {modalType}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            this.setState({
                                tabIndex: '1',
                                selectedPermissions: []
                            });
                            onCancel();
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.handleSubmit}
                        validationSchema={rules}>
                        {({ values, handleChange, errors }) => (
                            <Form onKeyPress={this.handleFormKeyPress}>
                                <Box>
                                    <TabContext value={this.state.tabIndex}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList
                                                onChange={this.handleTabChange}
                                                aria-label="lab API tabs example"
                                                sx={{
                                                    '& .MuiTabs-flexContainer': { gap: '24px' },
                                                    '& button': {
                                                        fontSize: '14px'
                                                    }
                                                }}>
                                                <Tab
                                                    label="Vai trò"
                                                    value="1"
                                                    sx={{
                                                        textTransform: 'unset!important',
                                                        padding: '0'
                                                    }}
                                                />
                                                <Tab
                                                    label="Quyền"
                                                    value="2"
                                                    sx={{
                                                        textTransform: 'unset!important',
                                                        padding: '0'
                                                    }}
                                                />
                                            </TabList>
                                        </Box>
                                        <TabPanel
                                            value="1"
                                            sx={{
                                                padding: '0',
                                                '& label': {
                                                    fontSize: '14px'
                                                },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                marginTop: '16px'
                                            }}>
                                            <FormGroup>
                                                <label htmlFor="name" className="modal-lable">
                                                    Tên vai trò
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginRight: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    className="mt-2"
                                                    fullWidth
                                                    size="small"
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && (
                                                    <small className="text-danger">
                                                        {errors.name}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label
                                                    htmlFor="displayName"
                                                    className="modal-lable">
                                                    Tên hiển thị
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginRight: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    className="mt-2"
                                                    fullWidth
                                                    size="small"
                                                    id="displayName"
                                                    type="text"
                                                    name="displayName"
                                                    value={values.displayName}
                                                    onChange={handleChange}
                                                />
                                                {errors.displayName && (
                                                    <small className="text-danger">
                                                        {errors.displayName}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label
                                                    htmlFor="description"
                                                    className="modal-lable">
                                                    Mô tả
                                                </label>
                                                <TextField
                                                    className="mt-2"
                                                    fullWidth
                                                    size="small"
                                                    id="description"
                                                    type="text"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </TabPanel>
                                        <TabPanel value="2" sx={{ padding: '0' }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                type="text"
                                                onChange={this.handleSearchChange}
                                                placeholder="Tìm kiếm..."
                                                sx={{
                                                    paddingTop: 1,
                                                    paddingBottom: 2
                                                }}></TextField>
                                            <FormGroup
                                                sx={{
                                                    '& .MuiFormControlLabel-root': {
                                                        width: '100%'
                                                    },
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden',
                                                    maxHeight: '450px'
                                                }}>
                                                <List component="nav" disablePadding>
                                                    {this.renderTree(
                                                        this.state.filteredPermissions
                                                    )}
                                                </List>
                                            </FormGroup>
                                        </TabPanel>
                                    </TabContext>
                                    <DialogActions sx={{ paddingRight: '0!important' }}>
                                        <Box
                                            display="flex"
                                            width="fit-content"
                                            marginLeft="auto"
                                            gap="8px"
                                            sx={{
                                                '& button': {
                                                    textTransform: 'unset!important'
                                                }
                                            }}>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                size="small"
                                                className="btn-container-hover">
                                                Lưu
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    color: 'var(--color-main)'
                                                }}
                                                onClick={() => {
                                                    this.setState({
                                                        tabIndex: '1',
                                                        selectedPermissions: []
                                                    });
                                                    onCancel();
                                                }}
                                                className="btn-outline-hover">
                                                Hủy
                                            </Button>
                                        </Box>
                                    </DialogActions>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}

export default observer(CreateOrEditRoleModal);
