import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { AppointmentTrendType } from "../../../../types";

interface AppointmentTrendProps {
    startDate: string;
    endDate: string;
};

export default function AppointmentTrend({ startDate, endDate }: AppointmentTrendProps) {

    const [data, setData] = useState<AppointmentTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchAppointmentTrend();
    }, [startDate && endDate]);

    const fetchAppointmentTrend = useCallback(async () => {
        try {
            const res = await api.get<AppointmentTrendType[]>("/appointment-management/getAppointmentTrend", {
                startDate: `${startDate}`,
                endDate: `${endDate}`
            });

            if (!res) return;

            setData(res);
        } catch (err) {
            console.log(err);
        }
    }, [startDate && endDate]);

    return (
        <>
            <Box
                p={1}
            >
                <LineChart
                    xAxis={[
                        {
                            id: 'date',
                            scaleType: 'band',
                            data: data.map(d => d.appointmentDate)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'appointmentCount',
                            label: 'Number of Appointments',
                            area: true,
                        },
                    ]}
                    dataset={data as unknown as DatasetElementType<number>[]}
                    height={200}
                />
            </Box>
        </>
    );
}