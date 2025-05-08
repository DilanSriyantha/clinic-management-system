import { Autocomplete, Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useReducer, useRef } from "react";
import { PickerChangeHandlerContext, TimePicker, TimeValidationError } from "@mui/x-date-pickers";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import moment, { Moment } from "moment";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { CreateClinicState, CreateClinicRequest } from "../../../types";

interface DayOfWeekOption {
    label: string;
    value: number;
};

const DayOfWeekOptions: DayOfWeekOption[] = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 }
];

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
    RESET_FIELDS,
};

const reducer = (state: CreateClinicState, action: { type: ActionType, payload: any }): CreateClinicState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload};
        case ActionType.RESET_FIELDS:
            return initialState;
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
            const res = await api.post<CreateClinicRequest, BasicResultSet>("/clinic-management/create", state as CreateClinicRequest);
            if(res){
                console.log(res);
                alert.setSuccess("Clinic created successfully");

                dispatch({ type: ActionType.RESET_FIELDS, payload: null });
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

    const handleTimePickerChange = useCallback((value: Moment | null, _context: PickerChangeHandlerContext<TimeValidationError>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "time", value: value?.format("hh:mm a") } });
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
                            <TextField onChange={handleTextFieldChange} name="caption" label="Caption" type="text" value={state.caption} focused={state.caption.match("") ? false : true} />
                            <TextField onChange={handleTextFieldChange} name="description" label="Description" type="text" value={state.description} focused={state.description.match("") ? false : true} />
                            <Autocomplete
                                // disablePortal
                                options={DayOfWeekOptions}
                                onChange={(e, v) => dispatch({ type: ActionType.SET_FIELD, payload: { name: "dayOfWeek", value: v?.label } })}
                                renderInput={(params) => <TextField {...params} name="dayOfWeek" label="Day of week" value={state.dayOfWeek} focused={state.caption.match("") ? false : true} />}
                                value={DayOfWeekOptions.filter(op => op.label == state.dayOfWeek)[0]}
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