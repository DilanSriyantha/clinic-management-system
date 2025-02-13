import { useRoutes } from 'react-router';
import router from "./routes/router";
import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LightTheme } from './theme/schemes/LightTheme';
function App() {
  const content = useRoutes(router);

  return (
    <>
      <ThemeProvider theme={LightTheme}>
        <CssBaseline />
        {content}
      </ThemeProvider>
    </>
  );
}

export default App;
