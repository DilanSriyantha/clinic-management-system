import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { SalesTrendType } from "../../../../types";

interface SalesTrendProps {
    startDate: string;
    endDate: string;
};

export default function SalesTrend({ startDate, endDate }: SalesTrendProps) {

    const [data, setData] = useState<SalesTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPatientRegistrationTrend();
    }, [startDate && endDate]);

    const fetchPatientRegistrationTrend = useCallback(async () => {
        try {
            const res = await api.get<SalesTrendType[]>("/invoice/getSalesTrend", {
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
                            data: data.map(d => d.saleDate)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'totalSales',
                            label: 'Total Sales',
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