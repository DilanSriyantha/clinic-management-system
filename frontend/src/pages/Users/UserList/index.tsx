import { alpha, Box, Card, Chip, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { Check, Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "../../../types/User";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { PageResponse } from "../../../types/PageResponse";
import { Role } from "../../../enums/Role";
import { useLocation, useNavigate } from "react-router";
import { RoleItem } from "../../../types/RoleItem";
import { UsersListState } from "../../../types/UsersListState";

const recep_columns: GridColDef[] = [
    { field: "referenceId", headerName: "Ref.ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "birthday", headerName: "Birthday", width: 70 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "telephone", headerName: "Telephone", width: 100 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
    { field: "status", headerName: "Status", width: 70 },
];

const doc_columns: GridColDef[] = [
    { field: "referenceId", headerName: "Ref.ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "birthday", headerName: "Birthday", width: 70 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "telephone", headerName: "Telephone", width: 100 },
    { field: "specialization", headerName: "Specialization", width: 100 },
    { field: "percentage", headerName: "Percentage(%)", type: "number", width: 70 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
    { field: "status", headerName: "Status", width: 70 },
];

const roles: RoleItem[] = [
    { value: Role.ADMIN, label: Role[0] },
    { value: Role.DOCTOR, label: Role[1] },
    { value: Role.RECEPTIONIST, label: Role[2] },
    { value: Role.PHARMACIST, label: Role[3] }
];

const initialState: UsersListState = {
    role: Role.DOCTOR,
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 0,
    loading: false,
};

enum ActionType {
    SET_ROLE,
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

const reducer = (state: UsersListState, action: { type: ActionType, payload: any }): UsersListState => {
    switch(action.type){
        case ActionType.SET_ROLE:
            return { ...state, role: action.payload };
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
            return { ...state, list: action.payload.list, page: action.payload.page, pageSize: action.payload.pageSize, totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, loading: false };
        case ActionType.SET_PAGINATION_MODEL:
            return { ...state, page: action.payload.page, pageSize: action.payload.pageSize, loading: true };
        case ActionType.SET_LOADING: 
            if(state.loading === action.payload)
                return { ...state };
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const paginationModel = { page: 0, pageSize: 5 };

function UsersList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();
    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        console.log(state.selectedIds);
    }, [state.selectedIds]);
    
    useEffect(() => {
        fetchUsers();
    }, [state.role, state.page, state.pageSize]);

    const fetchUsers = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try{
            const res = await api.get<PageResponse<User>>("/users/page", {
                role: Role[state.role],
                page: `${state.page}`,
                pageSize: `${state.pageSize}`
            });
            if(res){
                dispatch({ type: ActionType.SET_PAGINATION_INFO, payload: {
                    list: res.content,
                    page: res.number,
                    pageSize: res.size,
                    totalPages: res.totalPages,
                    totalElements: res.totalElements
                } });
            }
        }catch(err){
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.page, state.pageSize, state.role]);

    const handleRoleChange = useCallback((item: RoleItem) => {
        if (state.role === item.value)
            return;

        dispatch({ type: ActionType.SET_ROLE, payload: item.value });
    }, [state.role]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }, [state.selectedIds]);

    const handleReloadClick = useCallback(() => {
        fetchUsers();
    }, [state.role]);

    function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void {
        dispatch({ type: ActionType.SET_PAGINATION_INFO, payload: {
            page: model.page,
            pageSize: model.pageSize
        } });
    }

    const handleDelete = useCallback(async() => {
        try{
            const res = await api.delete<Array<GridRowId>, BasicResultSet>("/users/delete", Array.from(state.selectedIds));
            if(res){
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_ITEMS, payload: state.selectedIds });
            }
        }catch(err){
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.selectedIds, state.list]);

    const handleEdit = useCallback(() => {
        const user = state.list.find((user) => state.selectedIds.has(user.id));
        navigate("update", { state: { user } });
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
                subTitle="Users"
                title="Users List"
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "start" }}>
                        <Stack direction="row" flexWrap="wrap" pb={2} gap={1}>
                            {
                                roles.map((item) => {
                                    const checked = state.role === item.value;
                                    return (
                                        <Chip
                                            key={item.value}
                                            variant={checked ? "filled" : "outlined"}
                                            color={checked ? "primary" : "default"}
                                            label={item.label}
                                            onClick={() => handleRoleChange(item)}
                                            icon={checked ? <Check fontSize="small" /> : <div></div>}
                                        />
                                    );
                                })
                            }
                        </Stack>
                        <Box 
                            sx={{ pb: 2 }}
                        >
                            <Tooltip title="Reload">
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                    <TableToolbar numSelected={state.selectedIds?.size} onDelete={handleDelete} onEdit={handleEdit} />
                    <DataGrid
                        rows={state.list}
                        columns={state.role === Role.DOCTOR ? doc_columns : recep_columns}
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

export default UsersList;