import { useState, useEffect, useCallback } from 'react';
import { workTypeService } from '../services';

export const useWorkTypes = () => {
    const [workTypes, setWorkTypes] = useState([]);
    const [workTypesMap, setWorkTypesMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAllWorkTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await workTypeService.getAllWorkTypes();
            setWorkTypes(data);

            const map = {};
            data.forEach((wt) => {
                map[wt.code] = {
                    label: wt.label,
                    color: wt.color,
                };
            });
            setWorkTypesMap(map);
        } catch (err) {
            setError(err.message || 'Error al cargar tipos de trabajo');
            console.error('Error loading work types:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createWorkType = useCallback(async (code, label, color) => {
        try {
            setError(null);
            const newWorkType = await workTypeService.createWorkType({
                code,
                label,
                color,
            });
            setWorkTypes((prev) => [...prev, newWorkType]);

            setWorkTypesMap((prev) => ({
                ...prev,
                [newWorkType.code]: {
                    label: newWorkType.label,
                    color: newWorkType.color,
                },
            }));

            return newWorkType;
        } catch (err) {
            const errorMessage = err.message || 'Error al crear tipo de trabajo';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const updateWorkType = useCallback(async (code, label, color) => {
        try {
            setError(null);
            const updated = await workTypeService.updateWorkType(code, {
                label,
                color,
            });

            setWorkTypes((prev) =>
                prev.map((wt) => (wt.code === code ? updated : wt))
            );

            setWorkTypesMap((prev) => ({
                ...prev,
                [code]: {
                    label: updated.label,
                    color: updated.color,
                },
            }));

            return updated;
        } catch (err) {
            const errorMessage = err.message || 'Error al actualizar tipo de trabajo';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const deleteWorkType = useCallback(async (code) => {
        try {
            setError(null);
            await workTypeService.deleteWorkType(code);
            setWorkTypes((prev) => prev.filter((wt) => wt.code !== code));

            setWorkTypesMap((prev) => {
                const updated = { ...prev };
                delete updated[code];
                return updated;
            });
        } catch (err) {
            const errorMessage = err.message || 'Error al eliminar tipo de trabajo';
            setError(errorMessage);
            throw err;
        }
    }, []);

    // ✓ Incluir loadAllWorkTypes en las dependencias
    useEffect(() => {
        loadAllWorkTypes();
    }, [loadAllWorkTypes]);

    return {
        workTypes,
        workTypesMap,
        loading,
        error,
        loadAllWorkTypes,
        createWorkType,
        updateWorkType,
        deleteWorkType,
    };
};