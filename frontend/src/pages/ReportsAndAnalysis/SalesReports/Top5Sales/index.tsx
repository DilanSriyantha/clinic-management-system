import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { TopSaleType } from "../../../../types";
import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-date-pickers/internals";

interface Top5SalesProps {
    startDate: string;
    endDate: string;
};

export default function Top5Sales({ startDate, endDate }: Top5SalesProps) {

    const [data, setData] = useState<readonly MakeOptional<PieValueType, "id">[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchInformation();
    }, []);

    const fetchInformation = useCallback(async () => {
        try {
            const res = await api.get<TopSaleType[]>("/invoice/getTop5Sales", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            const tmpData = [];
            for (let i = 0; i < res.length; i++) {
                tmpData.push({ id: i, value: res[i].qtySold, label: `${res[i].itemName} (${res[i].percentage.toFixed(1)}%)` });
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