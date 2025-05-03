import { ReplayOutlined, Delete, ListAlt } from "@mui/icons-material";
import { Card, Container, Stack, Tooltip, IconButton, Toolbar, alpha, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { InvoiceDto, PageResponse } from "../../../types";
import { useAlert } from "../../../hooks/useAlert";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useNavigate } from "react-router";
import { SearchBy } from "../../../enums/SearchBy";
import Filter, { FilterOption } from "../../../components/Filter";

interface InvoiceListState {
    loading: boolean;
    list: InvoiceDto[];
    selectedIds: Set<GridRowId>
    page: number;
    pageSize: number;
    totalElements: number | undefined;
    searchKey: string;
    searchBy: SearchBy;
};

enum ActionType {
    SET_LIST,
    START_LOADING,
    STOP_LOADING,
    SET_PAGE,
    SET_PAGE_SIZE,
    SET_PAGINATION_MODEL,
    SET_SELECTED_IDS,
    SET_SEARCH_KEY
};

const initialState: InvoiceListState = {
    loading: false,
    list: [],
    selectedIds: new Set<GridRowId>(),
    page: 0,
    pageSize: 5,
    totalElements: 0,
    searchKey: "",
    searchBy: SearchBy.NUMBER
};

const reducer = (state: InvoiceListState, action: { type: ActionType, payload: any }): InvoiceListState => {
    switch (action.type) {
        case ActionType.SET_LIST:
            return { ...state, list: action.payload.content, totalElements: action.payload.totalElements, loading: false };
        case ActionType.SET_PAGINATION_MODEL:
            return { ...state, page: action.payload.page, pageSize: action.payload.pageSize, totalElements: action.payload.totalElements };
        case ActionType.START_LOADING:
            return { ...state, loading: true };
        case ActionType.STOP_LOADING:
            return { ...state, loading: false };
        case ActionType.SET_SELECTED_IDS:
            return { ...state, selectedIds: action.payload };
        case ActionType.SET_SEARCH_KEY:
            return { ...state, searchKey: action.payload.searchKey, searchBy: action.payload.searchBy };
        default:
            return state;
    };
};

const columns: GridColDef[] = [
    { field: "number", headerName: "Inv.#" },
    { field: "subtotal", headerName: "Sub Total" },
    { field: "pharmacistName", headerName: "Pharmacist" },
    { field: "patientName", headerName: "Patient" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" }
];

const filterOptions: FilterOption[] = [
    { value: SearchBy.NUMBER, label: "Invoice Number" },
    { value: SearchBy.DATE, label: "Date" },
    { value: SearchBy.CREATOR_NAME, label: "Creator" }
];

const paginationModel = { page: 0, pageSize: 5 };

function InvoiceList() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();
    const navigate = useNavigate();

    interface TableToolbarProps {
        numSelected?: number;
        onSelected: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    }

    useEffect(() => {
        fetchInvoices();
    }, [state.page, state.pageSize, state.searchKey]);

    const fetchInvoices = useCallback(async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });

        const endpoint = state.searchKey.length < 1 ? "/invoice/page" : "/invoice" + SearchBy.getEndpoint(state.searchBy);

        const options: Record<string, string> = state.searchKey.length < 1 ? {
            page: `${state.page}`,
            pageSize: `${state.pageSize}`
        } : {
            page: `${state.page}`,
            pageSize: `${state.pageSize}`,
            searchKey: state.searchKey
        };  

        try {
            const res = await api.get<PageResponse<InvoiceDto>>(endpoint, options);
            if (res)
                dispatch({ type: ActionType.SET_LIST, payload: res });
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "An unknown error occurred");
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
        }
    }, [state.page, state.pageSize, state.searchKey]);

    const deleteInvoice = useCallback(async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try {
            const res = await api.delete<Set<GridRowId>, BasicResultSet>("/invoice/deleteBatch", undefined, state.selectedIds);
            if (res) {
                dispatch({ type: ActionType.STOP_LOADING, payload: null });
                alert.setError(res.message);
            }
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "An unknown error occurred");
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
        }
    }, [state.selectedIds]);

    const handleReloadClick = useCallback((): void => {
        fetchInvoices();
    }, []);

    const handleDelete = useCallback((): void => {
        deleteInvoice();
    }, []);

    const handleSelected = useCallback((): void => {
        const invoice = state.list.find(inv => state.selectedIds.has(inv.id));
        if (!invoice) {
            alert.setError("Invoice could not be resolved.");
            return;
        }
        navigate("/pharmacy-sales-management/list/invoice-records", { state: { inv: invoice } });
    }, [state.selectedIds, state.list]);

    const onPaginationModelChange = useCallback((model: GridPaginationModel): void => {
        dispatch({ type: ActionType.SET_PAGINATION_MODEL, payload: { page: model.page, pageSize: model.pageSize } });
        fetchInvoices();
    }, [state.page, state.pageSize]);

    const handleSelectRow = useCallback((rowSelectionModel: GridRowSelectionModel): void => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(rowSelectionModel) });
    }, [state.selectedIds]);

    const handleFilterSubmit = useCallback((option: FilterOption, searchKey: string): void | Promise<void> => {
        dispatch({ type: ActionType.SET_SEARCH_KEY, payload: { searchKey: searchKey, searchBy: option.value } });
    }, []);

    function TableToolbar(props: TableToolbarProps) {
        if (!props.numSelected)
            return null;

        return (
            <Toolbar
                sx={[
                    {
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                    },
                    props.numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    },
                ]}
            >
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {props.numSelected} {props.numSelected > 1 ? "rows" : "row"} selected
                </Typography>
                {!(props.numSelected < 1) && (
                    <Tooltip title="View records">
                        <IconButton onClick={props.onSelected}>
                            <ListAlt color="primary" />
                        </IconButton>
                    </Tooltip>)}
                <Tooltip title="Delete">
                    <IconButton onClick={props.onDelete}>
                        <Delete color="error" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        );
    };

    return (
        <>
            <PageTitle
                subTitle={"Pharmacy Sales Management"}
                title={"Invoices List"}
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end", textAlign: "start" }}>
                        <Stack
                            direction={"row"}
                            gap={1}
                            sx={{ pb: 2 }}
                        >
                            <Filter
                                options={filterOptions}
                                onSubmit={handleFilterSubmit}
                            />
                            <Tooltip title="Reload">
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    <TableToolbar numSelected={state.selectedIds?.size} onSelected={handleSelected} onDelete={handleDelete} />
                    <DataGrid
                        rows={state.list}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        paginationModel={{ page: state.page, pageSize: state.pageSize }}
                        onPaginationModelChange={onPaginationModelChange}
                        paginationMode="server"
                        rowCount={state.totalElements}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                        onRowSelectionModelChange={handleSelectRow}
                        loading={state.loading}
                    />
                </Container>
            </Card>
        </>
    );
}

export default InvoiceList;