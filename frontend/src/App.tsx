import './App.css'
import { Alert, Box, CssBaseline, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { LightTheme } from './theme/schemes/LightTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ContextProvidersWrapper from './components/ContextProvidersWrapper';
import AppRoutes from './routes/AppRoutes';
import { AlertProvider } from './hooks/useAlert';

function App() {
  return (
    <>
      <ThemeProvider theme={LightTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ContextProvidersWrapper>
            <AlertProvider>
              <AppRoutes />
            </AlertProvider>
          </ContextProvidersWrapper>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
