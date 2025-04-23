import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer } from "react";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { StockCreateRequest } from "../../../types";
import { useLocation } from "react-router";
import moment, { Moment } from "moment";
import { DatePicker, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";

interface CreateStockState {
    isLoading: boolean;
    stock: StockCreateRequest;
};

const initialState: CreateStockState = {
    isLoading: false,
    stock: {
        caption: "",
        vendor: "",
        date: moment(Date.now()).format("yyyy-MM-DD")
    },
};

enum ActionType {
    SET_FIELD,
    SET_ALL_FIELDS,
    SET_LOADING,
};

const reducer = (state: CreateStockState, action: { type: ActionType, payload: any }): CreateStockState => {
    switch (action.type) {
        case ActionType.SET_FIELD:
            return { ...state, stock: { ...state.stock, [action.payload.name]: action.payload.value } };
        case ActionType.SET_ALL_FIELDS:
            return { ...state, stock: { caption: action.payload.caption, vendor: action.payload.vendor, date: action.payload.date } };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

function CreateStock() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        if (!location.state) return;

        dispatch({ type: ActionType.SET_ALL_FIELDS, payload: location.state });
    }, []);

    console.log(location.state);

    useEffect(() => {
        console.log(state);
    }, [state]);

    const handleSubmit = useCallback(async () => {
        try {
            if (!isValid(state, ["loading"])) {
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            if (location.state) {
                updateStock();
                return;
            }

            createStock();
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }

    }, [state]);

    const createStock = useCallback(async () => {
        try {
            const res = await api.post<StockCreateRequest, BasicResultSet>("/pharmacy-stock-management/stocks/create", state.stock);
            if (res) {
                console.log(res);
                alert.setSuccess("Stock created successfully");
            }
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const updateStock = useCallback(async () => {
        if (!location.state) return;

        try {
            const res = await api.put<StockCreateRequest, BasicResultSet>("/pharmacy-stock-management/stocks/update", {
                stockId: `${location.state.id}`,
            }, state.stock);
            if (res) {
                console.log(res);
                alert.setSuccess("Stock updated successfully.");
            }
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleClear = useCallback(() => {
        window.location.reload();
    }, []);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if (e.key.match("Enter"))
            handleSubmit();
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    const handleDatePickerChange = useCallback((value: Moment | null, context: PickerChangeHandlerContext<DateValidationError>): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "date", value: value } });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Pharmacy Stock Management"
                title={location.state ? "Update Stock" : "Create Stock"}
                backButton={location.state ? true : false}
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Box sx={{
                        textAlign: "start",
                        pb: 2,
                    }}>
                        <Typography variant="subtitle2">*Please fill the information required.</Typography>
                    </Box>
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleEnterKeyPress}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingBottom: 2,
                            width: "100%"
                        }}>
                            <TextField onChange={handleTextFieldChange} name="caption" label="Caption" type="text" value={state.stock.caption} />
                            <TextField onChange={handleTextFieldChange} name="vendor" label="Vendor" type="text" value={state.stock.vendor} />
                            <DatePicker onChange={handleDatePickerChange} name="date" label="Date" defaultValue={moment(new Date)} value={state.stock.date.length > 0 ? moment(Date.parse(state.stock.date)) : moment(new Date)} />
                        </Box>
                    </form>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}>
                        <Button variant="outlined" type="reset" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Container>
            </Card>
        </>
    );
}

export default CreateStock;