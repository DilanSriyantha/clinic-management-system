import { Box, Button, Card, Divider, Grid2, Stack, TextField, Typography } from "@mui/material";
import InvoiceTable from "../../../components/InvoiceTable";
import moment from "moment";
import { Add, Send } from "@mui/icons-material";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer, useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { CreateInvoiceRequest, InvoiceRecord, CreateInvoiceRecordRequest, ItemDto, PageResponse, Invoice } from "../../../types";
import MultipleItemsDialog from "../../../components/MultipleItemsDialog";
import { useAuth } from "../../../hooks/useAuth";
import PaymentConfirmation from "../../../components/PaymentConfirmation";
import { useLocation, useNavigate } from "react-router";
import { For } from "../../../enums/For";

export interface CreateInvoiceState {
    invoiceNumber: number;
    rows: InvoiceRecord[];
    matchingItems: ItemDto[];
    itemCode: number;
    quantity: number;
    subtotal: number;
    discount: number;
    paidAmount: number;
    balance: number;
    patientId: number;
    patientName: string;
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
    SET_PAYMENT_INFO,
    SET_PAID_AMOUNT,
    SET_PATIENT,
    RESTORE_CACHED_STATE,
    RESET
};

const initialState: CreateInvoiceState = {
    invoiceNumber: -1,
    rows: [],
    matchingItems: [],
    itemCode: 0,
    quantity: 0,
    subtotal: 0,
    discount: 0,
    paidAmount: 0,
    balance: 0,
    patientId: -1,
    patientName: "",
    loading: false
};

const reducer = (state: CreateInvoiceState, action: { type: ActionType, payload: any }): CreateInvoiceState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return { ...state, [action.payload.name]: action.payload.value };
        case ActionType.ADD_ROW:
            return { ...state, rows: [...state.rows, action.payload], subtotal: state.subtotal+action.payload.total };
        case ActionType.REMOVE_ROWS:
            return { ...state, rows: state.rows.filter((row) => !action.payload.includes(row.id)), subtotal: state.rows.reduce((acc, row) => {if(!action.payload.includes(row.id)) return acc + (row.total ? row.total : 0); else return acc;}, 0) }
        case ActionType.UPDATE_SUBTOTAL:
            return { ...state, subtotal: action.payload };
        case ActionType.SET_MATCHING_ITEMS:
            return { ...state, matchingItems: action.payload, loading: false };
        case ActionType.START_LOADING: 
            return { ...state, loading: true };
        case ActionType.STOP_LOADING:
            return { ...state, loading: false };
        case ActionType.SET_INVOICE_NUMBER:
            return { ...state, invoiceNumber: action.payload };
        case ActionType.SET_PAID_AMOUNT: 
            return { ...state, paidAmount: action.payload, balance: action.payload-state.subtotal };
        case ActionType.SET_PATIENT:
            return { ...state, patientId: action.payload.id, patientName: action.payload.name };
        case ActionType.RESTORE_CACHED_STATE:
            return action.payload;
        case ActionType.RESET:
            return { ...initialState }
        default:
            return state;
    }
};

function CreateInvoice() {

    const [state, dispatch] = useReducer(reducer, initialState);
    const [paymentConfirmationOpen, setPaymentConfirmationOpen] = useState<boolean>(false);

    const api = useApi();
    const alert = useAlert();
    const [user] = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        populateWithCachedState();
        setPatient();
        fetchNextInvoiceNumber();
    }, []);

    const populateWithCachedState = useCallback(() => {
        let cachedState = localStorage.getItem("invoiceState");
        if(!cachedState) return;
        cachedState = JSON.parse(cachedState);
        localStorage.removeItem("invoiceState");
        dispatch({ type: ActionType.RESTORE_CACHED_STATE, payload: cachedState });
    }, []);

    const setPatient = useCallback(() => {
        if(!(location.state && location.state.patient)) return;

        dispatch({ type: ActionType.SET_PATIENT, payload: location.state.patient });
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

    const handlePaymentConfirmationClose = () => {
        setPaymentConfirmationOpen(false);
    };

    const handlePaidAmountChange = useCallback((paidAmount: number) => {
        dispatch({ type: ActionType.SET_PAID_AMOUNT, payload: paidAmount });
    }, [state.paidAmount, state.balance]);

    const onSubmit = async () => {
        setPaymentConfirmationOpen(true);
    };

    const handleAddPatient = useCallback(() => {
        localStorage.setItem("invoiceState", JSON.stringify(state));
        navigate("/patient-management/list", { state: {...state, for: For.SELECTING_PATIENT_FOR_INVOICE} });
    }, [state]);

    const handlePaymentConfirmed = () => {
        setPaymentConfirmationOpen(false);
        createInvoice();
    };

    const createInvoice = async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try{
            const res = await api.post<CreateInvoiceRequest, BasicResultSet>("/invoice/create", {
                number: state.invoiceNumber,
                date: moment(Date.now()).format("YYYY-MM-DD"),
                subtotal: state.subtotal,
                discount: state.discount,
                paidAmount: state.paidAmount,
                balance: state.balance,
                pharmacistId: user!.user.id,
                patientId: state.patientId,
                records: state.rows.map(row => {
                    return {
                        invoiceId: state.invoiceNumber,
                        invoiceNumber: state.invoiceNumber,
                        itemId: row.itemId,
                        quantity: row!.quantity,
                        total: row!.total
                    } as CreateInvoiceRecordRequest;
                })
            });

            if(!res) return;
            
            generateInvoicePdf();
        } catch(err) {
            console.log(err);
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
            alert.setError(err instanceof Error ? err.message : "Unknown error.");
        }
    };

    const generateInvoicePdf = useCallback(() => {
        const invoice: Invoice = {
            id: state.invoiceNumber,
            number: state.invoiceNumber,
            date: Date.now(),
            subTotal: state.subtotal,
            pharmacistName: user!.user.name,
            patientName: state.patientName,
            records: state.rows,
            paidAmount: 5000,
            createdAt: moment(Date.now()),
            updatedAt: moment(Date.now()),
        };

        try{
            const res = window.InvoiceGenerator.generateInvoicePdf(JSON.stringify(invoice));
            if(!res) return;

            console.log(res);

            dispatch({ type: ActionType.RESET, payload: null });
            alert.setSuccess("Invoice created successfully.");
            fetchNextInvoiceNumber();
        }catch(err) {
            console.log(err);
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
            alert.setError(err instanceof Error ? err.message : "Unknown error.");
        }
    }, [state, user]);

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
                                    <Typography pt={1} variant="h5">{moment(Date.now()).format("YYYY/MM/DD")}</Typography>
                                </Card>
                            </Grid2>
                            <Grid2 size={12}>
                                <Card sx={{ p: 1, height: "100%" }}>
                                    <Typography variant="h6">Patient</Typography>
                                    <Divider />
                                    <Box pt={1}>
                                        <a style={{ cursor: "pointer" }} onClick={handleAddPatient}>{state.patientName ? state.patientName : "(+) Select"}</a>
                                    </Box>
                                </Card>
                            </Grid2>
                            <Grid2 size={12}>
                                <Card sx={{ p: 1, height: "100%" }}>
                                    <Typography variant="h6">Invoice</Typography>
                                    <Divider />
                                    <Typography pt={1} variant="h5">{state.invoiceNumber}</Typography>
                                </Card>
                            </Grid2>
                            <Grid2 size={12}>
                                <Card sx={{ p: 1, height: "100%" }}>
                                    <Typography variant="h6">Subtotal</Typography>
                                    <Divider />
                                    <Typography pt={1} variant="h5">{`LKR ${state.subtotal.toFixed(2)}`}</Typography>
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

            <PaymentConfirmation open={paymentConfirmationOpen} onClose={handlePaymentConfirmationClose} onPaidAmountChange={handlePaidAmountChange} onConfirm={handlePaymentConfirmed} invoice={state} />
        </>
    );
}

export default CreateInvoice;