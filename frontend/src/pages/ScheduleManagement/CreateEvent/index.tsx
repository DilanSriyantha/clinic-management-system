import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import moment from "moment";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { CreateEventState } from "../../../types/CreateEventState";
import { EventVisibility } from "../../../enums/EventVisibility";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation } from "react-router";

const initialState: CreateEventState = {
    title: "",
    description: "",
    visibility: EventVisibility[0],
    date: moment(new Date).format("YYYY-MM-DD"),
    time: moment(new Date).format("hh:mm a"),
    loading: false,
};

enum ActionType {
    SET_FIELD,
    SET_ALL_FIELDS,
    SET_LOADING,
};

const reducer = (state: CreateEventState, action: { type: ActionType, payload: any }): CreateEventState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_ALL_FIELDS:
            return { ...state, title: action.payload.title, description: action.payload.description, visibility: action.payload.visibility, date: action.payload.date, time: action.payload.time };
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

function CreateEvent() {
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
            const res = await api.post<CreateEventState, BasicResultSet>("/schedule-management/createEvent", state, undefined, {
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
            const res = await api.put<CreateEventState, BasicResultSet>("/schedule-management/updateEvent", {
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
                subTitle="Schedule Management"
                title="Create Event"
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
                            <Autocomplete
                                // disablePortal
                                options={eventVisibilityOptions}
                                onChange={handleEventVisibilityChanged}
                                renderInput={(params) => <TextField {...params} value={state.visibility} name="eventVisibility" label="Visibility" />}
                                defaultValue={eventVisibilityOptions[0]}
                                value={eventVisibilityOptions.filter((v) => v.value === state.visibility)[0]}
                            />
                            <TextField onChange={handleTextFieldChange} name="title" label="Title" type="text" value={state.title} />
                            <TextField onChange={handleTextFieldChange} name="description" label="Description" type="text" value={state.description} />
                            <DatePicker onChange={handleDatePickerChange} name="date" label="Date" defaultValue={moment(new Date)} value={state.time.length > 0 ? moment(Date.parse(state.date)) : moment(new Date)} />
                            <TimePicker onChange={handleTimePickerChange} inputRef={timePickerInputRef} name="time" label="Time"
                            defaultValue={moment(new Date)} value={state.time.length > 0 ? moment(Date.parse(state.date + " " + state.time)) : moment(new Date)} />
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

export default CreateEvent;