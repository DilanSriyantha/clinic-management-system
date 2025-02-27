import { Avatar, Box, Card, Divider, Grid2, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Add, LinkOff, MedicalServices } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { User } from "../../../../types/User";
import { deepOrange } from "@mui/material/colors";

interface DoctorSectionProps {
    clinicDoctors: User[];
};

const DoctorSection: React.FC<DoctorSectionProps> = (props) => {
    const [doctors, setDoctors] = useState<User[] | null>();

    useEffect(() => {
        if (!props.clinicDoctors) return;

        setDoctors(props.clinicDoctors);

        console.log(props.clinicDoctors);
    }, []);

    interface DoctorItemProps {
        doctor: User;
    };

    const DoctorItem: React.FC<DoctorItemProps> = (props) => {

        return (
            <>
                <Box sx={{ pt: 1, pb: 1 }}>
                    <Stack direction={"row"} sx={{ alignItems: "center" }} gap={1} pb={2}>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>{props.doctor.name.substring(0, 1)}</Avatar>
                        <Typography variant="h6">Dr. {props.doctor.name}</Typography>
                    </Stack>
                    <Stack direction={"column"} gap={1}>
                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Typography variant="subtitle1">Reference ID</Typography>
                            <Typography variant="body2">{props.doctor.referenceId}</Typography>
                        </div>
                        <Divider />
                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Typography variant="subtitle1">Specialization</Typography>
                            <Typography variant="body2">{props.doctor.specialization}</Typography>
                        </div>
                        <Divider />
                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Typography variant="subtitle1">E-mail</Typography>
                            <Typography variant="body2">{props.doctor.email}</Typography>
                        </div>
                        <Divider />
                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Typography variant="subtitle1">Telephone</Typography>
                            <Typography variant="body2">{props.doctor.telephone}</Typography>
                        </div>
                    </Stack>
                </Box>


            </>
        );
    };

    return (
        <>
            <Stack direction={"column"} gap={2}>
                <Card>
                    <Box sx={{ display: "flex", textAlign: "start", flexDirection: "column", p: 2 }}>
                        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 2 }}>
                                <MedicalServices />
                                <Typography variant="h5">Doctor Information</Typography>
                            </Box>
                            <IconButton color="primary">
                                <Add />
                                <Typography variant="button">Assign</Typography>
                            </IconButton>
                        </Stack>
                        <Stack direction={"column"} gap={2}>
                            <Stack direction={"column"}>
                                {
                                    doctors && doctors.length > 0
                                        ?
                                        doctors.map((doc, idx) => (
                                            <DoctorItem key={idx} doctor={doc} />
                                        ))

                                        :
                                        <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>No doctor(s) assigned.</Typography>
                                }
                            </Stack>
                        </Stack>
                    </Box>
                </Card>
            </Stack>
        </>
    );
}

export default DoctorSection;