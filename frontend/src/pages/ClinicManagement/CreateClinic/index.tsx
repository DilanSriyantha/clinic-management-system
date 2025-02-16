import { Autocomplete, Box, Button, Card, Container, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { KeyboardEvent, useRef } from "react";

function CreateClinic() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = () => {

    };

    const handleClear = () => {
        window.location.reload();
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
                            <TextField name="docuid" label="DoctorUID" type="text" />
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