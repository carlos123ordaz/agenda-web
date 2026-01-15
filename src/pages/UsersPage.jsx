import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
    Autocomplete,
} from '@mui/material';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useUsers } from '../hooks';
import { MainContext } from '../contexts/MainContext';

const UsersPage = ({ }) => {
    const {
        users,
        loading: usersLoading,
        error: usersError,
        createUser: onCreateUser,
        updateUserData: onUpdateUser,
        deleteUserData: onDeleteUser,
    } = useUsers();

    const [areasLoading, setAreasLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { areas } = useContext(MainContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        areas: [],
    });
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({ name: '', email: '', areas: [] });
        setOpenDialog(true);
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setFormData({
            name: user.name,
            email: user.email || '',
            areas: user.areas || [],
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showSnackbar('Por favor ingresa un nombre', 'error');
            return;
        }

        try {
            const userData = {
                name: formData.name.trim().toUpperCase(),
                email: formData.email.trim() || null,
                areas: formData.areas.map(area => area._id),
            };

            if (editingId) {
                const user = users.find((u) => u._id === editingId);
                await onUpdateUser(editingId, {
                    ...userData,
                    status: user.status,
                });
                showSnackbar('Usuario actualizado correctamente');
            } else {
                await onCreateUser(userData.name, userData.email, userData.areas);
                showSnackbar('Usuario agregado correctamente');
            }

            setOpenDialog(false);
            setFormData({ name: '', email: '', areas: [] });
            setEditingId(null);
        } catch (error) {
            showSnackbar(
                error.message || 'Error al guardar usuario',
                'error'
            );
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setOpenDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await onDeleteUser(deleteTargetId);
            showSnackbar('Usuario eliminado correctamente');
            setOpenDeleteConfirm(false);
            setDeleteTargetId(null);
        } catch (error) {
            showSnackbar(
                error.message || 'Error al eliminar usuario',
                'error'
            );
        }
    };

    const handleCancel = () => {
        setOpenDialog(false);
        setFormData({ name: '', email: '', areas: [] });
        setEditingId(null);
    };

    if (usersLoading || areasLoading) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '18px', mb: 1 }}>
                            Gestionar Usuarios
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#666' }}>
                            Total de usuarios: {users.length}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Plus size={16} />}
                        onClick={handleAddNew}
                        sx={{ textTransform: 'none' }}
                    >
                        Agregar Usuario
                    </Button>
                </Box>

                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Search size={18} color="#999" />
                        <TextField
                            fullWidth
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '13px',
                                    padding: 0,
                                },
                            }}
                        />
                    </Box>
                </Box>

                {usersError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {usersError}
                    </Alert>
                )}

                <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 600, width: '8%', fontSize: '12px' }}>
                                    #
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', width: '30%' }}>
                                    Nombre
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', width: '25%' }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', width: '22%' }}>
                                    Áreas
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        width: '15%',
                                        textAlign: 'center',
                                        fontSize: '12px',
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, idx) => (
                                    <TableRow
                                        key={user._id}
                                        sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                                    >
                                        <TableCell sx={{ fontSize: '12px', fontWeight: 500 }}>
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }}>{user.name}</TableCell>
                                        <TableCell sx={{ fontSize: '12px', color: '#666' }}>
                                            {user.email || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {user.areas && user.areas.length > 0 ? (
                                                    user.areas.map((area) => (
                                                        <Chip
                                                            key={area._id}
                                                            label={`${area.name}`}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '11px',
                                                                height: '22px',
                                                                backgroundColor: '#7c3aed',
                                                                color: '#fff',
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography sx={{ fontSize: '11px', color: '#999' }}>
                                                        Sin áreas
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(user)}
                                                sx={{ color: '#7c3aed' }}
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(user._id)}
                                                sx={{ color: '#ef4444' }}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ color: '#999', fontSize: '13px' }}>
                                            No se encontraron usuarios
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {searchTerm && (
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: '#666' }}>
                            Mostrando {filteredUsers.length} de {users.length} usuarios
                        </Typography>
                    </Box>
                )}
            </Paper>

            <Dialog open={openDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingId ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Nombre del usuario"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: JUAN PEREZ GARCIA"
                        autoFocus
                        sx={{
                            mt: 1,
                            mb: 2,
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Email (opcional)"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ej: juan.perez@empresa.com"
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                            },
                        }}
                    />
                    <Autocomplete
                        multiple
                        options={areas}
                        getOptionLabel={(option) => option.name}
                        value={formData.areas}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                areas: newValue,
                            });
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    key={option._id}
                                    label={option.name}
                                    {...getTagProps({ index })}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#7c3aed',
                                        color: '#fff',
                                    }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Áreas"
                                placeholder="Selecciona áreas"
                                helperText="Selecciona una o más áreas para el usuario"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        {editingId ? 'Actualizar' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteConfirm}
                onClose={() => setOpenDeleteConfirm(false)}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ fontSize: '13px', color: '#666' }}>
                        ¿Estás seguro de que deseas eliminar este usuario? Esta acción no
                        se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteConfirm(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersPage;