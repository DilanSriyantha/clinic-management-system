import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { PatientAgeDistributionTrendType } from "../../../../types";
import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-date-pickers/internals";

export default function PatientAgeDistributionTrend() {

    const [data, setData] = useState<readonly MakeOptional<PieValueType, "id">[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchInformation();
    }, []);

    const fetchInformation = useCallback(async () => {
        try {
            const res = await api.get<PatientAgeDistributionTrendType[]>("/patient-management/getPatientAgeDistributionTrend");
            if (!res) return;

            const tmpData = [];
            let sum = 0;
            for (let i = 0; i < res.length; i++) {
                tmpData.push({ id: i, value: res[i].totalPatients, label: res[i].ageGroup });
                sum += res[i].totalPatients;
            }

            const getPercentage = (count: number, sum: number) => ((count / sum) * 100).toFixed(1);

            tmpData.forEach(d => {
                d.label = `${d.label} (${getPercentage(d.value, sum)}%)`
            });

            setData(tmpData);
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <>
            <Box
                p={1}
            >
                <PieChart
                    series={[
                        {
                            data: data,
                        },
                    ]}
                    width={200}
                    height={230}
                />
            </Box>
        </>
    );
}