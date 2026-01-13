import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const WorkTypesDialog = ({
    open,
    onClose,
    workTypes = [],
    workTypesMap = {},
    onCreateWorkType,
    onUpdateWorkType,
    onDeleteWorkType,
}) => {
    const [editingCode, setEditingCode] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        label: '',
        color: '#000000',
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetCode, setDeleteTargetCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleAddNew = () => {
        setEditingCode(null);
        setFormData({ code: '', label: '', color: '#000000' });
    };

    const handleEdit = (workType) => {
        setEditingCode(workType.code);
        setFormData({
            code: workType.code,
            label: workType.label,
            color: workType.color,
        });
    };

    const handleSave = async () => {
        if (!formData.code || !formData.label || !formData.color) {
            showSnackbar('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            setLoading(true);
            if (editingCode) {
                if (onUpdateWorkType) {
                    await onUpdateWorkType(formData.code, formData.label, formData.color);
                }
                showSnackbar('Tipo de trabajo actualizado correctamente');
            } else {
                if (onCreateWorkType) {
                    await onCreateWorkType(formData.code, formData.label, formData.color);
                }
                showSnackbar('Tipo de trabajo agregado correctamente');
            }
            setEditingCode(null);
            setFormData({ code: '', label: '', color: '#000000' });
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Error al guardar tipo de trabajo',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (code) => {
        setDeleteTargetCode(code);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            if (onDeleteWorkType) {
                await onDeleteWorkType(deleteTargetCode);
            }
            showSnackbar('Tipo de trabajo eliminado correctamente');
            setDeleteConfirmOpen(false);
            setDeleteTargetCode(null);
        } catch (error) {
            showSnackbar(
                error.response?.data?.message ||
                'Error al eliminar tipo de trabajo',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingCode(null);
        setFormData({ code: '', label: '', color: '#000000' });
    };

    const handleCloseDialog = () => {
        handleCancel();
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, fontSize: '16px' }}>
                    Gestionar Tipos de Asignación
                </DialogTitle>

                <DialogContent sx={{ pt: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {apiError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {apiError}
                                </Alert>
                            )}

                            <Box sx={{ mb: 3 }}>
                                <TableContainer
                                    component={Paper}
                                    sx={{ border: '1px solid #e0e0e0' }}
                                >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 600, width: '10%' }}>
                                                    Inicial
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>
                                                    Descripción
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                                                    Color
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 600,
                                                        width: '15%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Acciones
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {workTypes && workTypes.length > 0 ? (
                                                workTypes.map((workType) => (
                                                    <TableRow key={workType._id}>
                                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>
                                                            {workType.code}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '12px' }}>
                                                            {workType.label}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box
                                                                sx={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    backgroundColor: workType.color,
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #d0d0d0',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    fontSize: '10px',
                                                                    fontWeight: 600,
                                                                }}
                                                                title={workType.color}
                                                            >
                                                                {workType.color}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEdit(workType)}
                                                                sx={{ color: '#7c3aed' }}
                                                            >
                                                                <Edit2 size={16} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteClick(workType.code)}
                                                                sx={{ color: '#ef4444' }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                                                        <Box sx={{ color: '#999', fontSize: '13px' }}>
                                                            No hay tipos de trabajo
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            <Paper
                                sx={{
                                    p: 3,
                                    backgroundColor: '#f9f9f9',
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Plus size={16} />
                                    <Box sx={{ fontWeight: 600, fontSize: '14px' }}>
                                        {editingCode ? 'Editar Tipo de Asignación' : 'Agregar Nuevo Tipo'}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 2 }}>
                                    <TextField
                                        label="Inicial (Ej: VSC)"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value.toUpperCase(),
                                            })
                                        }
                                        size="small"
                                        placeholder="VSC"
                                        disabled={editingCode !== null}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontSize: '13px',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Descripción"
                                        value={formData.label}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                label: e.target.value,
                                            })
                                        }
                                        size="small"
                                        placeholder="Ej: Visita Sin Confirmar"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontSize: '13px',
                                            },
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField
                                            label="Color"
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    color: e.target.value,
                                                })
                                            }
                                            size="small"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '40px',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                },
                                                flex: 1,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: formData.color,
                                                borderRadius: '4px',
                                                border: '1px solid #d0d0d0',
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        mt: 2,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    {editingCode && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCancel}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSave}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {editingCode ? 'Actualizar' : 'Agregar'}
                                    </Button>
                                </Box>
                            </Paper>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ fontSize: '13px', color: '#666' }}>
                        ¿Estás seguro de que deseas eliminar este tipo de asignación? Esta
                        acción no se puede deshacer.
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
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
        </>
    );
};

export default WorkTypesDialog;