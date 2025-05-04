import { Box, Button, Card, Container, Divider, Grid2, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import DateRangePicker, { DateRange } from "../../../components/DateRangePicker";
import { useState } from "react";
import moment from "moment";
import PatientRegistrationTrend from "./PatientRegistrationTrend";
import PatientAgeDistributionTrend from "./PatientAgeDistributionTrend";
import PatientRegistrationSummary from "./PatientRegistrationSummary";

const firstDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1);
const lastDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1, 0);

export default function PatientReports() {

    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: moment(firstDayOfMonth).format("YYYY-MM-DD"),
        endDate: moment(lastDayOfMonth).format("YYYY-MM-DD")
    });

    function handleDateRangeChange(value: DateRange): void {
        console.log(value);
        setDateRange(value);
    }

    return (
        <>
            <PageTitle
                title="Patient Reports"
                subTitle="Reports & Analysis"
            />
            <Container>
                <Card>
                    <Stack 
                        direction={"row"}
                        padding={2}
                        gap={1}
                        justifyContent={"space-between"}
                        sx={{ 
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <DateRangePicker 
                            onChange={handleDateRangeChange}
                        />
                        <Button variant="contained">Submit</Button>
                    </Stack>
                </Card>
                <Grid2 mt={2} container size={12} spacing={1}>
                    <Grid2 size={6}>
                        <Card>
                            <Typography variant="h6" textAlign={"start"} p={1}>Patient age distribution</Typography>
                            <Divider />
                            <PatientAgeDistributionTrend />
                        </Card>
                    </Grid2>
                    <Grid2 size={6}>
                        <Card>
                            <Typography variant="h6" textAlign={"start"} p={1}>Patient registration trend</Typography>
                            <Divider />
                            <PatientRegistrationTrend 
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                            />
                        </Card>
                    </Grid2>
                </Grid2>
                <Card sx={{ mt: 2}}>
                    <Typography variant="h6" textAlign={"start"} p={1}>Summary</Typography>
                    <Divider />
                    <PatientRegistrationSummary 
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />
                </Card>
                <Box p={1}/>
            </Container>
        </>
    );
}