import { Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, alpha, IconButton, Toolbar, Tooltip, Typography, SxProps, Theme, useTheme } from "@mui/material";
import { MouseEvent, useCallback, useState } from "react";

interface EnhancedTableToolbarProps {
    numSelected: number;
    onDelete: () => void | Promise<void>
};

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const theme = useTheme();
    const { numSelected } = props;

    return (
        <Toolbar
            sx={[
                numSelected > 0 ? {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                } : { display: "none" },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 && (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={props.onDelete}>
                        <Delete htmlColor={theme.palette.error.main} />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

interface InvoiceTableProps {
    rows: any[];
    sx?: SxProps<Theme>;
    onDelete?: (ids: readonly number[]) => void | Promise<void>;
};

const InvoiceTable: React.FC<InvoiceTableProps> = (props) => {

    const [selected, setSelected] = useState<readonly number[]>([]);

    function handleDelete(): void {
        if(!props.onDelete) return;

        setSelected([]);
        props.onDelete(selected);
    }

    const handleClick = useCallback((event: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>, id: any): void => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    }, [selected]);

    return (
        <TableContainer component={Paper} sx={{...props.sx}}>
            <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDelete} />
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>#</TableCell>
                        <TableCell align="right">Item Code</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row, idx) => {
                        const isItemSelected = selected.includes(row.id);
                        const labelId = `enhanced-table-checkbox-${idx}`;

                        return (
                            <TableRow
                                key={Math.random()}
                                hover
                                onClick={(event) => handleClick(event, row.id)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {(idx + 1)}
                                </TableCell>
                                <TableCell align="right">{row.itemCode}</TableCell>
                                <TableCell align="right">{row.description}</TableCell>
                                <TableCell align="right">{row.unitPrice.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default InvoiceTable;