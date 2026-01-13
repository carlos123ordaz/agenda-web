import React, { useState } from 'react';
import {
    Box,
    Paper,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    TextField,
} from '@mui/material';
import { Calendar } from 'lucide-react';

const AvailabilityView = ({
    currentDate,
    personnel,
    schedule,
    workTypes,
}) => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(
        today.toISOString().split('T')[0]
    );

    const getScheduleItem = (day, month, year, person) => {
        const key = `${month}-${year}-${day}-${person}`;
        return schedule[key] || null;
    };

    const getAvailablePersonnel = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return personnel.filter((person) => {
            const item = getScheduleItem(day, month, year, person);
            return !item;
        });
    };

    const getUnavailablePersonnel = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return personnel.filter((person) => {
            const item = getScheduleItem(day, month, year, person);
            return item;
        });
    };

    const availablePersonnel = getAvailablePersonnel(selectedDate);
    const unavailablePersonnel = getUnavailablePersonnel(selectedDate);
    const selectedDateObj = new Date(selectedDate);
    const formattedDate = selectedDateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Calendar size={20} />
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>
                            Selecciona una fecha
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            slotProps={{
                                input: {
                                    sx: { fontSize: '13px' },
                                },
                            }}
                            sx={{ width: '200px' }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                const todayString = today.toISOString().split('T')[0];
                                setSelectedDate(todayString);
                            }}
                            sx={{ textTransform: 'none' }}
                        >
                            Hoy
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: '16px',
                            textTransform: 'capitalize',
                            mb: 1,
                        }}
                    >
                        {formattedDate}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#666' }}>
                        Total de personal: {personnel.length} | Disponibles: {availablePersonnel.length} |
                        No disponibles: {unavailablePersonnel.length}
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#10b981' }}>
                            Disponibles ({availablePersonnel.length})
                        </Typography>
                    </Box>
                    {availablePersonnel.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {availablePersonnel.map((person) => (
                                <Chip
                                    key={person}
                                    label={person}
                                    sx={{
                                        backgroundColor: '#d1fae5',
                                        color: '#065f46',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        height: 'auto',
                                        padding: '6px 12px',
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Card sx={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                            <CardContent>
                                <Typography sx={{ color: '#15803d', fontSize: '13px', fontStyle: 'italic' }}>
                                    No hay personal disponible para esta fecha
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                {unavailablePersonnel.length > 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#dc2626' }}>
                                No disponibles ({unavailablePersonnel.length})
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {unavailablePersonnel.map((person) => {
                                const day = selectedDateObj.getDate();
                                const month = selectedDateObj.getMonth();
                                const year = selectedDateObj.getFullYear();
                                const scheduleItem = getScheduleItem(day, month, year, person);
                                const workData = scheduleItem ? workTypes[scheduleItem.workTypeCode] : null;

                                return (
                                    <Card key={person} sx={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                                        <CardContent sx={{ py: 1.5, px: 2 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                                                    {person}
                                                </Typography>
                                                {workData && (
                                                    <Chip
                                                        label={`${scheduleItem.workTypeCode} - ${workData.label}`}
                                                        sx={{
                                                            backgroundColor: workData.color,
                                                            color: '#000',
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            height: 'auto',
                                                            padding: '4px 8px',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default AvailabilityView;