import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { PrescriptionIssueDistributionType } from "../../../../types";
import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-date-pickers/internals";

export default function PrescriptionIssueDistribution() {

    const [data, setData] = useState<readonly MakeOptional<PieValueType, "id">[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchInformation();
    }, []);

    const fetchInformation = useCallback(async () => {
        try {
            const res = await api.get<PrescriptionIssueDistributionType[]>("/prescription-management/getPrescriptionIssueDistribution");
            if (!res) return;

            const tmpData = [];
            for (let i = 0; i < res.length; i++) {
                tmpData.push({ id: i, value: res[i].prescriptionCount, label: `${res[i].doctorName.split(" ")[0]} (${res[i].percentageOfTotal.toFixed(1)}%)` });
            }

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