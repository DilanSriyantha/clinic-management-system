import { Button, Card, Divider, Grid2, Stack, TextField, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import InvoiceTable from "../../../components/InvoiceTable";
import moment from "moment";
import { Add } from "@mui/icons-material";
import { ChangeEvent, useCallback, useReducer } from "react";
import { isValid } from "../../../utils/Validator";

const columns: GridColDef<Row[]>[] = [
    {
        field: "recordNumber",
        headerName: "#",
        width: 70,
        valueGetter: (val, row, col, api) => api.current.getRowId(row)
    },
    {
        field: "itemCode",
        headerName: "Item Code",
        width: 150
    },
    {
        field: "description",
        headerName: "Description",
        width: 200,
    },
    {
        field: "unitPrice",
        headerName: "Unit Price",
        width: 100
    },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 70
    },
    {
        field: "total",
        headerName: "Total",
        width: 100
    }
];

interface Row {
    id: number;
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
};

interface CreateInvoiceState {
    rows: Row[];
    itemCode: string;
    quantity: number;
    subtotal: number;
};

enum ActionType {
    SET_FIELD,
    ADD_ROW,
    REMOVE_ROWS,
    UPDATE_SUBTOTAL
};

const initialState: CreateInvoiceState = {
    rows: [],
    itemCode: "",
    quantity: 0,
    subtotal: 0,
};

const reducer = (state: CreateInvoiceState, action: { type: ActionType, payload: any }): CreateInvoiceState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return { ...state, [action.payload.name]: action.payload.value };
        case ActionType.ADD_ROW:
            return { ...state, rows: [...state.rows, action.payload], subtotal: state.subtotal+action.payload.total };
        case ActionType.REMOVE_ROWS:
            return { ...state, rows: state.rows.filter((row) => !action.payload.includes(row.id)), subtotal: state.rows.reduce((acc, row) => {if(!action.payload.includes(row.id)) return acc + row.total; else return acc;}, 0) }
        case ActionType.UPDATE_SUBTOTAL:
            return { ...state, subtotal: action.payload };
        default:
            return state;
    }
};

function CreateInvoice() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleAddRecord = useCallback(() => {
        if(!isValid(state, ["rows"])) return;

        dispatch({ type: ActionType.ADD_ROW, payload: { id: Math.random(), itemCode: state.itemCode, description: "Panadol", unitPrice: 5, quantity: state.quantity, total: (5*state.quantity) } });
    }, [state]);

    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: event.target.name, value: event.target.value } });
    }, [state.itemCode, state.quantity]);

    const handleDelete = useCallback((ids: readonly number[]): void | Promise<void> => {
        dispatch({ type: ActionType.REMOVE_ROWS, payload: ids });
    }, [state.rows]);

    return (
        <Stack direction={"row"} gap={1} sx={{ height: "100%", width: "100%", pb: 2 }}>
            <Grid2 container size={12} spacing={1} sx={{ height: "100%", width: "100%" }}>
                <Grid2 size={8} >
                    <Card sx={{ height: "100%", width: "100%" }}>
                        <InvoiceTable
                            sx={{
                                width: "100%",
                                height: "100%",
                            }}
                            rows={state.rows}
                            onDelete={handleDelete}
                        />
                    </Card>
                </Grid2>
                <Grid2 size={4}>
                    <Grid2 container size={12} spacing={1} sx={{ height: "100%" }}>
                        <Grid2 size={12}>
                            <Card sx={{ p: 1, height: "100%" }}>
                                <Typography variant="h6">Date</Typography>
                                <Divider />
                                <Typography pt={2} variant="h3">{moment(Date.now()).format("YYYY/MM/DD")}</Typography>
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <Card sx={{ p: 1, height: "100%" }}>
                                <Typography variant="h6">Invoice</Typography>
                                <Divider />
                                <Typography pt={2} variant="h3">128</Typography>
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <Card sx={{ p: 1, height: "100%" }}>
                                <Typography variant="h6">Subtotal</Typography>
                                <Divider />
                                <Typography pt={2} variant="h3">{`LKR ${state.subtotal.toFixed(2)}`}</Typography>
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <Card sx={{ p: 1, height: "100%" }}>
                                <Typography variant="h6">Info</Typography>
                                <Divider />
                                <Stack direction={"column"} sx={{ pt: 2, height: "100%" }} gap={1}>
                                    <TextField type="text" label="Item Code" name="itemCode" onChange={handleInput}/>
                                    <TextField type="number" label="Quantity" name="quantity" onChange={handleInput}/>
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddRecord}>Add</Button>
                                </Stack>
                            </Card>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Stack>
    );
}

export default CreateInvoice;