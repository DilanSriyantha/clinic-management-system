import { Card, Container, Box, Typography, Button, Grid2, ListItem, ListItemText, Stack, TextField, IconButton, Tooltip, useTheme, Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { useLocation, useNavigate } from "react-router";
import { Patient, PrescriptionCreateRequest, PrescriptionLineDto } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useCallback, useReducer } from "react";
import { isValid } from "../../../utils/Validator";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Delete } from "@mui/icons-material";
import moment from "moment";
import { For } from "../../../enums/For";
import { useAuth } from "../../../hooks/useAuth";

interface CreatePrescriptionState {
    isLoading: boolean;
    prescriptionLines: PrescriptionLineDto[];
    drug: string;
    dose: string;
    frequency: string;
    time: string;
};

enum ActionType {
    SET_FIELD,
    CLEAR_FIELDS,
    ADD_PRESCRIPTION_LINE,
    REMOVE_PRESCRIPTION_LINE,
    SET_LOADING
};

const initialState: CreatePrescriptionState = {
    isLoading: false,
    prescriptionLines: [],
    drug: "",
    dose: "",
    frequency: "",
    time: "After"
};

const reducer = (state: CreatePrescriptionState, action: { type: ActionType, payload: any }): CreatePrescriptionState => {
    switch (action.type) {
        case ActionType.SET_FIELD:
            return { ...state, [action.payload.name]: action.payload.value };
        case ActionType.CLEAR_FIELDS:
            return { ...state, drug: "", dose: "", frequency: "" };
        case ActionType.ADD_PRESCRIPTION_LINE:
            return { ...state, prescriptionLines: [...state.prescriptionLines, action.payload], drug: "", dose: "", frequency: "" };
        case ActionType.REMOVE_PRESCRIPTION_LINE:
            return { ...state, prescriptionLines: state.prescriptionLines.filter((_pl, idx) => idx !== action.payload) };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

interface TimeOption {
    label: string;
    value: string;
};

const timeOptions: TimeOption[] = [
    { label: "After", value: "After" },
    { label: "Before", value: "Before" }
];

function CreatePrescription() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [user] = useAuth();

    const location = useLocation();
    const api = useApi();
    const alert = useAlert();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async () => {
        try {
            if (state.prescriptionLines.length < 1) {
                alert.setWarning("Please insert prescription records.");

                return;
            }

            createPrescription();
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const createPrescription = useCallback(async () => {
        try {
            const res = await api.post<PrescriptionCreateRequest, BasicResultSet>("/prescription-management/create", { ...state, doctorId: user?.user.id, patientId: location.state && location.state.patient.id } as PrescriptionCreateRequest);

            if (res) {
                console.log(res);
                alert.setSuccess(res.message);
            }
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleAdd = useCallback(() => {
        console.log(state);
        if (!isValid(state, ["isLoading", "prescriptionLines"])) {
            alert.setError("Invalid inputs");
            return;
        }

        dispatch({ type: ActionType.ADD_PRESCRIPTION_LINE, payload: { description: generateRow(state.drug, state.dose, state.frequency, state.time) } });
    }, [state]);

    const generateRow = useCallback((drug: string, dose: string, freq: string, time: string) => {
        return `${drug} x${dose}, ${time} meal, ${freq} times a day.`;
    }, []);

    const handleEnterKeyPress = useCallback((event: KeyboardEvent<HTMLFormElement>): void => {
        if (event.ctrlKey && event.key.match("Enter")) {
            handleSubmit();
            return;
        }

        if (event.key.match("Enter"))
            handleAdd();
    }, [state]);

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: event.target.name, value: event.target.value } });
    }, [state.drug, state.dose, state.frequency]);

    const handleTimeChange = useCallback((_event: SyntheticEvent<Element, Event>, value: TimeOption | null, _reason: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<TimeOption> | undefined): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "time", value: value?.value } });
    }, [state.time]);

    function renderRow(props: ListChildComponentProps) {
        const { data, index, style } = props;
        console.log(data);
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemText primary={`${index + 1}. ${data[index].description}`} />
                <IconButton onClick={() => dispatch({ type: ActionType.REMOVE_PRESCRIPTION_LINE, payload: index })}>
                    <Delete fontSize="small" htmlColor={theme.palette.error.light} />
                </IconButton>
            </ListItem>
        );
    }

    return (
        <>
            <PageTitle
                subTitle="Prescription Management"
                title="Create Prescription"
            />
            <Container sx={{
                display: "flex",
                flexDirection: "column",
                // pt: 2,
                pb: 2
            }}>
                <Stack direction={"column"} gap={1}>
                    <Grid2 container size={12} gap={1}> 
                        <Grid2 size={5}>
                            <Card sx={{ p: 1, height: "100%" }}>
                                <Stack direction={"column"} textAlign={"start"}>
                                    <Typography variant="body1">Allergy Note</Typography>
                                    <Typography variant="body2" sx={{ fontStyle: !location.state ? "italic" : "normal" }} fontWeight={300} pt={1}>{location.state ? (location.state.patient as Patient).allergiesNote : "No patient(s)"}</Typography>
                                </Stack>
                            </Card>
                        </Grid2>
                        <Grid2 size={6}>
                            <Card sx={{ p: 1 }}>
                                <Stack direction={"row"} justifyContent={"space-between"} pb={.35}>
                                    <Typography variant="body1">Date</Typography>
                                    <Typography variant="body1" fontWeight="500">{moment(new Date()).format("YYYY/MM/DD")}</Typography>
                                </Stack>
                                <Stack direction={"row"} justifyContent={"space-between"} pb={.35}>
                                    <Typography variant="body1">Patient</Typography>
                                    <Typography variant="body1" fontWeight="500"><a style={{ cursor: "pointer" }} onClick={() => navigate("/patient-management/list", { state: { for: For.SELECTING_PATIENT } })}>{location.state ? `${location.state.patient.name} (${location.state.patient.referenceId})` : "(+) Select"}</a></Typography>
                                </Stack>
                                <Stack direction={"row"} justifyContent={"space-between"} pb={.35}>
                                    <Typography variant="body1">Age</Typography>
                                    <Typography variant="body1" fontWeight="500">{location.state ? `${location.state.patient.age} yrs` : "-"}</Typography>
                                </Stack>
                            </Card>
                        </Grid2>
                    </Grid2>
                    <Grid2 container size={12} gap={1}>
                        <Grid2 size={6}>
                            <Card>
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="h6">Prescription</Typography>
                                </Box>
                                <Box
                                    sx={{ width: '100%', height: 400, pl: 2, pr: 2 }}
                                >
                                    {
                                        state.prescriptionLines.length > 0
                                            ?
                                            <FixedSizeList
                                                height={400}
                                                width={"100%"}
                                                itemSize={46}
                                                itemCount={state.prescriptionLines.length}
                                                overscanCount={5}
                                                itemData={state.prescriptionLines}
                                            >
                                                {renderRow}
                                            </FixedSizeList>
                                            :
                                            <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>No record(s)</Typography>
                                    }
                                </Box>
                            </Card>
                        </Grid2>
                        <Grid2 size={5}>
                            <Stack direction={"column"} gap={1} height={"100%"}>

                                <Card sx={{ p: 1, height: "100%" }}>
                                    <Box
                                        sx={{ pl: 1, pb: 1, pr: 1 }}
                                    >
                                        <Typography variant="h6">Create a record</Typography>
                                    </Box>
                                    <form onKeyDown={handleEnterKeyPress}>
                                        <Stack direction={"column"} gap={1}>
                                            <TextField label="Drug" name="drug" value={state.drug} onChange={handleInputChange} />
                                            <TextField label="Dose" name="dose" type="number" value={state.dose} onChange={handleInputChange} />
                                            <TextField label="Frequency (per 24hrs)" name="frequency" value={state.frequency} onChange={handleInputChange} />
                                            <Autocomplete
                                                // disablePortal
                                                options={timeOptions}
                                                onChange={handleTimeChange}
                                                renderInput={(params) => <TextField {...params} value={state.time} name="time" label="Time" />}
                                                defaultValue={timeOptions[0]}
                                                value={timeOptions.filter((v) => v.value === state.time)[0]}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "end",
                                                    gap: 1,
                                                }}
                                            >
                                                <Tooltip title="Add record">
                                                    <Button variant="outlined" onClick={handleAdd}>Add</Button>
                                                </Tooltip>
                                                <Tooltip title="Submit prescription">
                                                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                                                </Tooltip>
                                            </Box>
                                        </Stack>
                                    </form>
                                </Card>
                            </Stack>
                        </Grid2>
                    </Grid2>
                </Stack>
            </Container>
        </>
    );
}

export default CreatePrescription;