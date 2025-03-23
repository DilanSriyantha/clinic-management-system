import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useCallback, useEffect, useReducer, useRef } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import moment, { Moment } from "moment";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { EventVisibility } from "../../../enums/EventVisibility";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation } from "react-router";

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

interface EventVisibilityOption {
    label: string,
    value: string
};

const eventVisibilityOptions: EventVisibilityOption[] = [
    { label: "Private", value: EventVisibility[0] },
    { label: "Public", value: EventVisibility[1] }
];

function CreatePatient() {
    const timePickerInputRef = useRef<HTMLInputElement>(null);

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
                updateEventAsync();
                return;
            }

            createEventAsync();
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }

    }, [state]);

    const createEventAsync = useCallback(async () => {
        try{
            const res = await api.post<CreatePatientState, BasicResultSet>("/schedule-management/createEvent", state, undefined, {
                ownerId: `${user?.user.id}`
            });
            if(res){
                console.log(res);
                alert.setSuccess("Event created successfully");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const updateEventAsync = useCallback(async () => {
        if(!location.state) return;

        try{
            const res = await api.put<CreatePatientState, BasicResultSet>("/schedule-management/updateEvent", {
                eventId: `${location.state.id}`,
            }, state);
            if(res){
                console.log(res);
                alert.setSuccess("Event updated successfully.");
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

    const handleTimePickerChange = useCallback((value: moment.Moment | null) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "time", value: moment(value).format("hh:mm:ss") } });
    }, []);

    const handleDatePickerChange = useCallback((value: moment.Moment | null) => {
        console.log(moment(value).format("yyyy-MM-DD"));
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "date", value: moment(value).format("yyyy-MM-DD") } })
    }, []);


    function handleEventVisibilityChanged(event: SyntheticEvent<Element, Event>, value: EventVisibilityOption | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<EventVisibilityOption> | undefined): void {
        if(value === null) return;
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "visibility", value: value.value } });
    }

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
                            <DatePicker onChange={handleDatePickerChange} name="birthday" label="Birthday" defaultValue={moment(new Date)} value={state.birthday.length > 0 ? moment(Date.parse(state.birthday)) : moment(new Date)} />
                            <TextField onChange={handleTextFieldChange} name="address" label="Address" type="text" value={state.address} />
                            <TextField onChange={handleTextFieldChange} name="email" label="Email" type="text" value={state.email} />
                            <TextField onChange={handleTextFieldChange} name="telephone" label="Telephone" type="text" value={state.telephone} />
                            <TextField onChange={handleTextFieldChange} name="allergiesNote" label="Name" type="text" value={state.allergiesNote} />
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