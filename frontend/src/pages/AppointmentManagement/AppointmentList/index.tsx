import { Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { Card, Container, Stack, Box, Tooltip, IconButton, Toolbar, alpha, Typography } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import PageTitle from "../../../components/PageTitle";
import { For } from "../../../enums/For";
import { act, MouseEvent, useEffect, useReducer } from "react";
import { AppointmentDto } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";

const columns: GridColDef[] = [
    { field: "referenceId", headerName: "Ref.ID", width: 70 },
    { field: "patientName", headerName: "Patient", width: 130 },
    { field: "queuePosition", headerName: "Queue.Pos", width: 70 },
    { field: "clinicName", headerName: "Clinic", width: 130 },
    { field: "doctorName", headerName: "Doctor", width: 130 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
];

interface AppointmentListState {
    isLoading: boolean;
    list: AppointmentDto[];
    selectedIds: Set<GridRowId>;
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
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

const initialState: AppointmentListState = {
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    isLoading: false,
};

const paginationModel = { page: 0, pageSize: 5 };

const reducer = (state: AppointmentListState, action: { type: ActionType, payload: any }): AppointmentListState => {
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
            return { ...state, list: action.payload.content, page: action.payload.pageable.pageNumber, pageSize: action.payload.pageable.pageSize, totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, isLoading: false };
        case ActionType.SET_PAGINATION_MODEL:
            return { ...state, page: action.payload.page, pageSize: action.payload.pageSize, isLoading: true };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

function AppointmentList() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        fetchAppointments();
    }, [state.page, state.pageSize]);

    function handleReloadClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        fetchAppointments();
    }

    function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void {
        dispatch({ type: ActionType.SET_PAGINATION_MODEL, payload: model });
    }

    function handleSelectRow(ids: GridRowSelectionModel, details: GridCallbackDetails<any>): void {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }

    function handleDelete(event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined): void {
        deleteAppointment();
    }

    function handleEdit(event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined): void {
        throw new Error("Function not implemented.");
    }

    async function fetchAppointments() {
        try {
            const res = await api.get<AppointmentDto>("/appointment-management/page", {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`
            });

            if (res) {
                console.log(res);
                dispatch({ type: ActionType.SET_PAGINATION_INFO, payload: res });
            }
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    async function deleteAppointment() {
        try {
            const res = await api.delete<any, BasicResultSet>("/appointment-management/deleteBatch", undefined, Array.from(state.selectedIds));
            if (res) {
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_ITEMS, payload: state.selectedIds });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }

    interface TableToolbarProps {
        numSelected?: number;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onEdit: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    };

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
                subTitle={"Appointment Management"}
                title={"Appointments List"}
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end", textAlign: "start" }}>
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
                        loading={state.isLoading}
                    />
                </Container>
            </Card>
        </>
    );
}

export default AppointmentList;