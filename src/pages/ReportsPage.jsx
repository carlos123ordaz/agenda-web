import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useAssignments, useWorkTypes, useUsers } from '../hooks';

const ReportsPage = () => {
    const {
        users,
        loading: usersLoading,
    } = useUsers();
    const today = new Date();
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const {
        assignments,
        loading: assignmentsLoading,
        error: assignmentsError,
        loadAssignmentsByMonth
    } = useAssignments();

    const { workTypesMap, loading: workTypesLoading } = useWorkTypes();
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    useEffect(() => {
        if (loadAssignmentsByMonth) {
            loadAssignmentsByMonth(selectedMonth, selectedYear, '6967f14d56df4ec236b8fa88');
        }
    }, [selectedMonth, selectedYear, loadAssignmentsByMonth]);

    const calculateUserStats = useMemo(() => {
        return (userName) => {
            const stats = {};
            Object.keys(workTypesMap).forEach(key => {
                stats[key] = 0;
            });

            const user = users.find(u => u.name === userName);
            if (!user) return stats;

            const userAssignments = assignments.filter(a => {
                let assignmentUserId;
                if (typeof a.userId === 'object' && a.userId !== null) {
                    assignmentUserId = a.userId._id;
                } else {
                    assignmentUserId = a.userId;
                }
                return assignmentUserId === user._id;
            });

            userAssignments.forEach((assignment) => {
                const startDate = new Date(assignment.startDate);
                const endDate = new Date(assignment.endDate);
                const workCode = assignment.workTypeCode;
                const currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                    const month = currentDate.getMonth();
                    const year = currentDate.getFullYear();

                    if (month === selectedMonth && year === selectedYear) {
                        if (stats.hasOwnProperty(workCode)) {
                            stats[workCode]++;
                        }
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });

            return stats;
        };
    }, [assignments, selectedMonth, selectedYear, workTypesMap, users]);

    const sortedUsers = useMemo(() => {
        return [...users].map(u => u.name).sort();
    }, [users]);

    const calculateTotals = useMemo(() => {
        const totals = {};
        Object.keys(workTypesMap).forEach(key => {
            totals[key] = 0;
        });

        sortedUsers.forEach(userName => {
            const stats = calculateUserStats(userName);
            Object.keys(stats).forEach(key => {
                totals[key] += stats[key];
            });
        });

        return totals;
    }, [sortedUsers, calculateUserStats, workTypesMap]);

    const loading = assignmentsLoading || workTypesLoading || usersLoading;

    if (loading) {
        return (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (assignmentsError) {
        return (
            <Box sx={{ flex: 1, p: 3 }}>
                <Alert severity="error">{assignmentsError}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '18px', mb: 1 }}>
                        Reportes de Asignaciones
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#666' }}>
                        Resumen mensual de asignaciones por usuario (días por tipo de trabajo)
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel sx={{ fontSize: '13px' }}>Mes</InputLabel>
                        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label="Mes" size="small">
                            {months.map((month, idx) => (
                                <MenuItem key={idx} value={idx}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ fontSize: '13px' }}>Año</InputLabel>
                        <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Año" size="small">
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ flex: 1 }} />
                </Box>

                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Período</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize', mt: 0.5 }}>
                                {months[selectedMonth]} {selectedYear}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Días disponibles</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{daysInMonth}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Total de usuarios</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{sortedUsers.length}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Asignaciones</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{assignments.length}</Typography>
                        </Box>
                    </Box>
                </Paper>

                <TableContainer component={Paper} sx={{ border: '1px solid #d0d0d0', mb: 3 }}>
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#003d7a' }}>
                                <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '12px', width: '200px', minWidth: '200px' }}>
                                    APELLIDOS Y NOMBRES
                                </TableCell>
                                {Object.entries(workTypesMap).map(([key, data]) => (
                                    <TableCell key={key} sx={{ fontWeight: 600, fontSize: '11px', textAlign: 'center', padding: '12px 4px', flex: 1, minWidth: '60px', backgroundColor: data.color }} title={data.label}>
                                        {key}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedUsers.length > 0 ? (
                                <>
                                    {sortedUsers.map((userName, idx) => {
                                        const stats = calculateUserStats(userName);
                                        return (
                                            <TableRow key={userName} sx={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                                <TableCell sx={{ fontSize: '12px', fontWeight: 500, py: 1.5, width: '200px', minWidth: '200px' }}>
                                                    {userName}
                                                </TableCell>
                                                {Object.keys(workTypesMap).map((key) => (
                                                    <TableCell key={key} sx={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: stats[key] > 0 ? '#000' : '#999', padding: '12px 4px', flex: 1, minWidth: '60px', backgroundColor: stats[key] > 0 ? `${workTypesMap[key].color}40` : 'transparent' }}>
                                                        {stats[key] > 0 ? stats[key] : '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}

                                    <TableRow sx={{ backgroundColor: '#e3f2fd', borderTop: '2px solid #1976d2' }}>
                                        <TableCell sx={{ fontSize: '12px', fontWeight: 700, py: 1.5, width: '200px', minWidth: '200px' }}>TOTALES</TableCell>
                                        {Object.keys(workTypesMap).map((key) => (
                                            <TableCell key={key} sx={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: calculateTotals[key] > 0 ? '#1976d2' : '#999', padding: '12px 4px', flex: 1, minWidth: '60px' }}>
                                                {calculateTotals[key] > 0 ? calculateTotals[key] : '-'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={Object.keys(workTypesMap).length + 1} sx={{ textAlign: 'center', py: 3 }}>
                                        <Typography sx={{ color: '#999', fontSize: '13px' }}>No hay usuarios registrados</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', mb: 2, textTransform: 'uppercase' }}>Leyenda de Asignaciones</Typography>
                    <Grid container spacing={2}>
                        {Object.entries(workTypesMap).map(([key, data]) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ width: '32px', height: '32px', backgroundColor: data.color, borderRadius: '4px', border: '1px solid #d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '11px', flexShrink: 0 }}>
                                        {key}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '12px' }}>{key}</Typography>
                                        <Typography sx={{ fontSize: '11px', color: '#666' }}>{data.label}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Paper>
        </Box>
    );
};

export default ReportsPage;