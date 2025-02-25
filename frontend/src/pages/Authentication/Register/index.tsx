import { MedicalServices } from "@mui/icons-material";
import { Container, Card, Box, Stack, Typography, TextField, Button } from "@mui/material";
import { DatePicker, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ChangeEvent, KeyboardEvent, MouseEvent, useCallback, useReducer } from "react";
import PasswordInputField from "../../../components/PasswordInputField";
import { Role } from "../../../enums/Role";
import { RegisterFormData } from "../../../types/RegisterFormData";
import { useAlert } from "../../../hooks/useAlert";
import { useNavigate } from "react-router";
import { useAuthManager } from "../../../hooks/useApi";
import { isValid } from "../../../utils/Validator";

const initialState: RegisterFormData = {
    name: null,
    birthday: null,
    address: null,
    email: null,
    password: null,
    telephone: null,
    specialization: null,
    percentage: 0,
    role: Role.ADMIN,
};

const reducer = (state: RegisterFormData, action: { type: string, payload?: any }) => {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.payload.name]: action.payload.value };
        case "RESET_FORM":
            return initialState;
        default:
            return state;
    };
};

function Register() {
    const [formData, dispatch] = useReducer(reducer, initialState);

    const authManager = useAuthManager();
    const alert = useAlert();
    const navigate = useNavigate();

    const register = useCallback(async () => {
        try{
            if(!isValid(formData, ["specialization", "percentage"])){
                alert.setWarning("Please enter the required information to continue.");
                return;
            }

            const res = await authManager.register(formData);
            if(res){
                console.log(res);
                // alert.setSuccess("User registration successful.");
                
                setTimeout(() => navigate(-1), 100);
            }
        }catch(err){
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [formData]);

    const handleRegister = useCallback((e?: MouseEvent<HTMLButtonElement>) => {
        register();
    }, [formData]);

    const handleEnterKeyPress = useCallback((e: KeyboardEvent<HTMLFormElement>) => {
        if(!e.key.match("Enter"))
            return;
        
        handleRegister();
    }, [formData]);

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "SET_FIELD", payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleTimeInput = useCallback((value: moment.Moment | null, context: PickerChangeHandlerContext<DateValidationError>) => {
        dispatch({ type: "SET_FIELD", payload: { name: "birthday", value: value?.format("YYYY-MM-DD") } });
    }, []);


    return (
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
                        <Typography variant="h3">Register</Typography>
                        <Typography variant="subtitle1">Welcome, please Register the System Admin to continue</Typography>
                    </Stack>

                    <form
                        style={{
                            width: "100%"
                        }}
                        onKeyDown={handleEnterKeyPress}
                    >
                        <Stack direction="column" gap={2} >
                            <TextField name="name" label="Name" type="text" onChange={handleInput} />
                            <DatePicker name="birthday" label="Birthday" format="YYYY-MM-DD" onChange={handleTimeInput} />
                            <TextField name="address" label="Address" type="text" onChange={handleInput} />
                            <TextField name="email" label="E-mail" type="email" onChange={handleInput} />
                            <TextField name="telephone" label="Telephone" type="tel" onChange={handleInput} />
                            <PasswordInputField onChange={handleInput} />
                            <Button variant="contained" onClick={handleRegister}>Register</Button>
                        </Stack>
                    </form>
                </Box>
            </Card>
        </Container>
    );
}

export default Register;