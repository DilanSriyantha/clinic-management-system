import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { PatientRegistrationTrendType } from "../../../../types";

interface PatientRegistrationTrendProps {
    startDate: string;
    endDate: string;
};

export default function PatientRegistrationTrend({ startDate, endDate }: PatientRegistrationTrendProps) {

    const [data, setData] = useState<PatientRegistrationTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPatientRegistrationTrend();
    }, [startDate && endDate]);

    const fetchPatientRegistrationTrend = useCallback(async () => {
        try{
            const res = await api.get<PatientRegistrationTrendType[]>("/patient-management/getPatientRegistrationTrend", {
                startDate: `${startDate}`,
                endDate: `${endDate}`
            });

            if(!res) return;

            console.log(res);
            setData(res);
        }catch(err){
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
                            data: data.map(d => d.creationDate)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'accountsCreated',
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