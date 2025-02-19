import { Autocomplete, Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import AlertSnackbar, { AlertSnackbarHandles } from "../../../components/AlertSnackbar";
import { useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../types/Clinic";
import moment from "moment";

function CreateClinic() {
    const alertRef = useRef<AlertSnackbarHandles>(null);
    const timePickerInputRef = useRef<HTMLInputElement>(null);

    const [clinicInfo, setClinicInfo] = useState<Clinic>();

    const api = useApi();

    const handleSubmit = useCallback(async () => {
        if(!clinicInfo)
            return;

        createClinicAsync();
    }, [clinicInfo]);

    const createClinicAsync = useCallback(async () => {
        try{
            if(!clinicInfo)
                return;

            const res = await api.post<Clinic>("/clinic-management/create", clinicInfo);
            if(res){
                console.log(res);
            }
        }catch(err){
            console.log(err);
        }
    }, [clinicInfo]);

    const handleClear = useCallback(() => {
        setClinicInfo(undefined);
    }, [clinicInfo]);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setClinicInfo({...clinicInfo, [e.target.name]: e.target.value});
    }, [clinicInfo]);

    const handleTimePickerChange = useCallback(() => {
        if(!timePickerInputRef.current)
            return;

        setClinicInfo({...clinicInfo, [timePickerInputRef.current.name]: timePickerInputRef.current.value});
    }, [clinicInfo]);

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
                                onChange={(e, v) => setClinicInfo({...clinicInfo, ["dayOfWeek"]: v?.label})}
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
            <AlertSnackbar ref={alertRef} severity="success" variant="filled" autoHideDuration={1000} message="Successful" />
        </>
    );
}

export default CreateClinic;