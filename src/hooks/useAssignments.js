import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '../services';

export const useAssignments = (month = null, year = null) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(month);
    const [currentYear, setCurrentYear] = useState(year);

    // ✓ Cargar asignaciones del mes actual
    const loadAssignmentsByMonth = useCallback(async (targetMonth, targetYear) => {
        try {
            setLoading(true);
            setError(null);
            const data = await assignmentService.getAssignmentsByMonth(targetMonth, targetYear);
            setAssignments(data);
            setCurrentMonth(targetMonth);
            setCurrentYear(targetYear);
            return data;
        } catch (err) {
            setError(err.message || 'Error al cargar asignaciones del mes');
            console.error('Error loading assignments by month:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // ✓ Función alternativa para cargar todas (solo cuando sea necesario)
    const loadAllAssignments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await assignmentService.getAllAssignments();
            setAssignments(data);
            setCurrentMonth(null);
            setCurrentYear(null);
        } catch (err) {
            setError(err.message || 'Error al cargar asignaciones');
            console.error('Error loading assignments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAssignmentsByUser = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await assignmentService.getAssignmentsByUser(userId);
            return data;
        } catch (err) {
            setError(err.message || 'Error al cargar asignaciones del usuario');
            console.error('Error loading assignments by user:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAssignmentsByDateRange = useCallback(async (startDate, endDate) => {
        try {
            setLoading(true);
            setError(null);
            const data = await assignmentService.getAssignmentsByDateRange(
                startDate,
                endDate
            );
            return data;
        } catch (err) {
            setError(err.message || 'Error al cargar asignaciones por rango');
            console.error('Error loading assignments by date range:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createAssignment = useCallback(async (assignmentData) => {
        try {
            setError(null);
            const newAssignment = await assignmentService.createAssignment(
                assignmentData
            );

            // ✓ Agregar a la lista solo si pertenece al mes actual filtrado
            const assignmentMonth = new Date(newAssignment.startDate).getMonth();
            const assignmentYear = new Date(newAssignment.startDate).getFullYear();

            if (currentMonth === null || (assignmentMonth === currentMonth && assignmentYear === currentYear)) {
                setAssignments((prev) => [...prev, newAssignment]);
            }

            return newAssignment;
        } catch (err) {
            const errorMessage = err.message || 'Error al crear asignación';
            setError(errorMessage);
            throw err;
        }
    }, [currentMonth, currentYear]);

    const updateAssignment = useCallback(async (id, assignmentData) => {
        try {
            setError(null);
            const updated = await assignmentService.updateAssignment(id, assignmentData);

            // ✓ Actualizar en la lista o remover si ya no pertenece al mes filtrado
            const assignmentMonth = new Date(updated.startDate).getMonth();
            const assignmentYear = new Date(updated.startDate).getFullYear();

            if (currentMonth === null || (assignmentMonth === currentMonth && assignmentYear === currentYear)) {
                setAssignments((prev) =>
                    prev.map((a) => (a._id === id ? updated : a))
                );
            } else {
                // Remover si ya no pertenece al mes
                setAssignments((prev) => prev.filter((a) => a._id !== id));
            }

            return updated;
        } catch (err) {
            const errorMessage = err.message || 'Error al actualizar asignación';
            setError(errorMessage);
            throw err;
        }
    }, [currentMonth, currentYear]);

    const deleteAssignment = useCallback(async (id) => {
        try {
            setError(null);
            await assignmentService.deleteAssignment(id);
            setAssignments((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            const errorMessage = err.message || 'Error al eliminar asignación';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const deleteAssignmentsByUserAndMonth = useCallback(
        async (userId, month, year) => {
            try {
                setError(null);
                await assignmentService.deleteAssignmentsByUserAndMonth(userId, month, year);
                setAssignments((prev) =>
                    prev.filter(
                        (a) => !(a.userId === userId && a.month === month && a.year === year)
                    )
                );
            } catch (err) {
                const errorMessage =
                    err.message || 'Error al eliminar asignaciones del mes';
                setError(errorMessage);
                throw err;
            }
        },
        []
    );

    // ✓ Carga inicial: solo si se pasa mes/año, sino espera a que se llame manualmente
    useEffect(() => {
        if (month !== null && year !== null) {
            loadAssignmentsByMonth(month, year);
        }
    }, []); // Solo al montar

    return {
        assignments,
        loading,
        error,
        currentMonth,
        currentYear,
        loadAllAssignments,
        loadAssignmentsByMonth,
        loadAssignmentsByUser,
        loadAssignmentsByDateRange,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        deleteAssignmentsByUserAndMonth,
    };
};