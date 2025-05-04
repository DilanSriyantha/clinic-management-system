import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { PrescriptionSummaryType } from "../../../../types";

export interface PrescriptionSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number;
};

export default function PrescriptionSummary({ startDate, endDate }: PrescriptionSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPrescriptionSummary();
    }, [startDate && endDate]);

    const fetchPrescriptionSummary = useCallback(async () => {
        try {
            const res = await api.get<PrescriptionSummaryType>("/prescription-management/getPrescriptionSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Total", value: res.totalPrescriptions },
                { field: "Total (in given period)", value: res.prescriptionsInPeriod },
                { field: "Average Items per Prescription", value: res.avgItemsPerPrescription }
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