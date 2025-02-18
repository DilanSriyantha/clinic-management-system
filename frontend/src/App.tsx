import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LightTheme } from './theme/schemes/LightTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ContextProvidersWrapper from './components/ContextProvidersWrapper';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <ThemeProvider theme={LightTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ContextProvidersWrapper>
            <AppRoutes />
          </ContextProvidersWrapper>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
