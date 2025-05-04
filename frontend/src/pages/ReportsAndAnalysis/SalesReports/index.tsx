import { Box, Button, Card, Container, Divider, Grid2, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import DateRangePicker, { DateRange } from "../../../components/DateRangePicker";
import { useState } from "react";
import moment from "moment";
import Top5Sales from "./Top5Sales";
import SalesTrend from "./SalesTrend";
import SalesSummary from "./SalesSummary";

const firstDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1);
const lastDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1, 0);

export default function SalesReports() {

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
                title="Sales Reports"
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
                            <Typography variant="h6" textAlign={"start"} p={1}>Top 5 sales</Typography>
                            <Divider />
                            <Top5Sales 
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                            />
                        </Card>
                    </Grid2>
                    <Grid2 size={6}>
                        <Card>
                            <Typography variant="h6" textAlign={"start"} p={1}>Sales trend</Typography>
                            <Divider />
                            <SalesTrend 
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                            />
                        </Card>
                    </Grid2>
                </Grid2>
                <Card sx={{ mt: 2 }}>
                    <Typography variant="h6" textAlign={"start"} p={1}>Summary</Typography>
                    <Divider />
                    <SalesSummary
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />
                </Card>
                <Box p={1} />
            </Container>
        </>
    );
}