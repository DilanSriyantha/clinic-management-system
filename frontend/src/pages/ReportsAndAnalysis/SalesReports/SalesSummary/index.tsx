import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { SaleSummaryType } from "../../../../types";

export interface SalesSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number | string;
};

export default function SalesSummary({ startDate, endDate }: SalesSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPrescriptionSummary();
    }, [startDate && endDate]);

    const fetchPrescriptionSummary = useCallback(async () => {
        try {
            const res = await api.get<SaleSummaryType>("/invoice/getSalesSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Total revenue", value: res.totalRevenue },
                { field: "Total items sold", value: res.totalItemsSold },
                { field: "Total invoices issued", value: res.totalInvoicesIssued },
                { field: "Patient with highest revenue", value: res.patientWithHighestRevenue },
                { field: "Highest revenue", value: res.highestRevenue },
                { field: "Patient with lowest revenue", value: res.patientWithLowestRevenue },
                { field: "Lowest revenue", value: res.lowestRevenue },
                { field: "Average revenue per patient", value: res.avgRevenuePerPatient }
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