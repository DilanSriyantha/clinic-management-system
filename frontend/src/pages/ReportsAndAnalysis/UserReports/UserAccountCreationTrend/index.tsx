import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { UserAccountCreationTrendType } from "../../../../types";
import { DatasetElementType } from "@mui/x-charts/internals";

interface UserAccountCreationTrendProps {
    startDate: string;
    endDate: string;
};

export default function UserAccountCreationTrend({ startDate, endDate }: UserAccountCreationTrendProps) {

    const [data, setData] = useState<UserAccountCreationTrendType[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchUserAccountCreationTrend();
    }, [startDate && endDate]);

    const fetchUserAccountCreationTrend = useCallback(async () => {
        try{
            const res = await api.get<UserAccountCreationTrendType[]>("/users/getUserAccountCreateTrend", {
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
                            label: 'Number of Accounts',
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