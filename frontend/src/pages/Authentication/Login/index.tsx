import { MedicalServices, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Card, CircularProgress, Container, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import { LoginFormData } from "../../../types/LoginFormData";
import { useAlert } from "../../../hooks/useAlert";
import { isValid } from "../../../utils/Validator";
import { useApi, useAuthManager } from "../../../hooks/useApi";
import { User } from "../../../types/User";

function Login() {
    const [formData, setFormData] = useState<LoginFormData>({ referenceId: null, password: null });
    const [error, setError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const authManager = useAuthManager();
    const alert = useAlert();
    const api = useApi();

    useEffect(() => {
        checkHasAdmins();
    }, []);

    const checkHasAdmins = useCallback(async () => {
        try{
            const res = await api.get<User>("/users/byRole", {"role": "ADMIN"});
            if(res){
                console.log(res);
                setTimeout(() => {

                    setLoading(false);
                    
                    // if(res.length > 0)
                        // navigate("register");
                }, 1000);
            }
        }catch(err){
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`)
        }
    }, []);

    const login = useCallback(async () => {
        try {
            const res = await authManager.authenticate(formData);
            if(res)
                console.log(res);
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [formData]);

    const handleLogin = useCallback(async () => {
        if (!isValid(formData)) {
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
                        
                        {
                            loading
                            ? (
                                <CircularProgress />
                            ) : (
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
                            )
                        }
                    </Box>
                </Card>
            </Container>
        </>
    );
}

export default Login;