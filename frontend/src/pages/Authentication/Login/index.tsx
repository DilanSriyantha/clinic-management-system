import { MedicalServices, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Card, Container, FormControl, IconButton, Stack, TextField, Typography } from "@mui/material";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";

function Login() {
    const formRef = useRef<HTMLFormElement>(null);

    const [error, setError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = useCallback(() => {
        if(!formRef.current)
            return;

        const formData = new FormData(formRef.current);
        const refId = formData.get("refid");
        const pw = formData.get("pw");

        if(!refId || !pw)
            setError(true);

        if(refId === "dilan" && pw === "sriyantha")
            navigate("/main/dashboard");
        else
            setError(true);
    }, [error]);

    const handleEnterInput = useCallback(() => {
        if(!error)
            return;
        
        setError(false);
    }, [error]);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleLogin();
    };

    const handleShowPwClick = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    return (
        <>
            <Container sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Card sx={{ width: "50%" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                    }}>
                        <Stack direction="column" sx={{
                            alignItems: "center",
                            mb: 2,
                        }}>
                            
                            <MedicalServices color="primary" />
                            <Typography variant="h3">Login</Typography>
                            <Typography variant="subtitle1">Welcome, please log in to continue</Typography>
                            {error && (<Alert severity="error">Username or password is wrong. Check your username and password and try again.</Alert>)}
                        </Stack>

                        <form 
                            ref={formRef} 
                            style={{
                                width: "100%"
                            }}
                            onKeyDown={handleEnterKeyPress}
                        >
                            <Stack direction="column" gap={2} >
                                <TextField 
                                    name="refid" 
                                    variant="outlined" 
                                    label="Reference ID*" 
                                    type="text"
                                    onClick={handleEnterInput}

                                />
                                <TextField 
                                    name="pw" 
                                    variant="outlined" 
                                    label="Password*" 
                                    type={showPassword ? "text" : "password"} 
                                    error={error}
                                    onClick={handleEnterInput}
                                    slotProps={{
                                        input: {
                                            endAdornment: 
                                            <>
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? "hide the password" : "display the passowrd"
                                                    }
                                                    onClick={handleShowPwClick}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                            </>
                                        }
                                    }}
                                />
                                <Button variant="contained" onClick={handleLogin}>Login</Button>
                            </Stack>
                        </form>
                    </Box>
                </Card>
            </Container>
        </>
    );
}

export default Login;