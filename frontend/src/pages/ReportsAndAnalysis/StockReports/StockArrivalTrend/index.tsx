import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { DatasetElementType } from "@mui/x-charts/internals";
import { StockArrivalTrendType } from "../../../../types";

interface PrescriptionIssueTrendProps {
    startDate: string;
    endDate: string;
};

export default function StockArrivalTrend({ startDate, endDate }: PrescriptionIssueTrendProps) {

    const [data, setData] = useState<StockArrivalTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPatientRegistrationTrend();
    }, [startDate && endDate]);

    const fetchPatientRegistrationTrend = useCallback(async () => {
        try {
            const res = await api.get<StockArrivalTrendType[]>("/pharmacy-stock-management/stocks/getStockArrivalTrend", {
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
                            data: data.map(d => d.stockDate)
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'newStockCount',
                            label: 'Number of Stocks',
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