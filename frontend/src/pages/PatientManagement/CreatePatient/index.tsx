import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import moment from "moment";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation } from "react-router";
import { PatientDto } from "../../../DTOs";

interface CreatePatientState {
    name: string;
    birthday: string;
    address: string;
    email: string;
    telephone: string;
    allergiesNote: string;
    loading: boolean;
};

const initialState: CreatePatientState = {
    name: "",
    birthday: moment(new Date).format("YYYY-MM-DD"),
    address: "",
    email: "",
    telephone: "",
    allergiesNote: "",
    loading: false,
};

enum ActionType {
    SET_FIELD,
    SET_ALL_FIELDS,
    SET_LOADING,
};

const reducer = (state: CreatePatientState, action: { type: ActionType, payload: any }): CreatePatientState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_ALL_FIELDS:
            return { ...state, name: action.payload.name, birthday: action.payload.birthday, address: action.payload.address, email: action.payload.email, telephone: action.payload.telephone, allergiesNote: action.payload.allergiesNote, loading: false };
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload};
        default: 
            return state;
    }
};

function CreatePatient() {
    const [user] = useAuth();
    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        if(!location.state) return;

        dispatch({ type: ActionType.SET_ALL_FIELDS, payload: location.state });
    }, []);

    useEffect(() => {
        console.log(state);
    }, [state]);

    const handleSubmit = useCallback(async () => {
        try{
            if(!isValid(state, ["loading"])){
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            if(location.state){
                updatePatientAsync();
                return;
            }

            createPatientAsync();
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }

    }, [state]);

    const createPatientAsync = useCallback(async () => {
        try{
            const res = await api.post<PatientDto, BasicResultSet>("/patient-management/create", PatientDto.from(state));
            if(res){
                console.log(res);
                alert.setSuccess("Patient created successfully");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const updatePatientAsync = useCallback(async () => {
        if(!location.state) return;

        try{
            const res = await api.put<CreatePatientState, BasicResultSet>("/patient-management/update", {
                patientId: `${location.state.id}`,
            }, state);
            if(res){
                console.log(res);
                alert.setSuccess("Patient updated successfully.");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleClear = useCallback(() => {
        window.location.reload();
    }, []);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleDatePickerChange = useCallback((value: moment.Moment | null) => {
        console.log(moment(value).format("yyyy-MM-DD"));
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "date", value: moment(value).format("yyyy-MM-DD") } })
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Patient Management"
                title="Create Patient"
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Box sx={{
                        textAlign: "start",
                        pb: 2,
                    }}>
                        <Typography variant="subtitle2">*Please fill the information required.</Typography>
                    </Box>
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleEnterKeyPress}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingBottom: 2,
                            width: "100%"
                        }}>
                            <TextField onChange={handleTextFieldChange} name="name" label="Name" type="text" value={state.name} />
                            <DatePicker onChange={handleDatePickerChange} name="birthday" label="Birthday" format="YYYY-MM-DD" />
                            <TextField onChange={handleTextFieldChange} name="address" label="Address" type="text" value={state.address} />
                            <TextField onChange={handleTextFieldChange} name="email" label="Email" type="text" value={state.email} />
                            <TextField onChange={handleTextFieldChange} name="telephone" label="Telephone" type="text" value={state.telephone} />
                            <TextField onChange={handleTextFieldChange} name="allergiesNote" label="Allergies Note" type="text" multiline minRows={4} value={state.allergiesNote} />
                        </Box>
                    </form>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}>
                        <Button variant="outlined" type="reset" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Container>
            </Card>
        </>
    );
}

export default CreatePatient;