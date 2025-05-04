import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";

interface UserAccountsSummary {
    total: number;
    adminCount: number;
    doctorCount: number;
    receptionistCount: number;
    pharmacistCount: number;
};

interface Row {
    field: string;
    value: number;
};

export default function UserAccountsSummary() {

    const [rows, setRows] = useState<Row[]>([]);

    const api = useApi();

    useEffect(() => {
        fetchUserAccountsSummary();
    }, []);

    const fetchUserAccountsSummary = useCallback(async() => {
        try{
            const res = await api.get<UserAccountsSummary>("/users/getUserAccountsSummary");

            if(!res) return;

            setRows([
                { field: "Total", value: res.total },
                { field: "Admin Count", value: res.adminCount },
                { field: "Doctor Count", value: res.doctorCount },
                { field: "Receptionist Count", value: res.receptionistCount },
                { field: "Pharmacist Count", value: res.receptionistCount }
            ]);
        }catch(err){
            console.log(err);
        }
    }, []);

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