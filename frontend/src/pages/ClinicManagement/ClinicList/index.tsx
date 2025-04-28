import { Box, Container, IconButton, Pagination, Stack, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, useCallback, useEffect, useReducer } from "react";
import { useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../types";
import ClinicCard from "./ClinicCard";
import SkeletonCard from "./SkeletonCard";
import { ReplayOutlined } from "@mui/icons-material";
import { useAlert } from "../../../hooks/useAlert";
import { useLocation, useNavigate } from "react-router";
import { For } from "../../../enums/For";
import Filter, { FilterOption } from "../../../components/Filter";
import { SearchBy } from "../../../enums/SearchBy";

const filterOptions: FilterOption[] = [
    { label: "Caption", value: SearchBy.CAPTION },
    { label: "Day of week", value: SearchBy.DOW },
    { label: "Time", value: SearchBy.TIME },
    { label: "Doctor", value: SearchBy.DOCTOR },
];

interface ClinicListState {
    list: Clinic[],
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    searchKey: string;
    searchBy: SearchBy;
    loading: boolean;
};

const initialState: ClinicListState = {
    list: [],
    page: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    searchKey: "",
    searchBy: SearchBy.CAPTION,
    loading: false,
};

enum ActionType {
    SET_LIST,
    SET_LOADING,
    START_LOADING,
    STOP_LOADING,
    SET_PAGINATION_INFO,
    SET_PAGE,
    SET_SEARCH_KEY,
};

const reducer = (state: ClinicListState, action: { type: ActionType, payload: any }): ClinicListState => {
    switch (action.type) {
        case ActionType.SET_LIST:
            return { ...state, list: action.payload.content, page: action.payload.number, pageSize: action.payload.size, totalElements: action.payload.totalElements, totalPages: action.payload.totalPages, loading: false };
        case ActionType.SET_LOADING:
            return { ...state, loading: action.payload };
        case ActionType.START_LOADING:
            return { ...state, loading: true };
        case ActionType.STOP_LOADING:
            return { ...state, loading: false };
        case ActionType.SET_PAGINATION_INFO:
            return { ...state, page: action.payload.page, pageSize: action.payload.pageSize, totalElements: action.payload.totalElements, totalPages: action.payload.totalPages };
        case ActionType.SET_PAGE:
            return { ...state, page: action.payload };
        case ActionType.SET_SEARCH_KEY:
            return { ...state, searchKey: action.payload.searchKey, searchBy: action.payload.searchBy };
        default:
            return state;
    }
};

function ClinicList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();

    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.state);

    useEffect(() => {
        fetchList();
    }, [state.page, state.pageSize, state.searchKey]);

    const handlePageChange = useCallback((_e: ChangeEvent<unknown>, pageNumber: number) => {
        dispatch({ type: ActionType.SET_PAGE, payload: pageNumber - 1 });
    }, [state.page]);

    const handleReloadClick = useCallback(() => {
        console.log("clicked");
        dispatch({ type: ActionType.SET_PAGE, payload: 0 });
    }, [state.page]);

    const fetchList = useCallback(async () => {
        dispatch({ type: ActionType.START_LOADING, payload: null });
        try {
            const endpoint = state.searchKey.length < 1 ? "/clinic-management/page" : "/clinic-management" + SearchBy.getEndpoint(state.searchBy);

            const options: Record<string, string> = state.searchKey.length < 1 ? {
                page: `${state.page}`,
                pageSize: `${5}`
            } : {
                page: `${state.page}`,
                pageSize: `${5}`,
                searchKey: state.searchKey
            };

            const res = await api.get<Clinic[]>(endpoint, options);
            if (res)
                dispatch({ type: ActionType.SET_LIST, payload: res });
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [state.page, state.searchKey]);

    const handleClinicClick = useCallback((clinicId: number): void => {
        if (location.state && location.state.for && location.state.for === For.SELECTING_CLINIC) {
            navigate("/appointment-management/create", { state: { ...location.state, clinic: state.list.filter(c => c.id === clinicId)[0] } });
            return;
        }
        navigate("clinic-details", { state: { clinicId: clinicId } });
    }, [state.list]);

    const handleFilterSubmit = useCallback((option: FilterOption, searchKey: string): void | Promise<void> => {
        console.log("clicked");
        dispatch({ type: ActionType.SET_SEARCH_KEY, payload: { searchKey: searchKey, searchBy: option.value } });
    }, []);

    return (
        <>
            <PageTitle
                subTitle={(location.state && location.state.for && location.state.for === For.SELECTING_CLINIC) ? "Select a clinic" : "Clinic Management"}
                title="Clinics List"
                endContent={
                    <Stack direction="row" alignItems="center">
                        <Box sx={{ p: 1 }}>
                            <Filter
                                options={filterOptions}
                                onSubmit={handleFilterSubmit}
                            />
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <Tooltip title={"Reload"}>
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                }
                backButton={(location.state && location.state.for && location.state.for === For.SELECTING_CLINIC) ? true : false}
            />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: "0 !important",
                    pt: 2,
                    pb: 2
                }}
            >
                <Stack direction="row" gap={2}>
                    {
                        state.loading
                            ? (
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) :

                            state.list &&
                                state.list.length > 0 ? (
                                    state.list.map((clinic, idx) => (
                                        <ClinicCard key={idx} clinic={clinic} onClick={handleClinicClick} />
                                    ))
                                ) :
                                    <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>No items</Typography>

                    }
                </Stack>
                <Box sx={{
                    display: "flex",
                    mt: 3,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                }}>
                    {
                        state.list.length > 0 ? (
                            <Pagination count={state.totalPages} page={state.page + 1} onChange={handlePageChange} shape="rounded" />
                        ) : null
                    }
                </Box>
            </Container>
        </>
    );
}

export default ClinicList;