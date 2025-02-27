import { useLocation } from "react-router";
import PageTitle from "../../../components/PageTitle";
import { Status } from "../../../enums/Status";
import { ClinicDetailsState } from "../../../types/ClinicDetailsState";
import { useEffect, useReducer } from "react";
import { User } from "../../../types/User";
import DoctorSection from "./DoctorsSection";
import { Delete, LocalHospital } from "@mui/icons-material";
import { Card, Box, Typography, Stack, Divider, Button } from "@mui/material";
import moment from "moment";

const initialState: ClinicDetailsState = {
    caption: "",
    description: "",
    doctors: new Set<User>,
    dayOfWeek: "",
    time: "",
    status: Status.ACTIVE,
    updatedAt: "",
    loading: false,
};

enum ActionType {
    SET_FIELD,
    SET_CLINIC_FIELDS,
    SET_LOADING,
};

const reducer = (state: ClinicDetailsState, action: { type: ActionType, payload: any }): ClinicDetailsState => {
    switch (action.type) {
        case ActionType.SET_FIELD:
            return { ...state, [action.payload.name]: action.payload.value };
        case ActionType.SET_CLINIC_FIELDS:
            return { ...state, caption: action.payload.caption, description: action.payload.description, doctors: action.payload.doctors, dayOfWeek: action.payload.dayOfWeek, time: action.payload.time, status: action.payload.status, updatedAt: action.payload.updatedAt };
        case ActionType.SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

function ClinicDetails() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    useEffect(() => {
        if (!location.state) return;

        dispatch({ type: ActionType.SET_CLINIC_FIELDS, payload: location.state });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title={state.caption}
                backButton={true}
                endContent={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button startIcon={<Delete />} variant="contained" color="error" >Delete</Button>
                    </Box>
                }
            />
            <Stack direction={"column"} gap={2}>
                <Card>
                    <Box sx={{ display: "flex", textAlign: "start", flexDirection: "column", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 2 }}>
                            <LocalHospital />
                            <Typography variant="h5">Clinic Information</Typography>
                        </Box>
                        <Stack direction={"column"} gap={2}>
                            <Stack direction={"column"}>
                                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Typography variant="subtitle1">Description</Typography>
                                    <Typography variant="body2">{state.description}</Typography>
                                </div>

                                <Divider />

                                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Typography variant="subtitle1">Day of week</Typography>
                                    <Typography variant="body2">{state.dayOfWeek}</Typography>
                                </div>

                                <Divider />

                                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Typography variant="subtitle1">Time</Typography>
                                    <Typography variant="body2">{state.time}</Typography>
                                </div>

                                <Divider />
                                
                                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Typography variant="subtitle1">Updated at</Typography>
                                    <Typography variant="body2">{moment(state.updatedAt).format("yyyy-MM-DD hh:mm:ss A")}</Typography>
                                </div>

                                <Divider />

                                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Typography variant="subtitle1">Status</Typography>
                                    <Typography variant="body2" color={Status.valueOf(state.status) === Status.ACTIVE ? "success" : "error"} >{state.status}</Typography>
                                </div>

                            </Stack>
                        </Stack>
                    </Box>
                </Card>
                <DoctorSection clinicDoctors={location.state.doctors} />
            </Stack>
        </>
    );
};

export default ClinicDetails;