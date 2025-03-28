import { Card, Container, Box, Typography, Button } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, MouseEvent, useReducer, useCallback } from "react";
import { AppointmentCreateRequest } from "../../../types";

interface CreateAppointmentState {
    isLoading: boolean;
    appointment: AppointmentCreateRequest;
};

enum ActionType {
    SET_FIELD,
    SET_LOADING,
};

const initialState: CreateAppointmentState = {
    isLoading: false,
    appointment: {
        patientId: 0,
        clinicId: 0,
        doctorId: 0,
        queuePosition: 0
    }
};

const reducer = (state: CreateAppointmentState, action: { type: ActionType, payload: any }): CreateAppointmentState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return { ...state, appointment: { ...state.appointment, [action.payload.name]: action.payload.value } };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

function CreateAppointment() {

    const [state, dispatch] = useReducer(reducer, initialState);

    function handleSubmit(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        throw new Error("Function not implemented.");
    }

    function handleEnterKeyPress(event: KeyboardEvent<HTMLFormElement>): void {
        throw new Error("Function not implemented.");
    }

    const handleTextFieldChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: event.target.name, value: event.target.value } });
    }, [{...state.appointment}]);

    const handleClear = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        location.reload();
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Appoointment Management"
                title="Create Appointment"
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
                        onKeyDown={handleEnterKeyPress}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingBottom: 2,
                            width: "100%"
                        }}>

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

export default CreateAppointment;