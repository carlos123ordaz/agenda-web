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

export const App = () => {


  const {
    workTypesMap,
    workTypes,
    createWorkType,
    updateWorkType,
    deleteWorkType,
  } = useWorkTypes();


  const loading = false;

  if (loading) {
    return (

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

    );
  }
  return (

    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path=""
          element={
            <PersonnelSchedule
              workTypesMap={workTypesMap}
              workTypes={workTypes}
              onCreateWorkType={createWorkType}
              onUpdateWorkType={updateWorkType}
              onDeleteWorkType={deleteWorkType}
            />
          }
        />
        <Route
          path="usuarios"
          element={
            <UsersPage />
          }
        />
        <Route path="reportes" element={<ReportsPage />} />
      </Route>
    </Routes>

  );
};

export default App;