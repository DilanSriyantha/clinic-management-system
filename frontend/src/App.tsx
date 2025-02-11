import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Box, Button, Container, Snackbar, SnackbarCloseReason, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) => {
    if (reason == "clickaway")
      return;

    setOpen(false);
  }, [open]);

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4">Clinic Management System (CMS)</Typography>
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Initial Project Structure</Typography>
          <Button sx={{ my: 3 }} variant="contained" onClick={handleClick}>Click Me!</Button>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={"Hola margerita!"}
          action={action}
        />
      </Container>
    </>
  );
}

export default App;
