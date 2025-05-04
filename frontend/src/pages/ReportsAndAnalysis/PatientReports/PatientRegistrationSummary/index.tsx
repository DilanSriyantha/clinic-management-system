import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { PatientRegistrationSummaryType } from "../../../../types";

export interface PatientRegistrationSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number;
};

export default function PatientRegistrationSummary({ startDate, endDate }: PatientRegistrationSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        console.log("changed");
        fetchPatientRegistrationSummary();
    }, [startDate && endDate]);

    const fetchPatientRegistrationSummary = useCallback(async () => {
        try {
            const res = await api.get<PatientRegistrationSummaryType>("/patient-management/getPatientRegistrationSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Total", value: res.totalPatients },
                { field: "New Patients (in period)", value: res.newPatientsInPeriod },
                { field: "Age 50+", value: res.age50Plus },
                { field: "Age 25-49", value: res.age25To49 },
                { field: "Age 18-24", value: res.age18To24 },
                { field: "Age 10-17", value: res.age10To17 },
                { field: "Age below 10", value: res.ageBelow10 }
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