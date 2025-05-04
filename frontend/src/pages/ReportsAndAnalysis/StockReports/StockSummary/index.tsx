import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { StockSummaryType } from "../../../../types";

export interface StockSummaryProps {
    startDate: string;
    endDate: string;
}

interface Row {
    field: string;
    value: number | string;
};

export default function StockSummary({ startDate, endDate }: StockSummaryProps) {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchPrescriptionSummary();
    }, [startDate && endDate]);

    const fetchPrescriptionSummary = useCallback(async () => {
        try {
            const res = await api.get<StockSummaryType>("/pharmacy-stock-management/stocks/getStockSummary", {
                startDate: startDate,
                endDate: endDate
            });

            if (!res) return;

            setRows([
                { field: "Top vendor name", value: res.topVendorName },
                { field: "Top vendor stock count", value: res.topVendorStockCount },
                { field: "Fastest moving item name", value: res.fastestMovingItemName },
                { field: "Fastest moving item quantity", value: res.fastestMovingItemQty },
                { field: "Slowest moving item name", value: res.slowestMovingItemName },
                { field: "Slowest moving item quantity", value: res.slowestMovingItemQty },
                { field: "Low stocks items count", value: res.lowStockItemCount },
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