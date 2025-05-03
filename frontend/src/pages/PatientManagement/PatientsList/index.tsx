import { alpha, Button, Card, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { Add, Check, Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { DataGrid, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { AssignPatientsDto, Patient, User } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { PageResponse } from "../../../types";
import { useLocation, useNavigate } from "react-router";
import { For } from "../../../enums/For";
import Filter, { FilterOption } from "../../../components/Filter";
import { SearchBy } from "../../../enums/SearchBy";

const columns: GridColDef[] = [
    { field: "referenceId", headerName: "Ref.ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "age", headerName: "Age", width: 70 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "telephone", headerName: "Telephone", width: 100 },
    { field: "allergiesNote", headerName: "AllergiesNote", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
];

const filterOptions: FilterOption[] = [
    { value: SearchBy.EMAIL, label: "E-mail" },
    { value: SearchBy.NAME, label: "Name" },
    { value: SearchBy.REF_ID, label: "Ref.ID" },
    { value: SearchBy.TELEPHONE, label: "Telephone" }
];

interface PatientListState {
    selectedIds: Set<GridRowId>,
    list: Patient[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    searchKey: string;
    searchBy: SearchBy;
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
    SET_SEARCH_KEY,
    SET_LOADING,
};

const initialState: PatientListState = {
    selectedIds: new Set<GridRowId>(),
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    searchKey: "",
    searchBy: SearchBy.EMAIL,
    loading: false,  
};

const reducer = (state: PatientListState, action: { type: ActionType, payload: any }): PatientListState => {
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
            return { ...state, list: action.payload.list, page: action.payload.page, pageSize: action.payload.pageSize, totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, loading: false };
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

function PatientsList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const location = useLocation();

    const navigate = useNavigate();
    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        console.log(state.searchKey);
        fetchUsers();
    }, [state.page, state.pageSize, state.searchKey]);

    const fetchUsers = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try {
            const endpoint = state.searchKey.length < 1 ? "/patient-management/page" : "/patient-management" + SearchBy.getEndpoint(state.searchBy);
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
                    type: ActionType.SET_PAGINATION_INFO, payload: {
                        list: res.content,
                        page: res.number,
                        pageSize: res.size,
                        totalPages: res.totalPages,
                        totalElements: res.totalElements
                    }
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

    const handleAddClick = useCallback(() => {
        navigate("/patient-management/create", { state: { ...location.state } });
    }, []);

    function onPaginationModelChange(model: GridPaginationModel): void {
        dispatch({
            type: ActionType.SET_PAGINATION_INFO, payload: {
                page: model.page,
                pageSize: model.pageSize
            }
        });
    }

    const handleDelete = useCallback(async () => {
        try {
            const res = await api.delete<any, BasicResultSet>("/patient-management/deleteBatch", undefined, Array.from(state.selectedIds));
            if (res) {
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_ITEMS, payload: state.selectedIds });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.selectedIds, state.list]);

    const handleEdit = useCallback(() => {
        const patient = state.list.find((patient) => state.selectedIds.has(patient.id));
        navigate("/patient-management/create", { state: patient });
    }, [state.list, state.selectedIds]);

    const handleAssign = useCallback(async (): Promise<void> => {
        const doctorId: GridRowId | undefined = state.selectedIds.values().next().value;

        if (!doctorId) return;

        try {
            const res = await api.post<AssignPatientsDto, BasicResultSet>("/clinic-management/assignPatients", {
                clinicId: location.state.clinicId,
                patientIds: Array.from(state.selectedIds),
            });
            if (res) {
                console.log(res);
                alert.setSuccess("Patient assigned to the clinic successfully");
                navigate(-1);
            }
        } catch (err) {
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state.list, state.selectedIds]);

    const handleSelectPatient = useCallback((): void => {
        console.log(location.state);
        if(location.state && location.state.for && location.state.for === For.SELECTING_PATIENT){
            navigate("/prescription-management/create", { state: { patient: state.list.filter(p => state.selectedIds.has(p.id as GridRowId))[0] } });
            return;
        }

        if(location.state && location.state.for && location.state.for === For.SELECTING_PATIENT_FOR_APPOINTMENT) {
            navigate("/appointment-management/create", { state: { ...location.state, patient: state.list.filter(p => state.selectedIds.has(p.id as GridRowId))[0] } });
            return;
        }

        if(location.state && location.state.for && location.state.for === For.SELECTING_PATIENT_FOR_INVOICE) {
            navigate("/pharmacy-sales-management/create", { state: { ...location.state, patient: state.list.filter(p => state.selectedIds.has(p.id as GridRowId))[0] } });
            return;
        }
    }, [state.list, state.selectedIds]);

    const handleFilterSubmit = useCallback((option: FilterOption, searchKey: string): void | Promise<void> => {
        dispatch({ type: ActionType.SET_SEARCH_KEY, payload: { searchKey: searchKey, searchBy: option.value } });
    }, []);

    interface TableToolbarProps {
        numSelected?: number;
        onDelete: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onEdit: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onAssign: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
        onSelect: (event?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
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
                {location.state && location.state.for === For.ASSIGN_PATIENTS_TO_CLINIC
                    ?
                    <Tooltip title="Assign">
                        <Button variant="contained" startIcon={<Add />} onClick={props.onAssign}>Assign</Button>
                    </Tooltip>
                    :
                    (location.state && location.state.for === For.SELECTING_PATIENT) || (location.state && location.state.for && For.SELECTING_PATIENT_FOR_APPOINTMENT || (location.state && location.state.for && location.state.for == For.SELECTING_PATIENT_FOR_INVOICE))
                    ?
                    <Tooltip title="Assign">
                        <Button variant="contained" startIcon={<Check />} onClick={props.onSelect}>Select</Button>
                    </Tooltip>
                    :
                    <>
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
                    </>
                }
            </Toolbar>
        );
    };

    return (
        <>
            <PageTitle
                subTitle={
                    (location.state && location.state.for === For.ASSIGN_PATIENTS_TO_CLINIC) 
                    ? "Assign a Patient" 
                    : (
                        location.state && (
                            location.state.for === For.SELECTING_PATIENT || 
                            location.state.for === For.SELECTING_PATIENT_FOR_APPOINTMENT ||
                            location.state.for === For.SELECTING_PATIENT_FOR_INVOICE
                        )
                    )
                        ? "Select a patient" 
                        : "Patients"
                }
                title={"Patients List"}
                backButton={
                    location.state && 
                    (
                        location.state.for === For.ASSIGN_PATIENTS_TO_CLINIC || 
                        location.state.for === For.SELECTING_PATIENT || 
                        location.state.for === For.SELECTING_PATIENT_FOR_APPOINTMENT || 
                        location.state.for === For.SELECTING_PATIENT_FOR_INVOICE
                    )
                }
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end", textAlign: "start", alignItems: "center", pb: 2, gap: 1 }}>
                        <Filter
                            options={filterOptions}
                            onSubmit={handleFilterSubmit}
                        />
                        <Tooltip title="Reload">
                            <IconButton onClick={handleReloadClick}>
                                <ReplayOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Create new customer">
                            <IconButton onClick={handleAddClick}>
                                <Add />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <TableToolbar numSelected={state.selectedIds?.size} onDelete={handleDelete} onEdit={handleEdit} onAssign={handleAssign} onSelect={handleSelectPatient} />
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
                        disableMultipleRowSelection={(location.state && location.state.for === For.ASSIGN_PATIENTS_TO_CLINIC) || (location.state && location.state.for === For.SELECTING_PATIENT) || (location.state && location.state.for === For.SELECTING_PATIENT_FOR_APPOINTMENT) ? true : false}
                        sx={{ border: 0 }}
                        onRowSelectionModelChange={handleSelectRow}
                        loading={state.loading}
                    />
                </Container>
            </Card>
        </>
    );
}

export default PatientsList;