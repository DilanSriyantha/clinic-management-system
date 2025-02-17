import { Card, CardActionArea, CardContent, CardMedia, Container, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { Clinic } from "../../../models/Clinic";
import ClinicCard from "./ClinicCard";

function ClinicList() {
    const [list, setList] = useState<Clinic[] | null>(null);
    
    const api = useApi();

    useEffect(() => {
        async function getList() {
            try{
                const res = await api.get<Clinic>("/clinic-management/list");
                if(res){
                    setList(res);
                }
            }catch(err){
                console.log(err);
            }
        }

        return (() => {
            getList();
        });
    }, []);

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title="Clinics List"
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
                            list?.map((clinic, idx) => (
                                <ClinicCard key={idx} clinic={clinic} />
                            ))
                        }
                    </Stack>
                </Container>
        </>
    );
}

export default ClinicList;