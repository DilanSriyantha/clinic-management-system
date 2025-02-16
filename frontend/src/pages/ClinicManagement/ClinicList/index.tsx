import { Card, CardActionArea, CardContent, CardMedia, Container, Stack, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { useEffect, useState } from "react";

function ClinicList() {
    const [list, setList] = useState<object[] | null>(null);

    useEffect(() => {
        async function getList() {
            const api = import.meta.env.VITE_API_URL;
            try {
                const res = await fetch(api + "/clinic-management/list");
                if (res) {
                    const list = await res.json();
                    setList(list);
                }
            } catch (err) {
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
                        pt: 2,
                        pb: 2
                    }}
                >
                    <Stack direction="row" gap={2}>
                        {
                            list?.map((clinic, idx) => (
                                <Card key={idx} sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNAzLGvyz3x8qTsZMTwSICccgxgAJiDMuc7g&s"
                                        />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Lizard
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            Lizards are a widespread group of squamate reptiles, with over 6,000
                                            species, ranging across all continents except Antarctica
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        }
                    </Stack>
                </Container>
        </>
    );
}

export default ClinicList;