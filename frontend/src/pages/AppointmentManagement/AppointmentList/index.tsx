import { Delete, Edit, Print, ReplayOutlined } from "@mui/icons-material";
import { Card, Container, Stack, Box, Tooltip, IconButton, Toolbar, alpha, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { AppointmentDto } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import Filter, { FilterOption } from "../../../components/Filter";
import { SearchBy } from "../../../enums/SearchBy";

const columns: GridColDef[] = [
    { field: "referenceId", headerName: "Ref.ID", width: 70 },
    { field: "patientName", headerName: "Patient", width: 130 },
    { field: "queuePosition", headerName: "Queue.Pos", width: 70 },
    { field: "clinicName", headerName: "Clinic", width: 130 },
    { field: "doctorName", headerName: "Doctor", width: 130 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
];

const filterOptions: FilterOption[] = [
    { label: "Reference ID", value: SearchBy.REF_ID },
    { label: "Clinic", value: SearchBy.CLINIC },
    { label: "Doctor", value: SearchBy.DOCTOR },
    { label: "Patient Name", value: SearchBy.PATIENT_NAME },
    { label: "Patient Telephone", value: SearchBy.PATIENT_TELEPHONE },
    { label: "Patient Reference ID", value: SearchBy.PATIENT_TELEPHONE },
    { label: "Date", value: SearchBy.DATE }
];

interface AppointmentListState {
    isLoading: boolean;
    list: AppointmentDto[];
    selectedIds: Set<GridRowId>;
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    searchKey: string;
    searchBy: SearchBy;
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
    SET_SEARCH_KEY,
    SET_LOADING,
};

const initialState: AppointmentListState = {
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    searchKey: "",
    searchBy: SearchBy.REF_ID,
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
        case ActionType.SET_SEARCH_KEY:
            return { ...state, searchKey: action.payload.searchKey, searchBy: action.payload.searchBy };
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
    }, [state.page, state.pageSize, state.searchKey]);

    function handleReloadClick(): void {
        fetchAppointments();
    }

    function onPaginationModelChange(model: GridPaginationModel): void {
        dispatch({ type: ActionType.SET_PAGINATION_MODEL, payload: model });
    }

    function handleSelectRow(ids: GridRowSelectionModel): void {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }

    function handleDelete(): void {
        deleteAppointment();
    }

    function handleEdit(): void {
        throw new Error("Function not implemented.");
    }

    async function fetchAppointments() {
        try {
            const endpoint = state.searchKey.length < 1 ? "/appointment-management/page" : "/appointment-management" + SearchBy.getEndpoint(state.searchBy);
            const options: Record<string, string> = state.searchKey.length < 1 ? {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`
            } : {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`,
                searchKey: state.searchKey
            };

            const res = await api.get<AppointmentDto>(endpoint, options);

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

    async function printAppointment() {
        try{
            const appointment = state.list.filter(ap => state.selectedIds.has(ap.id))[0];
            
            const res = await window.InvoiceGenerator.generateAppointmentPdf(JSON.stringify(appointment));

            if(!res) return;

            console.log(res);
            alert.setSuccess("Print successfull");
        }catch(err) {
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }

    interface TableToolbarProps {
        numSelected?: number;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onEdit: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onPrint: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
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
                    <>
                        <Tooltip title="Edit">
                            <IconButton onClick={props.onEdit}>
                                <Edit color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton onClick={props.onPrint}>
                                <Print color="primary" />
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

    const handleFilterSubmit = useCallback((option: FilterOption, searchKey: string): void | Promise<void> => {
        dispatch({ type: ActionType.SET_SEARCH_KEY, payload: { searchKey: searchKey, searchBy: option.value } });
    }, []);

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
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end", textAlign: "start", alignItems: "center" }}>
                        <Box
                            sx={{ pb: 2 }}
                        >
                            <Filter 
                                options={filterOptions}
                                onSubmit={handleFilterSubmit}
                            />
                        </Box>
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
                    <TableToolbar numSelected={state.selectedIds?.size} onDelete={handleDelete} onEdit={handleEdit} onPrint={printAppointment} />
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