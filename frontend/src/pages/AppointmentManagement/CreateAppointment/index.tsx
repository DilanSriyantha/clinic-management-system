import { Card, Container, Box, Typography, Button, Stack } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { KeyboardEvent, useReducer, useCallback, useEffect } from "react";
import { AppointmentCreateRequest, Clinic } from "../../../types";
import { useLocation, useNavigate } from "react-router";
import { For } from "../../../enums/For";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";

interface CreateAppointmentState {
    isLoading: boolean;
    appointment: AppointmentCreateRequest;
};

enum ActionType {
    SET_FIELD,
    SET_CLINIC_PROPERTIES,
    SET_PATIENT_PROPERTIES,
    SET_LOADING,
    RESET_FIELDS
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
        case ActionType.SET_CLINIC_PROPERTIES:
            return { ...state, appointment: { ...state.appointment, clinicId: action.payload.id, doctorId: action.payload.doctors.length > 0 ? action.payload.doctors[0].id : 0 } };
        case ActionType.SET_PATIENT_PROPERTIES:
            return { ...state, appointment: { ...state.appointment, patientId: action.payload.id } };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ActionType.RESET_FIELDS:
            return initialState;
        default:
            return state;
    }
};

function CreateAppointment() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();
    const navigate = useNavigate();
    const api = useApi();
    const alert = useAlert();

    console.log(location.state);

    useEffect(() => {
        if(!(location.state)) return;

        if(location.state.clinic){
            dispatch({ type: ActionType.SET_CLINIC_PROPERTIES, payload: location.state.clinic });
            fetchNextAvailableQueuePosition();
        }

        if(location.state.patient){
            dispatch({ type: ActionType.SET_PATIENT_PROPERTIES, payload: location.state.patient });
        }
    }, [location.state]);

    const fetchNextAvailableQueuePosition = useCallback(async() => {
        try{
            const res = await api.get("/appointment-management/maxQueuePosition", {
                clinicId: `${location.state.clinic.id}`
            });
            if(res){
                console.log(res);
                dispatch({ type: ActionType.SET_FIELD, payload: { name: "queuePosition", value: res } });
            }
        }catch(err){
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state.appointment.queuePosition]);

    async function handleSubmit(): Promise<void> {
        try{
            const res = await api.post<AppointmentCreateRequest, BasicResultSet>("/appointment-management/create", state.appointment);
            if(res){
                console.log(res);
                alert.setSuccess(res.message);
                handleClear();
            }
        }catch(err) {
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }

    function handleEnterKeyPress(event: KeyboardEvent<HTMLFormElement>): void {
        if(event.key.match("Enter"))
            handleSubmit();
    }

    const handleClear = useCallback((): void => {
        location.state = {};
        dispatch({ type: ActionType.RESET_FIELDS, payload: null });
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
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <Typography variant="body1">Clinic</Typography>
                                <a style={{ cursor: "pointer" }} onClick={() => navigate("/clinic-management/list", { state: { ...location.state, for: For.SELECTING_CLINIC } })}>{(state.appointment.clinicId && location.state && location.state.clinic) ? `${location.state.clinic.caption}` : "(+) Select"}</a>
                            </Stack>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <Typography variant="body1">Patient</Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    <a style={{ cursor: "pointer" }} onClick={() => navigate("/patient-management/list", { state: { ...location.state, for: For.SELECTING_PATIENT_FOR_APPOINTMENT } })}>{(state.appointment.patientId && location.state && location.state.patient) ? `${location.state.patient.name} (${location.state.patient.referenceId})` : "(+) Select"}</a>
                                </Typography>
                            </Stack>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <Typography variant="body1">Doctor</Typography>
                                <Typography variant="body1" fontWeight={500}>{(state.appointment.doctorId && location.state && location.state.clinic) ? `Dr. ${(location.state.clinic as Clinic).doctors?.at(0)?.name}` : "-"}</Typography>
                            </Stack>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <Typography variant="body1">Queue Position</Typography>
                                <Typography variant="body1" fontWeight={500}>{state.appointment.queuePosition}</Typography>
                            </Stack>
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