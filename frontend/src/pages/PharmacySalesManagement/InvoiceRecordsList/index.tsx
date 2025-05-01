import { ReplayOutlined, Delete } from "@mui/icons-material";
import { Card, Container, Stack, Tooltip, IconButton, Toolbar, alpha, Typography } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { InvoiceDto, InvoiceRecordDto, PageResponse } from "../../../types";
import { useAlert } from "../../../hooks/useAlert";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useLocation } from "react-router";

interface InvoiceRecordsState {
    loading: boolean;
    invoice: InvoiceDto | undefined;
    list: InvoiceRecordDto[];
    selectedIds: Set<GridRowId>
    page: number;
    pageSize: number;
    totalElements: number | undefined;
};

enum ActionType {
    SET_LIST,
    START_LOADING,
    STOP_LOADING,
    SET_PAGE,
    SET_PAGE_SIZE,
    SET_PAGINATION_MODEL,
    SET_SELECTED_IDS,
    SET_INVOICE,
};

const initialState: InvoiceRecordsState = {
    loading: false,
    invoice: undefined,
    list: [],
    selectedIds: new Set<GridRowId>(),
    page: 0,
    pageSize: 5,
    totalElements: 0
};

const reducer = (state: InvoiceRecordsState, action: { type: ActionType, payload: any }): InvoiceRecordsState => {
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
        default:
            return state;
    };
};

const columns: GridColDef[] = [
    { field: "id", headerName: "#" },
    { field: "itemCaption", headerName: "Item" },
    { field: "itemSellingPrice", headerName: "Selling Price" },
    { field: "quantity", headerName: "Quantity" },
    { field: "total", headerName: "Total" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" }
];

const paginationModel = { page: 0, pageSize: 5 };

function InvoiceRecordsList() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const {inv} = location.state;

    const api = useApi();
    const alert = useAlert();

    interface TableToolbarProps {
        numSelected?: number;
    };

    useEffect(() => {
        const { inv } = location.state;
        dispatch({ type: ActionType.SET_INVOICE, payload: inv });
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [state.invoice]);

    const fetchRecords = useCallback(async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try {
            const res = await api.get<PageResponse<InvoiceDto>>("/invoice-records/page", {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`,
                invoiceId: inv.id,
            });
            if (res)
                dispatch({ type: ActionType.SET_LIST, payload: res });
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "An unknown error occurred");
            dispatch({ type: ActionType.STOP_LOADING, payload: null });
        }
    }, [state.page, state.pageSize]);

    const handleReloadClick = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        fetchRecords();
    }, []);

    const onPaginationModelChange = useCallback((model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void => {
        dispatch({ type: ActionType.SET_PAGINATION_MODEL, payload: { page: model.page, pageSize: model.pageSize } });
        fetchRecords();
    }, [state.page, state.pageSize]);

    const handleSelectRow = useCallback((rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails<any>): void => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(rowSelectionModel) });
    }, [state.selectedIds]);

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
            </Toolbar>
        );
    };

    return (
        <>
            <PageTitle
                subTitle={"Pharmacy Sales Management"}
                title={"Invoice Records List"}
                backButton={true}
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
                            <Tooltip title="Reload">
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    <TableToolbar numSelected={state.selectedIds?.size} />
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

export default InvoiceRecordsList;