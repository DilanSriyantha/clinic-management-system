import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { PrescriptionIssueTrendType } from "../../../../types";

interface PrescriptionIssueTrendProps {
    startDate: string;
    endDate: string;
};

export default function PrescriptionIssueTrend({ startDate, endDate }: PrescriptionIssueTrendProps) {

    const [data, setData] = useState<PrescriptionIssueTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPatientRegistrationTrend();
    }, [startDate && endDate]);

    const fetchPatientRegistrationTrend = useCallback(async () => {
        try {
            const res = await api.get<PrescriptionIssueTrendType[]>("/prescription-management/getPrescriptionIssueTrend", {
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
                            data: data.map(d => d.prescriptionDate)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'totalPrescriptions',
                            label: 'Number of Prescriptions',
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