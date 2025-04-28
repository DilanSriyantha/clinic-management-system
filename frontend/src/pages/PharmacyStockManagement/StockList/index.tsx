import { alpha, Card, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { Add, Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { DataGrid, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { StockDto, User } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { PageResponse } from "../../../types";
import { useNavigate } from "react-router";
import Filter, { FilterOption } from "../../../components/Filter";
import { SearchBy } from "../../../enums/SearchBy";

const columns: GridColDef[] = [
    {
        field: "number",
        headerName: "Stock Code",
        width: 150,
        valueGetter: (_val, row, _col, api) => `Stock ${api.current.getRowId(row)}`
    },
    { field: "caption", headerName: "Caption", width: 130 },
    { field: "vendor", headerName: "Vendor", width: 130 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
];

const filterOptions: FilterOption[] = [
    { value: SearchBy.CAPTION, label: "Caption" },
    { value: SearchBy.VENDOR, label: "Vendor" },
    { value: SearchBy.DATE, label: "Date" }
];

interface StockListState {
    selectedIds: Set<GridRowId>,
    list: StockDto[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    searchKey: string,
    searchBy: SearchBy,
    loading: boolean;
};

enum ActionType {
    SET_SELECTED_IDS,
    ADD_TO_SELECTED_IDS,
    REMOVE_FROM_SELECTED_IDS,
    CLEAR_SELECTED_IDS,
    SET_LIST,
    DELETE_SELECTED_StockS,
    SET_PAGE,
    SET_PAGE_SIZE,
    SET_TOTAL_PAGES,
    SET_PAGINATION_INFO,
    SET_PAGINATION_MODEL,
    SET_SEARCH_KEY,
    SET_LOADING,
};

const initialState: StockListState = {
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    searchKey: "",
    searchBy: SearchBy.CAPTION,
    loading: false,
};

const reducer = (state: StockListState, action: { type: ActionType, payload: any }): StockListState => {
    switch (action.type) {
        case ActionType.SET_SELECTED_IDS:
            return { ...state, selectedIds: action.payload };
        case ActionType.ADD_TO_SELECTED_IDS:
            return { ...state, selectedIds: new Set<GridRowId>(state.selectedIds).add(action.payload) };
        case ActionType.REMOVE_FROM_SELECTED_IDS:
            const newSet = new Set<GridRowId>(state.selectedIds);
            newSet.delete(action.payload);
            return { ...state, selectedIds: newSet };
        case ActionType.SET_LIST:
            return { ...state, list: action.payload };
        case ActionType.DELETE_SELECTED_StockS:
            return { ...state, list: state.list.filter((Stock) => !state.selectedIds.has(Stock.id)) };
        case ActionType.SET_PAGE:
            return { ...state, page: action.payload };
        case ActionType.SET_PAGE_SIZE:
            return { ...state, pageSize: action.payload };
        case ActionType.SET_TOTAL_PAGES:
            return { ...state, totalPages: action.payload };
        case ActionType.SET_PAGINATION_INFO:
            return { ...state, list: action.payload.content, page: action.payload.pageable.pageNumber, pageSize: action.payload.pageable.pageSize, totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, loading: false };
        case ActionType.SET_PAGINATION_MODEL:
            return { ...state, page: action.payload.page, pageSize: action.payload.pageSize, loading: true };
        case ActionType.SET_SEARCH_KEY:
            return { ...state, searchKey: action.payload.searchKey, searchBy: action.payload.searchBy };
        case ActionType.SET_LOADING:
            if (state.loading === action.payload)
                return { ...state };
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const paginationModel = { page: 0, pageSize: 5 };

function StockList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();
    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        fetchUsers();
    }, [state.page, state.pageSize, state.searchKey]);

    const fetchUsers = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try {
            const endpoint = state.searchKey.length < 1 ? "/pharmacy-stock-management/stocks/page" : "/pharmacy-stock-management/stocks" + SearchBy.getEndpoint(state.searchBy);

            const options: Record<string, string> = state.searchKey.length < 1 ? {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`
            } : {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`,
                searchKey: state.searchKey
            };

            const res = await api.get<PageResponse<User>>(endpoint, options);
            if (res) {
                console.log(res.content);
                dispatch({
                    type: ActionType.SET_PAGINATION_INFO, payload: res
                });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.page, state.pageSize, state.searchKey]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }, [state.selectedIds]);

    const handleReloadClick = useCallback(() => {
        fetchUsers();
    }, []);

    function onPaginationModelChange(model: GridPaginationModel): void {
        dispatch({
            type: ActionType.SET_PAGINATION_MODEL, payload: model
        });
    }

    const handleDelete = useCallback(async () => {
        try {
            const res = await api.delete<any, BasicResultSet>("/pharmacy-stock-management/stocks/deleteBatch", undefined, Array.from(state.selectedIds));
            if (res) {
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_StockS, payload: state.selectedIds });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.selectedIds, state.list]);

    const handleAddItems = useCallback(() => {
        const stock = state.list.find((stock) => state.selectedIds.has(stock.id));
        navigate("/pharmacy-stock-management/list-items", { state: stock });
    }, [state.list, state.selectedIds]);

    const handleEdit = useCallback(() => {
        const stock = state.list.find((stock) => state.selectedIds.has(stock.id));
        navigate("/pharmacy-stock-management/create-stock", { state: stock });
    }, [state.list, state.selectedIds]);

    const handleFilterSubmit = useCallback((option: FilterOption, searchKey: string): void | Promise<void> => {
        dispatch({ type: ActionType.SET_SEARCH_KEY, payload: { searchKey: searchKey, searchBy: option.value } });
    }, []);

    interface TableToolbarProps {
        numSelected?: number;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onAddItems: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onEdit: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    }

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
                {props.numSelected == 1 && (
                    <>
                        <Tooltip title="Add Items">
                            <IconButton onClick={props.onAddItems}>
                                <Add color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton onClick={props.onEdit}>
                                <Edit color="primary" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
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
                subTitle={"Pharmacy Stock Management"}
                title={"Stocks List"}
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end", textAlign: "start", justifyItems: "center" }}>
                        <Stack
                            sx={{ pb: 2 }}
                            direction={"row"}
                            alignItems={"center"}
                            gap={1}
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
                    <TableToolbar numSelected={state.selectedIds?.size} onDelete={handleDelete} onAddItems={handleAddItems} onEdit={handleEdit} />
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

export default StockList;