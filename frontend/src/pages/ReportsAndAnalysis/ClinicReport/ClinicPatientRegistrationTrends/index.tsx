import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { ClinicPatientRegTrendType } from "../../../../types";

interface ClinicPatientRegistrationTrendProps {
    startDate: string;
    endDate: string;
};

export default function ClinicPatientRegistrationTrend({ startDate, endDate }: ClinicPatientRegistrationTrendProps) {

    const [data, setData] = useState<ClinicPatientRegTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchClinicPatientRegistrationTrend();
    }, [startDate && endDate]);

    const fetchClinicPatientRegistrationTrend = useCallback(async () => {
        try {
            const res = await api.get<ClinicPatientRegTrendType[]>("/clinic-management/getClinicPatientRegTrend", {
                startDate: `${startDate}`,
                endDate: `${endDate}`
            });

            if (!res) return;

            console.log(res);
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
                            data: data.map(d => d.clinicName)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'patientCount',
                            label: 'Number of Patients',
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