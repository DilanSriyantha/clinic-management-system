import { Alert, Autocomplete, Box, Button, Card, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { KeyboardEvent, ReactNode, useRef } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import AlertSnackbar, { AlertSnackbarHandles } from "../../../components/AlertSnackbar";

function CreateClinic() {
    const formRef = useRef<HTMLFormElement>(null);
    const alertRef = useRef<AlertSnackbarHandles>(null);

    const handleSubmit = async () => {
        if(!formRef.current)
            return;

        const formData = new FormData(formRef.current);
        createClinicAsync(formData);
    };

    const createClinicAsync = async (formData: FormData) => {
        const api = import.meta.env.VITE_API_URL;
        try{
            const res = await fetch(api + "/clinic-management/create", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    caption: formData.get("caption"),
                    description: formData.get("description"),
                    dayOfWeek: formData.get("dayofweek"),
                    time: formData.get("time")
                })
            });
            if(res){
                const json = await res.json();
                console.log(json);

                alertRef.current?.show();
            }
        }catch(err){
            console.log(err);
        } 
    }

    const handleClear = () => {
        if(!formRef.current)
            return;

        formRef.current.reset();
    }

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }

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
                        ref={formRef}
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
                            <TextField name="caption" label="Caption" type="text" />
                            <TextField name="description" label="Description" type="text" />
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
                                renderInput={(params) => <TextField {...params} name="dayofweek" label="Day of week" />}
                            />
                            <TimePicker name="time" label="Time" defaultValue={moment(new Date)} />
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