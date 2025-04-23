import { alpha, Button, Card, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { Add, Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { ItemDto, User } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { PageResponse } from "../../../types";
import { useLocation, useNavigate } from "react-router";

const columns: GridColDef[] = [
    { field: "itemCode", headerName: "Item Code", width: 170 },
    { field: "caption", headerName: "Caption", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "initialQty", headerName: "Initial Qty.", width: 70 },
    { field: "currentQty", headerName: "current Qty.", width: 70 },
    { field: "unitPurchasePrice", headerName: "Unit Pur. Price", width: 100 },
    { field: "unitSellingPrice", headerName: "Unit Sel. Price", width: 100 },
    { field: "updateAt", headerName: "Updated At", width: 100 },
];

interface ItemListState {
    selectedIds: Set<GridRowId>,
    list: ItemDto[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
};

enum ActionType {
    SET_SELECTED_IDS,
    ADD_TO_SELECTED_IDS,
    REMOVE_FROM_SELECTED_IDS,
    CLEAR_SELECTED_IDS,
    SET_LIST,
    DELETE_SELECTED_ITEMS,
    SET_PAGE,
    SET_PAGE_SIZE,
    SET_TOTAL_PAGES,
    SET_PAGINATION_INFO,
    SET_PAGINATION_MODEL,
    SET_LOADING,
};

const initialState: ItemListState = {
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    loading: false,
};

const reducer = (state: ItemListState, action: { type: ActionType, payload: any }): ItemListState => {
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
        case ActionType.DELETE_SELECTED_ITEMS:
            return { ...state, list: state.list.filter((item) => !state.selectedIds.has(item.id)) };
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
        case ActionType.SET_LOADING:
            if (state.loading === action.payload)
                return { ...state };
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const paginationModel = { page: 0, pageSize: 5 };

function ItemList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const navigate = useNavigate();
    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        fetchItems();
    }, [state.page, state.pageSize]);

    const fetchItems = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try {
            const res = await api.get<PageResponse<User>>("/pharmacy-stock-management/items/page", {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`,
                stockId: `${location.state.id}`
            });
            if (res) {
                console.log(res.content);
                dispatch({
                    type: ActionType.SET_PAGINATION_INFO, payload: res
                });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.page, state.pageSize]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }, [state.selectedIds]);

    const handleReloadClick = useCallback(() => {
        fetchItems();
    }, []);

    const handleCreateItem = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        navigate("/pharmacy-stock-management/create-item", { state: { stock: location.state } })
    }, []);

    function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void {
        dispatch({
            type: ActionType.SET_PAGINATION_MODEL, payload: model
        });
    }

    const handleDelete = useCallback(async () => {
        try {
            const res = await api.delete<any, BasicResultSet>("/pharmacy-stock-management/items/deleteBatch", {
                stockId: `${location.state.id}`
            }, Array.from(state.selectedIds));
            if (res) {
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_ITEMS, payload: state.selectedIds });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.selectedIds, state.list]);

    const handleEdit = useCallback(() => {
        const item = state.list.find((item) => state.selectedIds.has(item.id));
        navigate("/pharmacy-stock-management/create-item", { state: { item: item } });
    }, [state.list, state.selectedIds]);

    interface TableToolbarProps {
        numSelected?: number;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
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
                    <Tooltip title="Edit">
                        <IconButton onClick={props.onEdit}>
                            <Edit color="primary" />
                        </IconButton>
                    </Tooltip>
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
                title={"Items List"}
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
                            <Tooltip title="Create new item">
                                <Button variant="contained" startIcon={<Add />} onClick={handleCreateItem}>Create</Button>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    <TableToolbar numSelected={state.selectedIds?.size} onDelete={handleDelete} onEdit={handleEdit} />
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

export default ItemList;