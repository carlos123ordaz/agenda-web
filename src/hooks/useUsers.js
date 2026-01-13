import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Error al cargar usuarios');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (name, email = null) => {
        try {
            setError(null);
            const newUser = await userService.createUser({ name, email });
            setUsers((prev) => [...prev, newUser]);
            return newUser;
        } catch (err) {
            const errorMessage = err.message || 'Error al crear usuario';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const updateUserData = useCallback(async (id, userData) => {
        try {
            setError(null);
            const updated = await userService.updateUser(id, userData);
            setUsers((prev) =>
                prev.map((user) => (user._id === id ? updated : user))
            );
            return updated;
        } catch (err) {
            const errorMessage = err.message || 'Error al actualizar usuario';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const deleteUserData = useCallback(async (id) => {
        try {
            setError(null);
            await userService.deleteUser(id);
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            const errorMessage = err.message || 'Error al eliminar usuario';
            setError(errorMessage);
            throw err;
        }
    }, []);

    // ✓ Incluir loadUsers en las dependencias
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return {
        users,
        loading,
        error,
        loadUsers,
        createUser,
        updateUserData,
        deleteUserData,
    };
};