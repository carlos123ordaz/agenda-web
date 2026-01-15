import React, { useContext } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
} from '@mui/material';
import {
    Home,
    Users,
    BarChart3,
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MainContext } from '../contexts/MainContext';

export const MainLayout = () => {
    const navigate = useNavigate();
    const { areas, setAreaSelected, areaSelected } = useContext(MainContext);
    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* SIDEBAR */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #e0e0e0',
                        overflowY: 'auto',
                        paddingBottom: 2,
                    },
                }}
            >
                {/* Logo/Brand */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>C</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Agenda</Typography>
                </Box>

                {/* Main Navigation */}
                <List sx={{ pt: 1 }}>
                    <ListItem
                        button
                        sx={{ mb: 0.5, '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' } }}
                        onClick={() => navigate('/')}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Home size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Inicio" />
                    </ListItem>
                    <ListItem
                        button
                        sx={{ mb: 0.5, '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' } }}
                        onClick={() => navigate('/usuarios')}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Users size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Usuarios" />
                    </ListItem>
                    <ListItem
                        button
                        sx={{ mb: 0.5, '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' } }}
                        onClick={() => navigate('/reportes')}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <BarChart3 size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Reportes" />
                    </ListItem>
                </List>
                <Divider sx={{ my: 1 }} />
            </Drawer>

            {/* MAIN CONTENT */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* TOP BAR */}
                <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Toolbar sx={{ minHeight: 56, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '4px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>C</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '13px', color: '#666' }}>Control de personal</Typography>
                        </Box>

                        <Box sx={{ flex: 1 }} />
                        <FormControl sx={{ minWidth: 250 }}>
                            <InputLabel sx={{ fontSize: '13px' }}>Área</InputLabel>
                            <Select value={areaSelected || ''} onChange={(e) => { setAreaSelected(e.target.value) }} label="Área" size="small">
                                {areas && areas.map((area) => (
                                    <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </Box>
        </Box>
    );
};