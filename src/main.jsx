import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { MainProvider } from './contexts/MainContext.jsx';

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeightRegular: 400,
    fontWeightBold: 700,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
})


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainProvider>
        <App />
      </MainProvider>
    </ThemeProvider>
  </BrowserRouter>
)
