import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Button, Card, Chip, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { DatePicker, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Check } from "@mui/icons-material";
import { RegisterFormData } from "../../../types/RegisterFormData";
import { isValid } from "../../../utils/Validator";
import { Role } from "../../../enums/Role";
import PasswordInputField from "../../../components/PasswordInputField";
import { useAuthManager } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { RoleItem } from "../../../types/RoleItem";
import { SpecializationOption } from "../../../types/SpecializationOption";
import { useLocation } from "react-router";
import moment from "moment";

const initialState: RegisterFormData = {
    name: null,
    birthday: null,
    address: null,
    email: null,
    password: null,
    telephone: null,
    specialization: null,
    percentage: 0,
    role: Role.DOCTOR,
};

const reducer = (state: RegisterFormData, action: { type: string, payload?: any }) => {
    switch(action.type) {
        case "SET_STATE":
            return {...state, name: action.payload.name, bithday: action.payload.birthday, address: action.payload.address, email: action.payload.email, password: action.payload.password, telephone: action.payload.telephone, specialization: action.payload.specialization, percentage: action.payload.percentage, role: action.payload.role}
        case "SET_FIELD":
            return {...state, [action.payload.name]: action.payload.value};
        case "RESET_FORM":
            return initialState;
        default:
            return state;
    };
};

function UpdateUser() {
    const location = useLocation();

    const alert = useAlert();
    const authManager = useAuthManager();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, dispatch] = useReducer(reducer, initialState);

    const roles: RoleItem[] = useMemo(() => [
        { value: Role.DOCTOR, label: Role[1] },
        { value: Role.RECEPTIONIST, label: Role[2] },
        { value: Role.PHARMACIST, label: Role[3] },
    ], []);
    
    const specializationOptions: SpecializationOption[] = useMemo(() => [
        { label: "Surgeon", id: 0 },
        { label: "Specialist", id: 1 }
    ], []);

    useEffect(() => {
        if(!location.state) return;
        console.log(location.state);
        dispatch({ type: "SET_STATE", payload: location.state?.user });
    }, [location.state]);

    const handleSubmit = useCallback(async (e?: FormEvent) => {
        setLoading(true);

        console.log(formData);

        const exceptFields: string[] = (formData.role === Role.PHARMACIST || formData.role === Role.RECEPTIONIST) ? ["specialization", "percentage"] : [];
        try{
            
            if(!isValid(formData, exceptFields)){
                alert.setWarning("Please fill the required information and try again.");
                setLoading(false); 
                return;
            }
    
            const res = await authManager.register(formData);
            if(res){
                console.log(res);
                alert.setSuccess("New user registered successfuly.");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : err!.toString());
        }

        setTimeout(() => setLoading(false), 1000);
    }, [formData]);

    const handleEnterKeyDown = useCallback((e: KeyboardEvent<HTMLFormElement>) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }, [formData]);
 
    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "SET_FIELD", payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleTimeInput = useCallback((value: moment.Moment | null, context: PickerChangeHandlerContext<DateValidationError>) => {
        dispatch({ type: "SET_FIELD", payload: { name: "birthday", value: value?.format("YYYY-MM-DD") } });
    }, []);

    const handleRoleChange = useCallback((item: RoleItem) => {
        dispatch({ type: "SET_FIELD", payload: { name: "role", value: item.value } });
    }, []);

    const handleSpecializationChange = useCallback((event: React.SyntheticEvent, value: SpecializationOption | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> | undefined) => {
        if (!value)
            return;

        if (formData.specialization === value.label)
            return;

        dispatch({ type: "SET_FIELD", payload: { name: "specialization", value: value.label } });
    }, [formData.specialization]);

    const handleClear = useCallback((e: FormEvent) => {
        window.location.reload();
    }, []);

    return (
        <>
            <PageTitle
                subTitle={"Users"}
                title={"Update User"}
                backButton={true}
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "start" }}>
                        <Stack direction="row" flexWrap="wrap" pb={1} gap={1}>
                            {
                                roles.map((item) => {
                                    const checked = formData.role === item.value;
                                    return (
                                        <Chip
                                            key={item.value}
                                            variant={checked ? "filled" : "outlined"}
                                            color={checked ? "primary" : "default"}
                                            label={item.label}
                                            onClick={() => handleRoleChange(item)}
                                            icon={checked ? <Check fontSize="small" /> : <div></div>}
                                        />
                                    );
                                })
                            }
                        </Stack>
                    </Box>
                    <Box sx={{
                        textAlign: "start",
                        pb: 2,
                    }}>
                        <Typography variant="subtitle2">*Please fill the information required.</Typography>
                    </Box>
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleEnterKeyDown}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingBottom: 2,
                            width: "100%"
                        }}>
                            <TextField value={formData.name} name="name" label="Name" type="text" onChange={handleInput} />
                            <DatePicker value={moment(moment(formData.birthday).toDate())} name="birthday" label="Birthday" format="YYYY-MM-DD" onChange={handleTimeInput} />
                            <TextField value={formData.address} name="address" label="Address" type="text" onChange={handleInput} />
                            <TextField value={formData.email} name="email" label="E-mail" type="email" onChange={handleInput} />
                            <TextField value={formData.telephone} name="telephone" label="Telephone" type="tel" onChange={handleInput} />
                            {
                                (formData.role == Role.DOCTOR) &&
                                <>
                                    <Autocomplete
                                        // disablePortal
                                        options={specializationOptions}
                                        renderInput={(params) => <TextField {...params} value={formData.specialization} name="specialization" label="Specialization" />}
                                        onChange={handleSpecializationChange}
                                    />
                                    <TextField value={formData.percentage} name="percentage" label="Profit Percentage" type="number" slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }
                                    }} onChange={handleInput} />
                                </>
                            }
                            <PasswordInputField onChange={handleInput} />
                        </Box>
                    </form>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}>
                        <Button variant="outlined" type="reset" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" type="submit" loadingPosition={"start"} loading={loading} onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Container>
            </Card>
        </>
    )
}

export default UpdateUser;