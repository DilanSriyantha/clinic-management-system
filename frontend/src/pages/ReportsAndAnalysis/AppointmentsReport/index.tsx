import { Box, Button, Card, Container, Divider, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import DateRangePicker, { DateRange } from "../../../components/DateRangePicker";
import { useCallback, useMemo, useState } from "react";
import moment from "moment";
import AppointmentTrend from "./AppointmentTrend";
import AppointmentSummary from "./AppointmentSummary";
import { ElementCapturer } from "../../../utils/ElementCapturer";
import { useAlert } from "../../../hooks/useAlert";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const firstDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1);
const lastDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1, 0);

export default function PatientReports() {

    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: moment(firstDayOfMonth).format("YYYY-MM-DD"),
        endDate: moment(lastDayOfMonth).format("YYYY-MM-DD")
    });
    const [loading, setLoading] = useState<boolean>(false);

    const alert = useAlert();

    function handleDateRangeChange(value: DateRange): void {
        console.log(value);
        setDateRange(value);
    }

    const handleExportClick = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ElementCapturer.exportElementToPdf("content-container");

            if (!res) return;

            alert.setSuccess("Report exported successfully.");
            setLoading(false);
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error occurred.");
            setLoading(false);
        }
    }, []);

    interface ReportContentProps {
        dateRange: DateRange;
    };

    function ReportContent({ dateRange }: ReportContentProps) {
        return (
            <>
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
            </>
        );
    };

    return (
        <>
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
                            <Button variant="contained" onClick={handleExportClick} loading={loading} loadingPosition="start">Export</Button>
                        </Stack>
                    </Card>
                    {
                        useMemo(() => <ReportContent dateRange={dateRange}/>, [dateRange])
                    }
                </Container>
            </>
            <>
                <div
                    id="content-container"
                    style={{
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX}px`,
                        position: "fixed",
                        top: "-9999px",
                        left: "-9999px",
                        background: "#ffffff",
                        zIndex: -1,
                        overflow: "hidden"
                    }}
                >
                    <Container sx={{ bgcolor: "white" }}>
                        <Card>
                            <Typography variant="h3">Appointment Report</Typography>
                            <Typography variant="subtitle1">{`${dateRange.startDate} - ${dateRange.endDate}`}</Typography>
                        </Card>
                        {
                            useMemo(() => <ReportContent dateRange={dateRange}/>, [dateRange])
                        }
                    </Container>
                </div>
            </>
        </>
    );
}