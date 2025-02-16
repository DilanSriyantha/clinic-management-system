import { Card, Container } from "@mui/material";
import PageTitle from "../../../components/PageTitle";

function ClinicList() {

    return (
        <>
            <PageTitle
                subTitle="Clinic Management"
                title="Clinics List"
            />
            <Card>
                <Container
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        pt: 2,
                        pb: 2
                    }}
                >

                </Container>
            </Card>
        </>
    );
}

export default ClinicList;