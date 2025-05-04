import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { ClinicSummaryType } from "../../../../types";

export interface ClinicSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number | string;
};

export default function ClinicSummary({ startDate, endDate }: ClinicSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchClinicSummary();
    }, [startDate && endDate]);

    const fetchClinicSummary = useCallback(async () => {
        try {
            const res = await api.get<ClinicSummaryType>("/clinic-management/getClinicSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Total", value: res.totalClinics },
                { field: "Clinic with highest average patients", value: res.clinicWithHighestAvgPatients },
                { field: "Highest average patients percentage", value: `${res.highestAvgPatientsPercentage.toFixed(1)}%` },
                { field: "Clinic with highest average appointments", value: res.clinicWithHighestAvgAppointments },
                { field: "Highest average appointments percentage", value: `${res.highestAvgAppointmentsPercentage.toFixed(1)}%` },
                { field: "Busiest day of week", value: res.busiestDayOfWeek }
            ]);
        } catch (err) {
            console.log(err);
        }
    }, [startDate && endDate]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell align="right">Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.field}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.field}
                                </TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}