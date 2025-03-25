import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { Patient } from "../../../../types";
import { GridColDef, DataGrid, GridRowId, GridRowSelectionModel, GridCallbackDetails, GridPaginationModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useReducer } from "react";
import { Add, Accessible } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { For } from "../../../../enums/For";

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

interface PatientsSectionProps {
    clinicId: number;
    patientsList: Set<Patient>;
};

interface PatientsSectionState {
    selectedId: GridRowId | undefined,
    list: Patient[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
};

enum ActionType {
    SET_SELECTED_ID,
    SET_LIST,
    SET_PAGE,
    SET_PAGE_SIZE,
    SET_TOTAL_PAGES,
    SET_PAGINATION_INFO,
    SET_PAGINATION_MODEL,
    SET_LOADING,
};

const initialState: PatientsSectionState = {
    selectedId: undefined,
    list: [],
    page: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 1,
    loading: false,
};

const reducer = (state: PatientsSectionState, action: { type: ActionType, payload: any }): PatientsSectionState => {
    switch (action.type) {
        case ActionType.SET_SELECTED_ID:
            return { ...state, selectedId: action.payload };
        case ActionType.SET_LIST:
            return { ...state, list: action.payload };
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
            if (state.loading === action.payload)
                return { ...state };
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

function PatientsSection({ clinicId, patientsList }: PatientsSectionProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: ActionType.SET_LIST, payload: patientsList });
    }, [patientsList]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        dispatch({ type: ActionType.SET_SELECTED_ID, payload: ids.at(0) });
    }, [state.selectedId]);

    const onPaginationModelChange = useCallback((model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void => {
        dispatch({
            type: ActionType.SET_PAGINATION_INFO, payload: {
                page: model.page,
                pageSize: model.pageSize
            }
        });
    }, [state.page, state.pageSize]);

    const handleAssignClick = useCallback(() => {
        navigate("/patient-management/list", { state: { for: For.ASSIGN_PATIENTS_TO_CLINIC, clinicId: clinicId } });
    }, []);

    return (
        <Card>
            <Box
                sx={{
                    p: 2
                }}
            >
                <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 2 }}>
                        <Accessible />
                        <Typography variant="h5">Patient Information</Typography>
                    </Box>
                    <IconButton color="primary" onClick={handleAssignClick}>
                        <Add />
                        <Typography variant="button">Assign</Typography>
                    </IconButton>
                </Stack>
                {
                    state.list.length > 0
                    ?
                        <DataGrid
                            rows={state.list}
                            columns={columns}
                            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                            paginationModel={{ page: state.page, pageSize: state.pageSize }}
                            onPaginationModelChange={onPaginationModelChange}
                            paginationMode="server"
                            rowCount={state.totalElements}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            disableMultipleRowSelection={true}
                            sx={{ border: 0 }}
                            onRowSelectionModelChange={handleSelectRow}
                            loading={state.loading}
                        />
                    :
                        <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>No patient(s) assigned.</Typography>
                }
            </Box>
        </Card>
    );
}

export default PatientsSection;