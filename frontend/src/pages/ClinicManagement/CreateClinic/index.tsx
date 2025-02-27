import { Autocomplete, Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useReducer, useRef } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../types/Clinic";
import moment from "moment";
import { CreateClinicState } from "../../../types/CreateClinicState";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";

const initialState: CreateClinicState = {
    caption: "",
    description: "",
    dayOfWeek: "",
    time: "",
    loading: false,
};

enum ActionType {
    SET_FIELD,
    SET_LOADING,
};

const reducer = (state: CreateClinicState, action: { type: ActionType, payload: any }): CreateClinicState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload};
        default: 
            return state;
    }
};

function CreateClinic() {
    const timePickerInputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();

    const handleSubmit = useCallback(async () => {
        try{
            if(!isValid(state, ["loading"])){
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            createClinicAsync();
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }

    }, [state]);

    const createClinicAsync = useCallback(async () => {
        try{
            const res = await api.post<Clinic, BasicResultSet>("/clinic-management/create", state as Clinic);
            if(res){
                console.log(res);
                alert.setSuccess("Clinic created successfully");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleClear = useCallback(() => {
        location.reload();
    }, []);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleTimePickerChange = useCallback(() => {
        if(!timePickerInputRef.current)
            return;

        dispatch({ type: ActionType.SET_FIELD, payload: { name: "time", value: timePickerInputRef.current.value } });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title="Create Clinic"
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
                            <TextField onChange={handleTextFieldChange} name="caption" label="Caption" type="text" />
                            <TextField onChange={handleTextFieldChange} name="description" label="Description" type="text" />
                            <Autocomplete
                                // disablePortal
                                options={[
                                    { label: "Sunday", value: 0 },
                                    { label: "Monday", value: 1 },
                                    { label: "Tuesday", value: 2 },
                                    { label: "Wednesday", value: 3 },
                                    { label: "Thursday", value: 4 },
                                    { label: "Friday", value: 5 },
                                    { label: "Saturday", value: 6 }
                                ]}
                                onChange={(e, v) => dispatch({ type: ActionType.SET_FIELD, payload: { name: "dayOfWeek", value: v?.label } })}
                                renderInput={(params) => <TextField {...params} name="dayOfWeek" label="Day of week" />}
                            />
                            <TimePicker onChange={handleTimePickerChange} inputRef={timePickerInputRef} name="time" label="Time" defaultValue={moment(new Date)} />
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

export default CreateClinic;