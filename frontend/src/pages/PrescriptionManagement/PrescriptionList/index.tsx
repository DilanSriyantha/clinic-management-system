import { Delete, Edit, ReplayOutlined } from "@mui/icons-material";
import { Card, Container, Stack, Box, Tooltip, IconButton, alpha, Toolbar, Typography, Grid2, ListItem, ListItemText } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import PageTitle from "../../../components/PageTitle";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { PageResponse, PrescriptionDto, PrescriptionLineDto } from "../../../types";
import { BasicResultSet, useApi } from "../../../hooks/useApi";
import { useAlert } from "../../../hooks/useAlert";
import { useNavigate } from "react-router";
import { FixedSizeList, ListChildComponentProps } from "react-window";

const columns: GridColDef[] = [
    {
        field: "number",
        headerName: "#",
        width: 150,
        valueGetter: (val, row, col, api) => `Prescription ${api.current.getRowId(row)}`
    },
    { field: "patientName", headerName: "Patient", width: 200 },
    { field: "doctorName", headerName: "Doctor", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 100 },
];

const linesColumns: GridColDef[] = [
    {
        field: "number",
        headerName: "#",
        width: 150,
        valueGetter: (val, row, col, api) => api.current.getRowId(row)
    },
    { field: "description", headerName: "Description", width: 200 }
];

interface PrescriptionListState {
    isLoading: boolean;
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    selectedIds: Set<GridRowId>,
    list: PrescriptionDto[],
    linesList: PrescriptionLineDto[]
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
    SET_LINES,
    SET_LOADING,
};

const initialState: PrescriptionListState = {
    isLoading: false,
    page: 0,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
    selectedIds: new Set<GridRowId>,
    list: [],
    linesList: []
};

const paginationModel = { page: 0, pageSize: 5 };

const reducer = (state: PrescriptionListState, action: { type: ActionType, payload: any }): PrescriptionListState => {
    switch (action.type) {
        case ActionType.SET_SELECTED_IDS:
            return { ...state, selectedIds: action.payload, linesList: state.list.filter(line => action.payload.has(line.id)).length > 0 ? state.list.filter(line => action.payload.has(line.id))[0].prescriptionLines : [] };
        case ActionType.ADD_TO_SELECTED_IDS:
            return { ...state, selectedIds: new Set<GridRowId>(state.selectedIds).add(action.payload) };
        case ActionType.REMOVE_FROM_SELECTED_IDS:
            const newSet = new Set<GridRowId>(state.selectedIds);
            newSet.delete(action.payload);
            return { ...state, selectedIds: newSet };
        case ActionType.SET_LIST:
            return { ...state, list: action.payload.content };
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
        case ActionType.SET_LINES:
            return { ...state, linesList: action.payload };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

function PrescriptionList() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    console.log(state.list.filter((line, idx) => state.selectedIds.has(line.id))[0]);
    console.log(state.selectedIds)

    const fetchPrescriptions = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try {
            const res = await api.get<PageResponse<PrescriptionDto>>("/prescription-management/page", {
                page: `${state.page}`,
                pageSize: `${state.pageSize}`
            });
            if (res) {
                console.log(res);
                dispatch({ type: ActionType.SET_PAGINATION_INFO, payload: res });
            }
        } catch (err) {
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state]);

    const handleReloadClick = useCallback(() => {
        fetchPrescriptions();
    }, [state.page, state.pageSize, state.list]);

    const handleDelete = useCallback(async () => {
        try {
            const res = await api.delete<any, BasicResultSet>("/prescription-management/delete", {
                prescriptionId: `${Array.from(state.list)[0].id}`
            });
            if (res) {
                alert.setSuccess(res.message);
                dispatch({ type: ActionType.DELETE_SELECTED_ITEMS, payload: state.selectedIds });
            }
        } catch (err) {
            alert.setError(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [state.selectedIds, state.list]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        dispatch({ type: ActionType.SET_SELECTED_IDS, payload: new Set<GridRowId>(ids) });
    }, [state.selectedIds]);

    const onPaginationModelChange = useCallback((model: GridPaginationModel, details: GridCallbackDetails<"pagination">): void => {
        dispatch({
            type: ActionType.SET_PAGINATION_INFO, payload: {
                page: model.page,
                pageSize: model.pageSize
            }
        });
    }, [state.page, state.pageSize, state.totalPages]);

    const handleEdit = useCallback(() => {
        const patient = state.list.find((patient) => state.selectedIds.has(patient.id));
        navigate("/prescription-management/create", { state: patient });
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
                {/* {props.numSelected == 1 && (
                    <Tooltip title="Edit">
                        <IconButton onClick={props.onEdit}>
                            <Edit color="primary" />
                        </IconButton>
                    </Tooltip>
                )} */}
                <Tooltip title="Delete">
                    <IconButton onClick={props.onDelete}>
                        <Delete color="error" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        );
    };

    function renderRow(props: ListChildComponentProps) {
        const { data, index, style } = props;
        console.log(data);
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemText primary={`${index + 1}. ${data[index].description}`} />
            </ListItem>
        );
    }

    return (
        <>
            <PageTitle
                subTitle={"Presciptions"}
                title={"Prescriptions List"}
            />
            <Grid2 container size={12} gap={1}>
                <Grid2 size={5.5}>
                    <Card sx={{ height: "100%" }}>
                        <Container sx={{
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            pb: 2,
                            height: "100%"
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
                                disableMultipleRowSelection
                                rowCount={state.totalElements}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                sx={{ border: 0 }}
                                onRowSelectionModelChange={handleSelectRow}
                                loading={state.isLoading}
                            />
                        </Container>
                    </Card>
                </Grid2>
                <Grid2 size={5.5}>
                    <Card>
                        <Box
                            sx={{ p: 2 }}
                        >
                            <Typography variant="h6">Prescription</Typography>
                        </Box>
                        <Container sx={{
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            pb: 2
                        }}>
                            <Box
                                sx={{ width: '100%', height: 400, pl: 2, pr: 2 }}
                            >
                                {
                                    state.linesList.length > 0
                                        ?
                                        <FixedSizeList
                                            height={400}
                                            width={"100%"}
                                            itemSize={46}
                                            itemCount={state.linesList.length}
                                            overscanCount={5}
                                            itemData={state.linesList}
                                        >
                                            {renderRow}
                                        </FixedSizeList>
                                        :
                                        <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>No record(s)</Typography>
                                }
                            </Box>
                        </Container>
                    </Card>
                </Grid2>
            </Grid2>
        </>
    );
}

export default PrescriptionList;