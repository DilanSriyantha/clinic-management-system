import { Box, Container, IconButton, Pagination, Stack, Tooltip } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../models/Clinic";
import ClinicCard from "./ClinicCard";
import SkeletonCard from "./SkeletonCard";
import { ReplayOutlined } from "@mui/icons-material";
import SearchBar from "../../../components/SearchBar";
import Filter, { FilterOption } from "./Filter";

const filterOptions: FilterOption[] = [
    { label: "Caption", value: 1 },
    { label: "Date", value: 2 },
    { label: "Day of week", value: 3 },
    { label: "Time", value: 4 },
    { label: "Doctor", value: 5 },
];

function ClinicList() {
    const [list, setList] = useState<Clinic[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);

    const api = useApi();

    const withHeaders = useCallback((headers: Headers) => {
        const totalPages = headers.get("X-Total-Pages");
        if(totalPages)
            setPages(parseInt(totalPages));
    }, [pages]);

    const handlePageChange = useCallback((e: ChangeEvent<unknown>, pageNumber: number) => {
        setPage(pageNumber);
    }, [page]); 

    const handleReloadClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        setPage(1);
    }, []);

    const handleFilterChange = useCallback((option: FilterOption) => {
        console.log(option);
    }, []);
 
    async function getList() {
        try {
            const res = await api.get<Clinic>("/clinic-management/list", {
                page: `${page}`,
                pageSize: `${5}`
            }, withHeaders);
            if (res)
                setList(res);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getList();
    }, [page]);

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
                        list ? (
                            list.map((clinic, idx) => (
                                <ClinicCard key={idx} clinic={clinic} />
                            ))
                        ) : (
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
                        pages && (
                            <Pagination count={pages} page={page} onChange={handlePageChange} shape="rounded" />
                        )
                    }
                </Box>
            </Container>
        </>
    );
}

export default ClinicList;