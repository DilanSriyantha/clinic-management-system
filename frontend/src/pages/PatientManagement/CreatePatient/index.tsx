import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import moment from "moment";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { PatientDto } from "../../../DTOs";
import { For } from "../../../enums/For";

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
    RESET_FIELDS
};

const reducer = (state: CreatePatientState, action: { type: ActionType, payload: any }): CreatePatientState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_ALL_FIELDS:
            return { ...state, name: action.payload.name, birthday: action.payload.birthday, address: action.payload.address, email: action.payload.email, telephone: action.payload.telephone, allergiesNote: action.payload.allergiesNote, loading: false };
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload};
        case ActionType.RESET_FIELDS:
            return initialState;
        default: 
            return state;
    }
};

function CreatePatient() {
    const [_user] = useAuth();
    const [state, dispatch] = useReducer(reducer, initialState);

    const allergiesNoteRef = useRef<HTMLInputElement | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const api = useApi();
    const alert = useAlert();

    const FOR_UPDATING = location.state && location.state.patient;
    const FOR_SELECTING = location.state && location.state.for && location.state.for === For.SELECTING_PATIENT;
    const FOR_SELECTING_PATIENT_FOR_APPOINTMENT = location.state && location.state.for && location.state.for === For.SELECTING_PATIENT_FOR_APPOINTMENT;
    const FOR_SELECTING_FOR_INVOICE = location.state && location.state.for && location.state.for === For.SELECTING_PATIENT_FOR_INVOICE;

    useEffect(() => {
        if(!location.state) return;

        if(!location.state.patient) return;

        dispatch({ type: ActionType.SET_ALL_FIELDS, payload: location.state });
    }, []);

    const handleSubmit = useCallback(async () => {
        try{
            if(!isValid(state, ["loading"])){
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            if(FOR_UPDATING){
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

                dispatch({ type: ActionType.RESET_FIELDS, payload: null });

                if(FOR_SELECTING || !FOR_SELECTING_PATIENT_FOR_APPOINTMENT || !FOR_SELECTING_FOR_INVOICE)
                    navigate("/patient-management/list", { state: {...location.state} });
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const updatePatientAsync = useCallback(async () => {
        if(!location.state) return;

        try{
            const res = await api.put<PatientDto, BasicResultSet>("/patient-management/update", {
                id: `${location.state.id}`,
            }, PatientDto.from(state));
            if(res){
                console.log(res);
                alert.setSuccess("Patient updated successfully.");
                
                dispatch({ type: ActionType.RESET_FIELDS, payload: null });
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
        const target = e.target as HTMLElement;

        if(e.key.match("Enter")){
            if(allergiesNoteRef.current && allergiesNoteRef.current.contains(target)){
                if(e.ctrlKey && e.key.match("Enter")){
                    e.preventDefault();
                    handleSubmit();
                }
                return;
            }

            handleSubmit();
        }
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleDatePickerChange = useCallback((value: moment.Moment | null) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "birthday", value: moment(value).format("yyyy-MM-DD") } })
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Patient Management"
                title={
                    FOR_UPDATING
                    ? "Update Patient" : "Create Patient"
                }
                backButton={location.state ? true : false}
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
                            <TextField onChange={handleTextFieldChange} name="name" label="Name" type="text" value={state.name} focused={state.name.match("") ? false : true} />
                            <DatePicker onChange={handleDatePickerChange} name="birthday" label="Birthday" format="YYYY-MM-DD" value={moment(Date.parse(state.birthday))} />
                            <TextField onChange={handleTextFieldChange} name="address" label="Address" type="text" value={state.address} focused={state.name.match("") ? false : true} />
                            <TextField onChange={handleTextFieldChange} name="email" label="Email" type="text" value={state.email} focused={state.name.match("") ? false : true} />
                            <TextField onChange={handleTextFieldChange} name="telephone" label="Telephone" type="text" value={state.telephone} focused={state.name.match("") ? false : true} />
                            <TextField onChange={handleTextFieldChange} name="allergiesNote" label="Allergies Note" type="text" multiline minRows={4} value={state.allergiesNote} focused={state.name.match("") ? false : true} onKeyDown={handleEnterKeyPress} ref={allergiesNoteRef} />
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