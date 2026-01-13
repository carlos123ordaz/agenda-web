import { useState, useCallback, useMemo } from 'react';

export const useCalendar = () => {
    // ✓ Inicializar con la fecha actual en lugar de una fecha fija
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const getDaysInMonth = useCallback((date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, []);

    const getFirstDayOfMonth = useCallback((date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }, []);

    const handlePrevMonth = useCallback(() => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const handleNextMonth = useCallback(() => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const handleToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const monthName = useMemo(() => {
        return new Date(year, month).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
    }, [month, year]);

    const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate, getDaysInMonth]);

    const firstDay = useMemo(() => getFirstDayOfMonth(currentDate), [currentDate, getFirstDayOfMonth]);

    return {
        currentDate,
        setCurrentDate,
        month,
        year,
        monthName,
        daysInMonth,
        firstDay,
        getDaysInMonth,
        getFirstDayOfMonth,
        handlePrevMonth,
        handleNextMonth,
        handleToday,
    };
};