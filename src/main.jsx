import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

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
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
