import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Button, Card, Container, InputAdornment, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useCallback, useEffect, useReducer } from "react";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { isValid } from "../../../utils/Validator";
import { useAlert } from "../../../hooks/useAlert";
import { DrugCategoryOption, DrugFormOption, ItemCreateRequest } from "../../../types";
import { useLocation } from "react-router";
import { DrugCategory } from "../../../enums/DrugCategory";
import { DrugForm } from "../../../enums/DrugForm";

interface CreateItemState {
    isLoading: boolean;
    item: ItemCreateRequest;
};

const initialState: CreateItemState = {
    isLoading: false,
    item: {
        stockId: -1,
        caption: "",
        description: "",
        category: DrugCategory.OTHER,
        form: DrugForm.OTHER,
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
            return { ...state, item: { stockId: action.payload.stockId, caption: action.payload.caption, description: action.payload.description, category: action.payload.category, form: action.payload.form, initialQty: action.payload.initialQty, currentQty: action.payload.currentQty, unitPurchasePrice: action.payload.unitPurchasePrice, unitSellingPrice: action.payload.unitSellingPrice } };
        case ActionType.SET_LOADING:
            return {...state, isLoading: action.payload};
        default: 
            return state;
    }
};

const drugCategoryOptions: DrugCategoryOption[] = Object.values(DrugCategory).map(v => { return { id: v, label: v } });
const drugFormOptions: DrugFormOption[] = Object.values(DrugForm).map(v => { return { id: v, label: v } });

function CreateItem() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    console.log(location.state);

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        if(location.state && location.state.item){
            dispatch({ type: ActionType.SET_ALL_FIELDS, payload: location.state.item });
            return;
        }

        if(location.state && location.state.stock){
            dispatch({ type: ActionType.SET_FIELD, payload: { name: "stockId", value: location.state.stock.id } });
            return
        }
    }, []);

    console.log(location.state);

    useEffect(() => {
        console.log(state);
    }, [state]);

    const handleSubmit = useCallback(async () => {
        try{
            if(!isValid(state, ["loading"])){
                alert.setWarning("Please enter the required information to continue");
                return;
            }

            if(location.state && location.state.item){
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
            const res = await api.post<ItemCreateRequest, BasicResultSet>("/pharmacy-stock-management/items/create", state.item);
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

        if(!location.state.item) return;

        try{
            const res = await api.put<ItemCreateRequest, BasicResultSet>("/pharmacy-stock-management/items/update", {
                itemId: `${location.state.item.id}`,
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

    const handleCategoryChange = useCallback((event: SyntheticEvent<Element, Event>, value: DrugCategoryOption | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<DrugCategoryOption> | undefined): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "form", value: details?.option.label } });
    }, []);

    const handleFormChange = useCallback((event: SyntheticEvent<Element, Event>, value: DrugCategoryOption | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<DrugCategoryOption> | undefined): void => {
        dispatch({ type: ActionType.SET_FIELD, payload: { name: "form", value: details?.option.label } });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Pharmacy Stock Management"
                title={location.state && location.state.item ? "Update Item" : "Create Item"}
                backButton={true}
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
                            <Autocomplete
                                // disablePortal
                                options={drugCategoryOptions}
                                renderInput={(params) => <TextField {...params} name="category" label="Category" />}
                                onChange={handleCategoryChange}
                            />
                            <Autocomplete
                                // disablePortal
                                options={drugFormOptions}
                                renderInput={(params) => <TextField {...params} name="form" label="Form" />}
                                onChange={handleFormChange}
                            />
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