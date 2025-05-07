import { Box, Button, Card, Container, Divider, Grid2, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import DateRangePicker, { DateRange } from "../../../components/DateRangePicker";
import { useCallback, useMemo, useState } from "react";
import moment from "moment";
import PrescriptionIssueDistribution from "./PrescriptionIssueDistribution";
import PrescriptionIssueTrend from "./PrescriptionIssueTrend";
import PrescriptionSummary from "./PrescriptionSummary";
import { useAlert } from "../../../hooks/useAlert";
import { ElementCapturer } from "../../../utils/ElementCapturer";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const firstDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1);
const lastDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1, 0);

export default function PrescriptionReports() {

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

            setLoading(false);
            alert.setSuccess("Report exported successfully.");
        } catch (err) {
            setLoading(false);
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error occurred");
        }
    }, []);

    interface ReportContentProps {
        dateRange: DateRange;
    }

    function ReportContent({ dateRange }: ReportContentProps) {
        return (
            <>
                <Grid2 mt={2} container size={12} spacing={1}>
                    <Grid2 size={6}>
                        <Card>
                            <Typography variant="h6" textAlign={"start"} p={1}>Prescription issue distribution</Typography>
                            <Divider />
                            <PrescriptionIssueDistribution />
                        </Card>
                    </Grid2>
                    <Grid2 size={6}>
                        <Card>
                            <Typography variant="h6" textAlign={"start"} p={1}>Prescription issue trend</Typography>
                            <Divider />
                            <PrescriptionIssueTrend
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                            />
                        </Card>
                    </Grid2>
                </Grid2>
                <Card sx={{ mt: 2 }}>
                    <Typography variant="h6" textAlign={"start"} p={1}>Summary</Typography>
                    <Divider />
                    <PrescriptionSummary
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />
                </Card>
                <Box p={1} />
            </>
        );
    }

    return (
        <>
            <>
                <PageTitle
                    title="Prescription Reports"
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
                        useMemo(() => <ReportContent dateRange={dateRange} />, [dateRange])
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
                            <Typography variant="h3">Prescription Report</Typography>
                            <Typography variant="subtitle1">{`${dateRange.startDate} - ${dateRange.endDate}`}</Typography>
                        </Card>
                        {
                            useMemo(() => <ReportContent dateRange={dateRange} />, [dateRange])
                        }
                    </Container>
                </div>
            </>
        </>
    );
}