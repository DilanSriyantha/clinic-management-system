import { MedicalServices, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Card, Container, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useApi } from "../../../hooks/useApi";
import { AuthResponse } from "../../../types/AuthResponse";
import { LoginFormData } from "../../../types/LoginFormData";

function Login() {
    const [formData, setFormData] = useState<LoginFormData>({ referenceId: null, password: null });
    const [error, setError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [user, setUser] = useAuth();

    const api = useApi();

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const login = useCallback(async () => {
        try {
            const res = await api.post<LoginFormData, AuthResponse>("/auth/authenticate", formData);
            if (res)
                console.log(res);
            setUser(res);
        } catch (err) {
            console.log(err);
        }
    }, [user, formData]);

    const handleLogin = useCallback(async () => {
        if (formData.referenceId === null || formData.password === null) {
            setError(true);

            return;
        }

        login();
    }, [formData, error]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData]);

    const handleEnterInput = useCallback(() => {
        if (!error)
            return;

        setError(false);
    }, [error]);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if (e.key.match("Enter"))
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
                            style={{
                                width: "100%"
                            }}
                            onKeyDown={handleEnterKeyPress}
                        >
                            <Stack direction="column" gap={2} >
                                <TextField
                                    name="referenceId"
                                    variant="outlined"
                                    label="Reference ID*"
                                    type="text"
                                    onClick={handleEnterInput}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    name="password"
                                    variant="outlined"
                                    label="Password*"
                                    type={showPassword ? "text" : "password"}
                                    error={error}
                                    onClick={handleEnterInput}
                                    onChange={handleInputChange}
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