import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { AppointmentSummaryType } from "../../../../types";

export interface ClinicSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number | string;
};

export default function AppointmentSummary({ startDate, endDate }: ClinicSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchAppointmentSummary();
    }, [startDate && endDate]);

    const fetchAppointmentSummary = useCallback(async () => {
        try {
            const res = await api.get<AppointmentSummaryType>("/appointment-management/getAppointmentSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Total", value: res.totalAppointments },
                { field: "Average appointments per day", value: res.averageAppointmentsPerDay.toFixed(1) },
                { field: "Date with highest appointments", value: res.dateWithHighestAppointments },
                { field: "Top Patient", value: res.topPatientName },
                { field: "Total appointments for top patient", value: res.totalAppointmentsForTopPatient }
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