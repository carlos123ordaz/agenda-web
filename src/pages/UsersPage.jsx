import React, { useState } from 'react';
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
} from '@mui/material';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useUsers } from '../hooks';

const UsersPage = () => {
    const {
        users,
        loading,
        error: apiError,
        createUser,
        updateUserData,
        deleteUserData,
    } = useUsers();

    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState('');
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
        setFormData('');
        setOpenDialog(true);
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setFormData(user.name);
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!formData.trim()) {
            showSnackbar('Por favor ingresa un nombre', 'error');
            return;
        }

        try {
            if (editingId) {
                const user = users.find((u) => u._id === editingId);
                await updateUserData(editingId, {
                    name: formData.trim().toUpperCase(),
                    email: user.email,
                    status: user.status,
                });
                showSnackbar('Usuario actualizado correctamente');
            } else {
                await createUser(formData.trim().toUpperCase());
                showSnackbar('Usuario agregado correctamente');
            }
            setOpenDialog(false);
            setFormData('');
            setEditingId(null);
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Error al guardar usuario',
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
            await deleteUserData(deleteTargetId);
            showSnackbar('Usuario eliminado correctamente');
            setOpenDeleteConfirm(false);
            setDeleteTargetId(null);
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Error al eliminar usuario',
                'error'
            );
        }
    };

    const handleCancel = () => {
        setOpenDialog(false);
        setFormData('');
        setEditingId(null);
    };

    if (loading) {
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

                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 600, width: '10%', fontSize: '12px' }}>
                                    #
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>
                                    Nombre
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
                                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
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
                        value={formData}
                        onChange={(e) => setFormData(e.target.value)}
                        placeholder="Ej: JUAN PEREZ GARCIA"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                        autoFocus
                        sx={{
                            mt: 1,
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                            },
                        }}
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