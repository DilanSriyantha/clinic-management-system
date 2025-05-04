import { Box, Button, Card, Container, Divider, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import DateRangePicker, { DateRange } from "../../../components/DateRangePicker";
import { useState } from "react";
import moment from "moment";
import AppointmentTrend from "./AppointmentTrend";
import AppointmentSummary from "./AppointmentSummary";

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
                title="Appointment Reports"
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
                <Card sx={{ mt: 2 }}>
                    <Typography variant="h6" textAlign={"start"} p={1}>Appointment trend</Typography>
                    <Divider />
                    <AppointmentTrend 
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />
                </Card>
                <Card sx={{ mt: 2 }}>
                    <Typography variant="h6" textAlign={"start"} p={1}>Summary</Typography>
                    <Divider />
                    <AppointmentSummary 
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />
                </Card>
                <Box p={1} />
            </Container>
        </>
    );
}