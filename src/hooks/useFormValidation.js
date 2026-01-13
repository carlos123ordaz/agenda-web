import { useState, useCallback } from 'react';

export const useFormValidation = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // ✓ Eliminar dependencia de 'errors' usando función de actualización
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // ✓ Usar función de actualización para evitar dependencia
        setErrors((prev) => {
            if (prev[name]) {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            }
            return prev;
        });
    }, []); // ✓ Sin dependencias

    const setFieldValue = useCallback((name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // ✓ Usar función de actualización
        setErrors((prev) => {
            if (prev[name]) {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            }
            return prev;
        });
    }, []); // ✓ Sin dependencias

    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    const clearForm = useCallback(() => {
        setFormData(initialState);
        setErrors({});
    }, [initialState]);

    // ✓ Agregar formData como dependencia para acceder al estado actual
    const validateRequired = useCallback((fields) => {
        let isValid = true;
        setFormData((currentData) => {
            const newErrors = {};
            fields.forEach((field) => {
                if (!currentData[field] || currentData[field].toString().trim() === '') {
                    newErrors[field] = 'Este campo es requerido';
                    isValid = false;
                }
            });
            setErrors(newErrors);
            return currentData;
        });
        return isValid;
    }, []);

    return {
        formData,
        errors,
        handleInputChange,
        setFieldValue,
        setFieldError,
        clearForm,
        validateRequired,
        setFormData,
    };
};