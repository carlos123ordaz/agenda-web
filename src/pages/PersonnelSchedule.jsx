import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import CalendarView from '../components/CalendarView';
import AvailabilityView from '../components/AvailabilityView';
import WorkTypesDialog from '../components/WorkTypesDialog';
import { useUsers, useAssignments, useCalendar, useScheduleData } from '../hooks';

const PersonnelSchedule = ({ workTypesMap = {}, workTypes = [], onLoadWorkTypes, onCreateWorkType, onUpdateWorkType, onDeleteWorkType }) => {
    const {
        users,
        loading: usersLoading,
        error: usersError,
        createUser,
    } = useUsers();

    const {
        currentDate,
        month,
        year,
        monthName,
        daysInMonth,
        getDaysInMonth,
        getFirstDayOfMonth,
        handlePrevMonth,
        handleNextMonth,
    } = useCalendar();

    // ✓ Hook optimizado: ahora acepta mes/año inicial
    const {
        assignments,
        loading: assignmentsLoading,
        error: assignmentsError,
        loadAssignmentsByMonth,
        createAssignment,
        updateAssignment,
        deleteAssignment,
    } = useAssignments(month, year);

    const {
        schedule,
        buildScheduleMap,
        getScheduleItem,
    } = useScheduleData(assignments, users);

    const [viewMode, setViewMode] = useState('calendar');
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openWorkTypesDialog, setOpenWorkTypesDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [workType, setWorkType] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [newPerson, setNewPerson] = useState('');
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);
    const [addingPersonLoading, setAddingPersonLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // ✓ Recargar asignaciones cuando cambia el mes/año
    useEffect(() => {
        console.log('📅 Loading assignments for:', { month, year });
        loadAssignmentsByMonth(month, year);
    }, [month, year, loadAssignmentsByMonth]);

    const userNames = useMemo(() => users.map((u) => u.name), [users]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDateClick = (day, person) => {
        setSelectedDate(day);
        setSelectedPerson(person);
        setEndDate(day);
        setEditingAssignmentId(null);
        setWorkType('');
        setOpenDialog(true);
    };

    const handleEditAssignment = (startDay, endDay, person, workTypeCode) => {
        setSelectedDate(startDay);
        setSelectedPerson(person);
        setEndDate(endDay);
        setWorkType(workTypeCode);

        const user = users.find(u => u.name === person);
        if (!user) return;

        const existingAssignment = assignments.find((a) => {
            let assignmentUserId;
            if (typeof a.userId === 'object' && a.userId !== null) {
                assignmentUserId = a.userId._id;
            } else {
                assignmentUserId = a.userId;
            }

            return (
                assignmentUserId === user._id &&
                new Date(a.startDate).getDate() === startDay &&
                a.workTypeCode === workTypeCode
            );
        });

        if (existingAssignment) {
            setEditingAssignmentId(existingAssignment._id);
        }

        setOpenDialog(true);
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await deleteAssignment(assignmentId);
            showSnackbar('Asignación eliminada correctamente');
        } catch (error) {
            console.error('Error deleting assignment:', error);
            showSnackbar(
                error.message || 'Error al eliminar asignación',
                'error'
            );
        }
    };

    const handleSaveSchedule = async () => {
        if (!workType || !selectedDate || !selectedPerson || !endDate) {
            showSnackbar('Por favor completa todos los campos', 'error');
            return;
        }

        if (selectedDate > endDate) {
            showSnackbar('La fecha inicial no puede ser mayor a la final', 'error');
            return;
        }

        try {
            const user = users.find((u) => u.name === selectedPerson);
            if (!user) {
                showSnackbar('Usuario no encontrado', 'error');
                return;
            }

            const startDateObj = new Date(year, month, selectedDate);
            const endDateObj = new Date(year, month, endDate);

            const assignmentData = {
                userId: user._id,
                workTypeCode: workType.toUpperCase(),
                startDate: startDateObj.toISOString(),
                endDate: endDateObj.toISOString(),
            };

            if (editingAssignmentId) {
                await updateAssignment(editingAssignmentId, assignmentData);
                showSnackbar('Asignación actualizada correctamente');
            } else {
                await createAssignment(assignmentData);
                showSnackbar('Asignación creada correctamente');
            }

            setOpenDialog(false);
            setWorkType('');
            setEndDate(null);
            setSelectedDate(null);
            setSelectedPerson(null);
            setEditingAssignmentId(null);
        } catch (error) {
            showSnackbar(
                error.message || 'Error al guardar asignación',
                'error'
            );
        }
    };

    const handleAddPerson = () => {
        setOpenAddDialog(true);
    };

    const handleConfirmAddPerson = async () => {
        if (!newPerson.trim()) {
            showSnackbar('Por favor ingresa un nombre', 'error');
            return;
        }

        try {
            setAddingPersonLoading(true);
            await createUser(newPerson.trim().toUpperCase());
            showSnackbar('Personal agregado correctamente');
            setNewPerson('');
            setOpenAddDialog(false);
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Error al agregar personal',
                'error'
            );
        } finally {
            setAddingPersonLoading(false);
        }
    };

    const loading = usersLoading || assignmentsLoading;
    const error = usersError || assignmentsError;

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

    if (error) {
        return (
            <Box sx={{ flex: 1, p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                <Tabs
                    value={viewMode === 'calendar' ? 0 : 1}
                    onChange={(e, val) => setViewMode(val === 0 ? 'calendar' : 'availability')}
                    sx={{ pl: 2, minHeight: 44 }}
                >
                    <Tab label="Calendario" />
                    <Tab label="Disponibilidad" />
                </Tabs>
            </Box>

            {viewMode === 'calendar' ? (
                <CalendarView
                    key={`${month}-${year}`}
                    currentDate={currentDate}
                    personnel={userNames}
                    schedule={schedule}
                    workTypes={workTypesMap}
                    getDaysInMonth={getDaysInMonth}
                    getFirstDayOfMonth={getFirstDayOfMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onDateClick={handleDateClick}
                    onAddPerson={handleAddPerson}
                    onOpenWorkTypesDialog={() => setOpenWorkTypesDialog(true)}
                    onEditAssignment={handleEditAssignment}
                    onDeleteAssignment={handleDeleteAssignment}
                />
            ) : (
                <AvailabilityView
                    currentDate={currentDate}
                    personnel={userNames}
                    schedule={schedule}
                    workTypes={workTypesMap}
                />
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingAssignmentId ? 'Editar asignación' : 'Asignar trabajo'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography sx={{ fontSize: '13px', color: '#666', mb: 2 }}>
                        Persona: <strong>{selectedPerson}</strong>
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#666', mb: 3 }}>
                        Fecha inicial:{' '}
                        <strong>
                            {selectedDate} de{' '}
                            {currentDate.toLocaleDateString('es-ES', {
                                month: 'long',
                            })}
                        </strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de trabajo</InputLabel>
                            <Select
                                value={workType}
                                onChange={(e) => setWorkType(e.target.value)}
                                label="Tipo de trabajo"
                            >
                                {Object.entries(workTypesMap).map(([key, data]) => (
                                    <MenuItem key={key} value={key}>
                                        {key} - {data.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1 }}>
                            ¿Rango de días?
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#666', mb: 2 }}>
                            Si el trabajo se extiende por varios días, ingresa el día final
                        </Typography>
                        <TextField
                            type="number"
                            label="Día final (opcional)"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(Math.max(selectedDate, parseInt(e.target.value) || selectedDate))
                            }
                            inputProps={{ min: selectedDate, max: daysInMonth }}
                            fullWidth
                            size="small"
                            helperText={`Desde ${selectedDate} hasta ${endDate}`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveSchedule} variant="contained">
                        {editingAssignmentId ? 'Actualizar' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Agregar personal</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        fullWidth
                        label="Nombre del personal"
                        value={newPerson}
                        onChange={(e) => setNewPerson(e.target.value)}
                        placeholder="Ej: JUAN PEREZ GARCIA"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleConfirmAddPerson();
                            }
                        }}
                        disabled={addingPersonLoading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} disabled={addingPersonLoading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAddPerson}
                        variant="contained"
                        disabled={addingPersonLoading || !newPerson.trim()}
                    >
                        {addingPersonLoading ? 'Agregando...' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <WorkTypesDialog
                open={openWorkTypesDialog}
                onClose={() => setOpenWorkTypesDialog(false)}
                workTypes={workTypes}
                workTypesMap={workTypesMap}
                onCreateWorkType={onCreateWorkType}
                onUpdateWorkType={onUpdateWorkType}
                onDeleteWorkType={onDeleteWorkType}
            />

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

export default PersonnelSchedule;