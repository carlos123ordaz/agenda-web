import React, { useState } from 'react';
import {
    Box,
    Paper,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Plus,
    Settings,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Trash2,
    Edit2,
} from 'lucide-react';

const CalendarView = ({
    currentDate,
    personnel,
    schedule,
    workTypes,
    getDaysInMonth,
    getFirstDayOfMonth,
    onPrevMonth,
    onNextMonth,
    onDateClick,
    onAddPerson,
    onOpenWorkTypesDialog,
    onEditAssignment,
    onDeleteAssignment,
}) => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(currentDate);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const currentDay = isCurrentMonth ? today.getDate() : null;

    const monthName = new Date(year, month).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    });

    const generateCalendarDays = () => {
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    const getScheduleItem = (day, person) => {
        const key = `${month}-${year}-${day}-${person}`;
        return schedule[key] || null;
    };

    const getDayLetter = (day) => {
        const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
        const date = new Date(year, month, day);
        return days[date.getDay()];
    };

    const getColspan = (day, person) => {
        let colspan = 1;
        const currentType = getScheduleItem(day, person);

        if (!currentType) return 1;

        for (let nextDay = day + 1; nextDay <= daysInMonth; nextDay++) {
            const nextType = getScheduleItem(nextDay, person);
            if (nextType && nextType.workTypeCode === currentType.workTypeCode) {
                colspan++;
            } else {
                break;
            }
        }

        return colspan;
    };

    const getRangeEnd = (day, person) => {
        const currentType = getScheduleItem(day, person);
        if (!currentType) return day;

        let endDay = day;
        for (let nextDay = day + 1; nextDay <= daysInMonth; nextDay++) {
            const nextType = getScheduleItem(nextDay, person);
            if (nextType && nextType.workTypeCode === currentType.workTypeCode) {
                endDay = nextDay;
            } else {
                break;
            }
        }

        return endDay;
    };

    const handleContextMenu = (event, day, person, item) => {
        if (!item) return;

        event.preventDefault();
        event.stopPropagation();

        setSelectedAssignment({
            day,
            person,
            item,
            endDay: getRangeEnd(day, person),
        });

        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleEditFromContext = () => {
        if (selectedAssignment) {
            onEditAssignment(
                selectedAssignment.day,
                selectedAssignment.endDay,
                selectedAssignment.person,
                selectedAssignment.item.workTypeCode
            );
        }
        handleCloseContextMenu();
    };

    const handleDeleteFromContext = () => {
        setDeleteConfirmOpen(true);
        handleCloseContextMenu();
    };

    const handleConfirmDelete = () => {
        if (selectedAssignment && onDeleteAssignment) {
            onDeleteAssignment(selectedAssignment.item.assignmentId);
        }
        setDeleteConfirmOpen(false);
        setSelectedAssignment(null);
    };

    const calendarDays = generateCalendarDays();
    const cellSize = '45px';

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={onPrevMonth}>
                                <ChevronLeft size={18} />
                            </IconButton>
                            <Typography
                                sx={{
                                    minWidth: 160,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {monthName}
                            </Typography>
                            <IconButton size="small" onClick={onNextMonth}>
                                <ChevronRight size={18} />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={onAddPerson}
                            sx={{ textTransform: 'none' }}
                        >
                            Agregar Personal
                        </Button>
                        <IconButton size="small" onClick={onOpenWorkTypesDialog}>
                            <Settings size={18} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Object.entries(workTypes).map(([key, data]) => (
                        <Box
                            key={key}
                            sx={{
                                backgroundColor: data.color,
                                color: '#000',
                                fontSize: '10px',
                                fontWeight: 500,
                                height: 20,
                                padding: '0 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title={data.label}
                        >
                            {key}
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #d0d0d0',
                    }}
                >
                    <Box sx={{ overflowX: 'auto' }}>
                        <table
                            style={{
                                borderCollapse: 'collapse',
                                fontSize: '12px',
                                minWidth: 'fit-content',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            padding: '12px',
                                            borderRight: '1px solid #d0d0d0',
                                            borderBottom: '1px solid #d0d0d0',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            minWidth: '140px',
                                            backgroundColor: '#f5f5f5',
                                            fontSize: '11px',
                                        }}
                                    >
                                        APELLIDOS Y NOMBRES
                                    </th>
                                    {calendarDays.map((day) => {
                                        const isToday = currentDay === day;
                                        return (
                                            <th
                                                key={day}
                                                style={{
                                                    width: '51px',
                                                    height: cellSize,
                                                    borderRight: '1px solid #d0d0d0',
                                                    borderBottom: '1px solid #d0d0d0',
                                                    textAlign: 'center',
                                                    verticalAlign: 'middle',
                                                    backgroundColor: isToday ? '#e3f2fd' : '#f5f5f5',
                                                    padding: 0,
                                                    fontSize: '10px',
                                                    position: 'relative',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: '9px',
                                                        color: isToday ? '#1976d2' : '#7c3aed',
                                                        lineHeight: '1',
                                                    }}
                                                >
                                                    {getDayLetter(day)}
                                                </div>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: '12px',
                                                        lineHeight: '1',
                                                        color: isToday ? '#1976d2' : 'inherit',
                                                    }}
                                                >
                                                    {day}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {personnel.map((person, personIdx) => {
                                    return (
                                        <tr key={person}>
                                            <td
                                                style={{
                                                    padding: '12px',
                                                    borderRight: '1px solid #d0d0d0',
                                                    borderBottom: '1px solid #d0d0d0',
                                                    fontWeight: 500,
                                                    fontSize: '11px',
                                                    backgroundColor: personIdx % 2 === 0 ? '#fafafa' : '#fff',
                                                    minWidth: '140px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: '140px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                    title={person}
                                                >
                                                    {person}
                                                </div>
                                            </td>
                                            {calendarDays.map((day) => {
                                                const item = getScheduleItem(day, person);
                                                const letterDay = getDayLetter(day);
                                                const workData = item ? workTypes[item.workTypeCode] : null;
                                                const colspan = getColspan(day, person);
                                                const isToday = currentDay === day;

                                                let isSkipped = false;
                                                for (let prevDay = day - 1; prevDay >= 1; prevDay--) {
                                                    const prevItem = getScheduleItem(prevDay, person);
                                                    if (
                                                        prevItem &&
                                                        item &&
                                                        prevItem.workTypeCode === item.workTypeCode
                                                    ) {
                                                        isSkipped = true;
                                                        break;
                                                    } else if (!prevItem || !item) {
                                                        break;
                                                    }
                                                }

                                                if (isSkipped) {
                                                    return null;
                                                }
                                                let bgColor;
                                                if (workData) {
                                                    bgColor = workData.color;
                                                } else if (isToday) {
                                                    bgColor = '#eff8ffff';
                                                } else if (letterDay === 'D' || letterDay === 'S') {
                                                    bgColor = '#ebebeb';
                                                } else {
                                                    bgColor = personIdx % 2 === 0 ? '#fafafa' : '#fff';
                                                }

                                                return (
                                                    <Tooltip
                                                        key={day}
                                                        title={
                                                            workData
                                                                ? `${workData.label}`
                                                                : 'Sin asignar'
                                                        }
                                                        arrow
                                                    >
                                                        <td
                                                            colSpan={colspan}
                                                            onClick={() => {
                                                                if (item) {
                                                                    const endDay = getRangeEnd(day, person);
                                                                    onEditAssignment(day, endDay, person, item.workTypeCode);
                                                                } else {
                                                                    onDateClick(day, person);
                                                                }
                                                            }}
                                                            onContextMenu={(e) => handleContextMenu(e, day, person, item)}
                                                            style={{
                                                                borderRight: '1px solid #d0d0d0',
                                                                borderBottom: '1px solid #d0d0d0',
                                                                backgroundColor: bgColor,
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                color: '#333',
                                                                fontWeight: workData ? 600 : 400,
                                                                fontSize: '10px',
                                                                padding: '0',
                                                                position: 'relative',
                                                                height: cellSize,
                                                                width:
                                                                    colspan > 1
                                                                        ? `calc(${cellSize} * ${colspan})`
                                                                        : cellSize,
                                                                lineHeight: cellSize,
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!item) {
                                                                    e.target.style.boxShadow =
                                                                        'inset 0 0 4px rgba(0,0,0,0.15)';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (!item) {
                                                                    e.target.style.boxShadow = 'none';
                                                                }
                                                            }}
                                                        >
                                                            {item ? item.workTypeCode : ''}
                                                        </td>
                                                    </Tooltip>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </Paper>
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleEditFromContext}>
                    <Edit2 size={16} style={{ marginRight: 8 }} />
                    Editar asignación
                </MenuItem>
                <MenuItem onClick={handleDeleteFromContext} sx={{ color: '#ef4444' }}>
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Eliminar asignación
                </MenuItem>
            </Menu>
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ fontSize: '13px', color: '#666' }}>
                        ¿Estás seguro de que deseas eliminar esta asignación?
                    </Typography>
                    {selectedAssignment && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                            <Typography sx={{ fontSize: '12px', mb: 0.5 }}>
                                <strong>Personal:</strong> {selectedAssignment.person}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', mb: 0.5 }}>
                                <strong>Tipo:</strong>{' '}
                                {workTypes[selectedAssignment.item.workTypeCode]?.label ||
                                    selectedAssignment.item.workTypeCode}
                            </Typography>
                            <Typography sx={{ fontSize: '12px' }}>
                                <strong>Días:</strong> {selectedAssignment.day} al {selectedAssignment.endDay}
                            </Typography>
                        </Box>
                    )}
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
        </Box>
    );
};

const arePropsEqual = (prevProps, nextProps) => {
    if (prevProps.currentDate.getTime() !== nextProps.currentDate.getTime()) {
        return false;
    }

    if (prevProps.personnel.length !== nextProps.personnel.length) {
        return false;
    }
    if (prevProps.personnel.some((p, i) => p !== nextProps.personnel[i])) {
        return false;
    }

    const prevScheduleKeys = Object.keys(prevProps.schedule);
    const nextScheduleKeys = Object.keys(nextProps.schedule);
    if (prevScheduleKeys.length !== nextScheduleKeys.length) {
        return false;
    }

    const prevWorkTypeKeys = Object.keys(prevProps.workTypes);
    const nextWorkTypeKeys = Object.keys(nextProps.workTypes);
    if (prevWorkTypeKeys.length !== nextWorkTypeKeys.length) {
        return false;
    }

    return true;
};

export default React.memo(CalendarView, arePropsEqual);