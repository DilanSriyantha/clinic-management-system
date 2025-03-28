import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useReducer } from "react";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { ItemCreateRequest } from "../../../types";
import { useLocation } from "react-router";

interface CreateItemState {
    isLoading: boolean;
    item: ItemCreateRequest;
};

const initialState: CreateItemState = {
    isLoading: false,
    item: {
        caption: "",
        description: "",
        initialQty: 0,
        currentQty: 0,
        unitPurchasePrice: 0,
        unitSellingPrice: 0
    },
};

enum ActionType {
    SET_FIELD,
    SET_ALL_FIELDS,
    SET_LOADING,
};

const reducer = (state: CreateItemState, action: { type: ActionType, payload: any }): CreateItemState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, item: { ...state.item, [action.payload.name]: action.payload.value } };
        case ActionType.SET_ALL_FIELDS:
            return { ...state, item: { caption: action.payload.caption, description: action.payload.description, initialQty: action.payload.initialQty, currentQty: action.payload.currentQty, unitPurchasePrice: action.payload.unitPurchasingPrice, unitSellingPrice: action.payload.uniSellingPrice } };
        case ActionType.SET_LOADING:
            return {...state, isLoading: action.payload};
        default: 
            return state;
    }
};

function CreateItem() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        if(!location.state) return;

        dispatch({ type: ActionType.SET_ALL_FIELDS, payload: location.state });
    }, []);

    console.log(state);

    useEffect(() => {
        console.log(state);
    }, [state]);

    const handleSubmit = useCallback(async () => {
        try{
            if(!isValid(state, ["loading"])){
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            if(location.state){
                updateItem();
                return;
            }

            createItem();
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }

    }, [state]);

    const createItem = useCallback(async () => {
        try{
            const res = await api.post<ItemCreateRequest, BasicResultSet>("/pharmacy-stock-management/create", state.item);
            if(res){
                console.log(res);
                alert.setSuccess("Item created successfully");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const updateItem = useCallback(async () => {
        if(!location.state) return;

        try{
            const res = await api.put<ItemCreateRequest, BasicResultSet>("/pharmacy-stock-management/update", {
                itemId: `${location.state.id}`,
            }, state.item);
            if(res){
                console.log(res);
                alert.setSuccess("Item updated successfully.");
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleClear = useCallback(() => {
        window.location.reload();
    }, []);

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if(e.key.match("Enter"))
            handleSubmit();
    }

    const handleTextFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: e.target.name, value: e.target.value } });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Pharmacy Stock Management"
                title="Create Item"
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
                            <TextField onChange={handleTextFieldChange} name="caption" label="Caption" type="text" value={state.item.caption} />
                            <TextField onChange={handleTextFieldChange} name="description" label="Description" type="text" value={state.item.description} />
                            <TextField onChange={handleTextFieldChange} name="initialQty" label="Initial Qty." type="number" value={state.item.initialQty} />
                            <TextField onChange={handleTextFieldChange} name="unitPurchasePrice" label="Unit Purchase Price" type="number" value={state.item.unitPurchasePrice} />
                            <TextField onChange={handleTextFieldChange} name="unitSellingPrice" label="Unit Selling Price" type="number" value={state.item.unitSellingPrice} />
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

export default CreateItem;