import { useRoutes } from 'react-router';
import router from "./routes/router";
import './App.css'
import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { LightTheme } from './theme/schemes/LightTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ApiProvider } from './hooks/useApi';

function App() {
  const content = useRoutes(router);

  return (
    <>
      <ThemeProvider theme={LightTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ApiProvider>
            {content}
          </ApiProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
