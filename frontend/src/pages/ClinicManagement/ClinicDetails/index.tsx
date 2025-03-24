import { useLocation, useNavigate } from "react-router";
import PageTitle from "../../../components/PageTitle";
import { Status } from "../../../enums/Status";
import { ClinicDetailsState } from "../../../types";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { User } from "../../../types";
import DoctorSection from "./DoctorsSection";
import { Delete, LocalHospital } from "@mui/icons-material";
import { Card, Box, Typography, Stack, Divider, Button } from "@mui/material";
import moment from "moment";
import { For } from "../../../enums/For";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { AssignDoctorDto } from "../../../DTOs";
import { Clinic } from "../../../types";

const initialState: ClinicDetailsState = {
    id: -1,
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
            return { ...state, id: action.payload.id, caption: action.payload.caption, description: action.payload.description, doctors: action.payload.doctors, dayOfWeek: action.payload.dayOfWeek, time: action.payload.time, status: action.payload.status, updatedAt: action.payload.updatedAt };
        case ActionType.SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

function ClinicDetails() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();
    const location = useLocation();
    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        fetchClinicDetails();
    }, []);

    const fetchClinicDetails = useCallback(async () => {
        const clinicId = location.state.clinicId;

        if(!clinicId) return;

        try{
            const res = await api.get<Clinic>("/clinic-management/byId", { clinicId: clinicId });
            if(res){
                console.log(res);
                dispatch({ type: ActionType.SET_CLINIC_FIELDS, payload: res });
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, []);

    const handleAssignClick = useCallback(() => {
        navigate("/users/list", { state: { for: For.ASSIGN_DOCTOR_TO_CLINIC, clinicId: location.state.clinicId } });
    }, []);

    const handleDismissClick = useCallback(async (doctorId: number) => {
        const clinicId: number | undefined = location.state.clinicId;

        if(!clinicId){
            alert.setError("clinic id is undefined");
            return;
        }

        alert.setAlertDialog("Are you sure?", "Are you sure you want to dismiss this doctor from the clinic?", "Yes", "No", () => dismissDoctor(clinicId, doctorId), undefined);
    }, [state.doctors]);

    const dismissDoctor = useCallback(async (clinicId: number, doctorId: number) => {
        try{
            const res = await api.post<AssignDoctorDto, BasicResultSet>("/clinic-management/dismissDoctor", {
                clinicId: clinicId,
                doctorId: doctorId
            });
            if(res) {
                console.log(res);
                dispatch({ type: ActionType.SET_FIELD, payload: { name: "doctors", value: new Set<User> } });
                alert.setSuccess("Doctor dismissed successfully.");
            }
        }catch(err) {
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state.doctors]);

    const handleDeleteClick = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        const clinicId: number | undefined = location.state.clinicId;

        if(!clinicId){
            alert.setError("clinic id is undefined");
            return;
        }

        alert.setAlertDialog("Are you sure?", "Are you sure you want to delete this clinic?", "Yes", "No", () => deleteClinic(clinicId), undefined);
    }, []);

    const deleteClinic = useCallback(async (clinicId: number) => {
        try{
            const res = await api.delete(`/clinic-management/delete?id=${clinicId}`);
            if(res){
                console.log(res);
                alert.setSuccess("Clinic deleted successfully.");
                navigate(-1);
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title={state.caption}
                backButton={true}
                endContent={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button startIcon={<Delete />} variant="contained" color="error" onClick={handleDeleteClick}>Delete</Button>
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
                <DoctorSection clinicDoctors={Array.from(state.doctors)} onAssignClick={handleAssignClick} onDismissClick={handleDismissClick} />
            </Stack>
        </>
    );
};

export default ClinicDetails;