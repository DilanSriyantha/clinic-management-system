import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { ClinicAppointmentDistributionType } from "../../../../types";
import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-date-pickers/internals";

interface ClinicAppointmentDistributionProps {
    startDate: string;
    endDate: string;
};

export default function ClinicAppointmentDistribution({ startDate, endDate }: ClinicAppointmentDistributionProps) {

    const [data, setData] = useState<readonly MakeOptional<PieValueType, "id">[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchInformation();
    }, [startDate && endDate]);

    const fetchInformation = useCallback(async () => {
        try {
            const res = await api.get<ClinicAppointmentDistributionType[]>("/clinic-management/getClinicAppointmentDistribution", {
                startDate: startDate,
                endDate: endDate
            });
            
            if (!res) return;

            const tmpData = [];
            for (let i = 0; i < res.length; i++) {
                tmpData.push({ id: i, value: res[i].appointmentCount, label: `${res[i].clinicName} (${res[i].appointmentPercentage.toFixed(1)})%` });
            }

            setData(tmpData);
        } catch (err) {
            console.log(err);
        }
    }, [startDate && endDate]);

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