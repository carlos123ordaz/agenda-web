import { useState, useCallback, useEffect, useMemo } from 'react';

export const useScheduleData = (assignments, users) => {
    const [schedule, setSchedule] = useState({});

    // Crear un mapa de userId a nombre de usuario
    const userIdToNameMap = useMemo(() => {
        const map = {};
        if (users && Array.isArray(users)) {
            users.forEach((user) => {
                if (user._id) {
                    map[user._id] = user.name;
                }
            });
        }
        return map;
    }, [users]);

    // Función para construir el mapa de schedule
    const buildScheduleMap = useCallback(() => {
        const map = {};

        // Verificar que tanto assignments como users estén disponibles
        if (!assignments || assignments.length === 0 || !users || users.length === 0) {
            setSchedule(map);
            return map;
        }


        assignments.forEach((assignment) => {
            try {

                let userId;
                let userName;

                if (typeof assignment.userId === 'object' && assignment.userId !== null) {
                    // Si userId está populated (es un objeto)
                    userId = assignment.userId._id;
                    userName = assignment.userId.name;
                } else if (typeof assignment.userId === 'string') {
                    // Si userId es solo el ID (string)
                    userId = assignment.userId;
                    userName = userIdToNameMap[userId];
                } else {
                    console.warn('Invalid userId format:', assignment.userId);
                    return;
                }

                if (!userName) {
                    console.warn(`Usuario no encontrado para userId: ${userId}`);
                    return;
                }

                const startDate = new Date(assignment.startDate);
                const endDate = new Date(assignment.endDate);

                // Iterar por cada día en el rango de la asignación
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const day = d.getDate();
                    const month = d.getMonth();
                    const year = d.getFullYear();
                    const key = `${month}-${year}-${day}-${userName}`;

                    map[key] = {
                        assignmentId: assignment._id,
                        workTypeCode: assignment.workTypeCode,
                        startDate: assignment.startDate,
                        endDate: assignment.endDate,
                        userId: userId,
                    };
                }
            } catch (error) {
                console.error('Error processing assignment:', assignment, error);
            }
        });


        setSchedule(map);
        return map;
    }, [assignments, users, userIdToNameMap]);

    // Re-construir el schedule cuando cambian los assignments o usuarios
    useEffect(() => {
        buildScheduleMap();
    }, [buildScheduleMap]);

    const getScheduleItem = useCallback(
        (day, month, year, person) => {
            const key = `${month}-${year}-${day}-${person}`;
            return schedule[key] || null;
        },
        [schedule]
    );

    const addScheduleItem = useCallback((day, month, year, person, data) => {
        const key = `${month}-${year}-${day}-${person}`;
        setSchedule((prev) => ({
            ...prev,
            [key]: data,
        }));
    }, []);

    const removeScheduleItem = useCallback((day, month, year, person) => {
        const key = `${month}-${year}-${day}-${person}`;
        setSchedule((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    }, []);

    const removeScheduleRange = useCallback((startDay, endDay, month, year, person) => {
        setSchedule((prev) => {
            const updated = { ...prev };
            for (let day = startDay; day <= endDay; day++) {
                const key = `${month}-${year}-${day}-${person}`;
                delete updated[key];
            }
            return updated;
        });
    }, []);

    // Obtener nombres de usuarios para cálculos
    const userNames = useCallback(() => {
        if (users && Array.isArray(users)) {
            return users.map((u) => u.name || u);
        }
        return [];
    }, [users]);

    const getPersonAssignments = useCallback(
        (person, month, year) => {
            const assignmentsList = [];
            for (let day = 1; day <= 31; day++) {
                const item = getScheduleItem(day, month, year, person);
                if (item) {
                    assignmentsList.push({ day, ...item });
                }
            }
            return assignmentsList;
        },
        [getScheduleItem]
    );

    const getAvailablePersonnel = useCallback(
        (day, month, year) => {
            const names = userNames();
            return names.filter((user) => {
                const item = getScheduleItem(day, month, year, user);
                return !item;
            });
        },
        [userNames, getScheduleItem]
    );

    const getUnavailablePersonnel = useCallback(
        (day, month, year) => {
            const names = userNames();
            return names.filter((user) => {
                const item = getScheduleItem(day, month, year, user);
                return item;
            });
        },
        [userNames, getScheduleItem]
    );

    return {
        schedule,
        setSchedule,
        buildScheduleMap,
        getScheduleItem,
        addScheduleItem,
        removeScheduleItem,
        removeScheduleRange,
        getPersonAssignments,
        getAvailablePersonnel,
        getUnavailablePersonnel,
    };
};