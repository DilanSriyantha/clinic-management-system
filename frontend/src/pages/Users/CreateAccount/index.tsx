import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Button, Card, Chip, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { DatePicker, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Check } from "@mui/icons-material";
import { RegisterFormData } from "../../../types";
import { isValid } from "../../../utils/Validator";
import { Role } from "../../../enums/Role";
import PasswordInputField from "../../../components/PasswordInputField";
import { useAuthManager } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { RoleItem } from "../../../types";
import { SpecializationOption } from "../../../types";
import moment from "moment";

const initialState: RegisterFormData = {
    name: "",
    birthday: moment(Date.now()).format("YYYY-MM-DD"),
    address: "",
    email: "",
    password: "",
    telephone: "",
    specialization: "",
    percentage: 0,
    role: Role.DOCTOR,
};

enum ActionType {
    SET_FIELD,
    RESET_FORM
};

const reducer = (state: RegisterFormData, action: { type: ActionType, payload?: any }) => {
    switch(action.type) {
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.RESET_FORM:
            return initialState;
        default:
            return state;
    };
};

function CreateAccount() {
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
        console.log(formData);
    }, [formData]);

    const handleSubmit = useCallback(async (_e?: FormEvent) => {
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
                dispatch({ type: ActionType.RESET_FORM });
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
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleTimeInput = useCallback((value: moment.Moment | null, _context: PickerChangeHandlerContext<DateValidationError>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "birthday", value: value?.format("YYYY-MM-DD") } });
    }, []);

    const handleRoleChange = useCallback((item: RoleItem) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "role", value: item.value } });
    }, []);

    const handleSpecializationChange = useCallback((_event: React.SyntheticEvent, value: SpecializationOption | null, _reason: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<any> | undefined) => {
        if (!value)
            return;

        if (formData.specialization === value.label)
            return;

        dispatch({ type: ActionType.SET_FIELD, payload: { name: "specialization", value: value.label } });
    }, [formData.specialization]);

    const handleClear = useCallback((_e: FormEvent) => {
        dispatch({ type: ActionType.RESET_FORM});
    }, []);

    return (
        <>
            <PageTitle
                subTitle={"Users"}
                title={"Create Account"}
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
                            <TextField name="name" label="Name" type="text" onChange={handleInput} value={formData.name} focused={formData.name.match("") ? false : true} />
                            <DatePicker name="birthday" label="Birthday" format="YYYY-MM-DD" onChange={handleTimeInput} value={moment(Date.parse(formData.birthday))} />
                            <TextField name="address" label="Address" type="text" onChange={handleInput} value={formData.address} />
                            <TextField name="email" label="E-mail" type="email" onChange={handleInput} value={formData.email} />
                            <TextField name="telephone" label="Telephone" type="tel" onChange={handleInput} value={formData.telephone} />
                            {
                                (formData.role == Role.DOCTOR) &&
                                <>
                                    <Autocomplete
                                        // disablePortal
                                        options={specializationOptions}
                                        renderInput={(params) => <TextField {...params} name="specialization" label="Specialization" />}
                                        onChange={handleSpecializationChange}
                                        value={formData.specialization}
                                    />
                                    <TextField name="percentage" label="Profit Percentage" type="number" slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }
                                    }} onChange={handleInput} value={formData.percentage} focused={formData.percentage > 0 ? true : false} />
                                </>
                            }
                            <PasswordInputField onChange={handleInput} value={formData.password} />
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

export default CreateAccount;