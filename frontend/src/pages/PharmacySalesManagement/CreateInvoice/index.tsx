import { Button, Card, Divider, Grid2, Stack, TextField, Typography } from "@mui/material";
import InvoiceTable from "../../../components/InvoiceTable";
import moment from "moment";
import { Add, Send } from "@mui/icons-material";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { InvoiceCreateRequest, InvoiceRecord, InvoiceRecordCreateRequest, ItemDto, PageResponse } from "../../../types";
import MultipleItemsDialog from "../../../components/MultipleItemsDialog";
import { useAuth } from "../../../hooks/useAuth";

interface CreateInvoiceState {
    invoiceNumber: number;
    rows: InvoiceRecord[];
    matchingItems: ItemDto[];
    itemCode: number;
    quantity: number;
    subtotal: number;
    loading: boolean;
};

enum ActionType {
    SET_FIELD,
    ADD_ROW,
    REMOVE_ROWS,
    UPDATE_SUBTOTAL,
    SET_MATCHING_ITEMS,
    START_LOADING,
    STOP_LOADING,
    SET_INVOICE_NUMBER,
    RESET
};

const initialState: CreateInvoiceState = {
    invoiceNumber: -1,
    rows: [],
    matchingItems: [],
    itemCode: 0,
    quantity: 0,
    subtotal: 0,
    loading: false
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
        case ActionType.SET_MATCHING_ITEMS:
            return { ...state, matchingItems: action.payload, loading: false };
        case ActionType.START_LOADING: 
            return { ...state, loading: true };
        case ActionType.STOP_LOADING:
            return { ...state, loading: false };
        case ActionType.SET_INVOICE_NUMBER:
            return { ...state, invoiceNumber: action.payload }
        case ActionType.RESET:
            return { ...initialState }
        default:
            return state;
    }
};

function CreateInvoice() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();
    const [user] = useAuth();

    useEffect(() => {
        fetchNextInvoiceNumber();
    }, []);

    const fetchNextInvoiceNumber = useCallback(async () => {
        try{
            const res = await api.get<number>("/invoice/nextInvoiceNumber");
            if(res) 
                dispatch({ type: ActionType.SET_INVOICE_NUMBER, payload: res});
        }catch(err) {
            console.log(err);
            dispatch({ type: ActionType.START_LOADING, payload: null });
            alert.setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    }, []);

    const handleAddRecord = useCallback((item: InvoiceRecord | undefined) => {
        if(!item) return;

        item.quantity = state.quantity;
        item.total = item.unitPrice*state.quantity;

        dispatch({ type: ActionType.ADD_ROW, payload: item });
    }, [state.quantity, state.rows]);

    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: event.target.name, value: event.target.value } });
    }, [state.itemCode, state.quantity]);

    const handleDelete = useCallback((ids: readonly number[]): void | Promise<void> => {
        dispatch({ type: ActionType.REMOVE_ROWS, payload: ids });
    }, [state.rows]);

    const fetchItems = useCallback(async () => {
        console.log(state.itemCode);
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try{
            const res = await api.get<PageResponse<ItemDto>>("/pharmacy-stock-management/items/getByItemCode", {
                page: "0",
                pageSize: "5",
                itemCode: `${state.itemCode}`
            });
            if(res)
                dispatch({ type: ActionType.SET_MATCHING_ITEMS, payload: res.content });
        }catch(err){
            console.log(err);
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
            alert.setError(err instanceof Error ? err.message : "Unknown error.");
        }
    }, [state.itemCode]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLFormElement>): void => {
        if(!event.key.match("Enter")) return;
        fetchItems();
    }, [state.itemCode]);

    const closeItemsDialog = useCallback((item: InvoiceRecord | undefined) => {
        dispatch({ type: ActionType.SET_MATCHING_ITEMS, payload: [] });
        handleAddRecord(item);
    }, [state.rows, state.matchingItems]);

    const onAdd = useCallback(() => {
        fetchItems();
    }, [state.itemCode]);

    const onSubmit = useCallback(async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try{
            const res = await api.post<InvoiceCreateRequest, BasicResultSet>("/invoice/create", {
                number: state.invoiceNumber,
                date: moment(Date.now()).format("YYYY-MM-DD"),
                subTotal: state.subtotal,
                pharmacistId: user!.user.id,
                records: state.rows.map(r => {
                    return {
                        itemId: r.itemId,
                        quantity: Number(r.quantity),
                        total: r.total
                    } as InvoiceRecordCreateRequest;
                }),
            });
            if(res) {
                dispatch({ type: ActionType.RESET, payload: null });
                alert.setSuccess(res.message);
                fetchNextInvoiceNumber();
            }
        } catch(err) {
            console.log(err);
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
            alert.setError(err instanceof Error ? err.message : "Unknown error.");
        }
    }, [state]);

    return (
        <>
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
                                    <Typography pt={2} variant="h3">{state.invoiceNumber}</Typography>
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
                                    <form onKeyDown={handleKeyDown}>
                                        <Stack direction={"column"} sx={{ pt: 2, height: "100%" }} gap={1}>
                                            <TextField type="text" label="Item Code" name="itemCode" onChange={handleInput} value={state.itemCode}/>
                                            <TextField type="number" label="Quantity" name="quantity" onChange={handleInput} value={state.quantity}/>
                                            <Stack direction={"column"} gap={1}>
                                                <Button variant="outlined" startIcon={<Add />} loading={state.loading} loadingPosition="start" onClick={onAdd}>Add</Button>
                                                <Button variant="contained" startIcon={<Send />} loading={state.loading} loadingPosition="start" onClick={onSubmit}>Submit</Button>
                                            </Stack>
                                        </Stack>
                                    </form>
                                </Card>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Stack>
            <MultipleItemsDialog rows={state.matchingItems} open={state.matchingItems.length > 0} onClose={closeItemsDialog} />
        </>
    );
}

export default CreateInvoice;