import { Autocomplete, Box, Button, Card, CardHeader, Container, FormControl, FormHelperText, FormLabel, Input, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { DatePicker } from "@mui/x-date-pickers";


function CreateAccount() {
    const specializationOptions = [
        { label: "Surgeon", id: 0 },
        { label: "Specialist", id: 1 }
    ];

    return (
        <>
            <PageTitle
                subTitle={"Register"}
                title={"Create Doctor Account"}
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
                    <FormControl sx={{
                        gap: 2,
                        pb: 2,
                        width: "100%"
                    }}>
                        <TextField label="Name" type="text" />
                        <DatePicker label="Birthday" />
                        <TextField label="Address" type="text" />
                        <TextField label="E-mail" type="email" />
                        <TextField label="Telephone" type="tel" />
                        <Autocomplete
                            // disablePortal
                            options={specializationOptions}
                            renderInput={(params) => <TextField {...params} label="Specialization" />}
                        />
                        <TextField label="Profit Percentage" type="number" slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }
                        }}></TextField>
                    </FormControl>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}>
                        <Button variant="outlined">Clear</Button> 
                        <Button variant="contained">Submit</Button>
                    </Box>
                </Container>
            </Card>
        </>
    )
}

export default CreateAccount;