import React from 'react';
import { Box, CircularProgress, Alert, Typography, Button } from '@mui/material';

export const LoadingState = () => (
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

// ✓ Usar Button en lugar de Typography para la acción
export const ErrorState = ({ error, onRetry }) => (
    <Box sx={{ flex: 1, p: 3 }}>
        <Alert
            severity="error"
            action={
                onRetry ? (
                    <Button
                        color="inherit"
                        size="small"
                        onClick={onRetry}
                        sx={{ textTransform: 'none' }}
                    >
                        Reintentar
                    </Button>
                ) : null
            }
        >
            {error || 'Ha ocurrido un error'}
        </Alert>
    </Box>
);

export const EmptyState = ({ message = 'No hay datos disponibles' }) => (
    <Box
        sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Typography sx={{ color: '#999', fontSize: '13px' }}>
            {message}
        </Typography>
    </Box>
);