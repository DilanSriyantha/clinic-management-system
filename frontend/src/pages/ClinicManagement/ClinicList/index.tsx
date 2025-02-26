import { Box, Container, IconButton, Pagination, Stack, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, MouseEvent, useCallback, useEffect, useReducer, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../types/Clinic";
import ClinicCard from "./ClinicCard";
import SkeletonCard from "./SkeletonCard";
import { ReplayOutlined } from "@mui/icons-material";
import SearchBar from "../../../components/SearchBar";
import Filter, { FilterOption } from "./Filter";
import { ClinicListState } from "../../../types/ClinicListState";
import { useAlert } from "../../../hooks/useAlert";

const filterOptions: FilterOption[] = [
    { label: "Caption", value: 1 },
    { label: "Date", value: 2 },
    { label: "Day of week", value: 3 },
    { label: "Time", value: 4 },
    { label: "Doctor", value: 5 },
];

const initialState: ClinicListState = {
    list: [],
    page: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    loading: false,
};

enum ActionType {
    SET_LIST,
    SET_LOADING,
    SET_PAGINATION_INFO,
    SET_PAGE
};

const reducer = (state: ClinicListState, action: { type: ActionType, payload: any }): ClinicListState => {
    switch(action.type){
        case ActionType.SET_LIST:
            return {...state, list: action.payload.content, page: action.payload.number, pageSize: action.payload.size, totalElements: action.payload.totalElements, totalPages: action.payload.totalPages, loading: state.loading && !state.loading};
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload};
        case ActionType.SET_PAGINATION_INFO:
            return {...state, loading: true, page: action.payload.page, pageSize: action.payload.pageSize, totalElements: action.payload.totalElements, totalPages: action.payload.totalPages };
        case ActionType.SET_PAGE:
            return {...state, loading: true, page: action.payload};
        default:
            return state;
    }
};

function ClinicList() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useApi();
    const alert = useAlert();

    useEffect(() => {
        fetchList();
    }, [state.page, state.pageSize]);

    const handlePageChange = useCallback((e: ChangeEvent<unknown>, pageNumber: number) => {
        dispatch({ type: ActionType.SET_PAGE, payload: pageNumber });
    }, [state.page]); 

    const handleReloadClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        console.log("clicked");
        dispatch({ type: ActionType.SET_PAGE, payload: 0 });
    }, [state.page]);

    const handleFilterChange = useCallback((option: FilterOption) => {
        console.log(option);
    }, []);
 
    const fetchList = useCallback(async () => {
        try {
            const res = await api.get<Clinic[]>("/clinic-management/page", {
                page: `${state.page}`,
                pageSize: `${5}`
            });
            if (res)
                dispatch({ type: ActionType.SET_LIST, payload: res });
        } catch (err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title="Clinics List"
                endContent={
                    <Stack direction="row">
                        <Box sx={{ p: 1 }}>
                            <Tooltip title={"Reload"}>
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <Filter 
                                options={filterOptions}
                                onChange={handleFilterChange}
                            />
                        </Box>
                        <SearchBar />
                    </Stack>
                }
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
                        state.list ? 
                        state.list.length > 0 ? (
                            state.list.map((clinic, idx) => (
                                <ClinicCard key={idx} clinic={clinic} />
                            ))
                        ) : 
                            <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>No items</Typography>
                        : (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        )
                    }
                </Stack>
                <Box sx={{
                    display: "flex",
                    mt: 3,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                }}>
                    {
                        state.page ? (
                            <Pagination count={state.totalPages} page={state.page} onChange={handlePageChange} shape="rounded" />
                        ) : null
                    }
                </Box>
            </Container>
        </>
    );
}

export default ClinicList;