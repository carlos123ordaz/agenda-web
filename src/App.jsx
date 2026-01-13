import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { MainLayout } from './layouts/MainLayout';
import PersonnelSchedule from './pages/PersonnelSchedule';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import { useUsers, useWorkTypes, useAssignments } from './hooks';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

export const App = () => {
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers();

  const {
    workTypesMap,
    workTypes,
    loading: workTypesLoading,
    error: workTypesError,
    loadAllWorkTypes,
    createWorkType,
    updateWorkType,
    deleteWorkType,
  } = useWorkTypes();

  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useAssignments();

  const loading = usersLoading || workTypesLoading || assignmentsLoading;
  const error = usersError || workTypesError || assignmentsError;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Error al cargar los datos: {error}
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  const userNames = users.map((user) => user.name);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path=""
            element={
              <PersonnelSchedule
                workTypesMap={workTypesMap}
                workTypes={workTypes}
                onLoadWorkTypes={loadAllWorkTypes}
                onCreateWorkType={createWorkType}
                onUpdateWorkType={updateWorkType}
                onDeleteWorkType={deleteWorkType}
              />
            }
          />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="reportes" element={<ReportsPage users={userNames} />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;