import { Avatar, Box, Card, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Add, LinkOff, MedicalServices } from "@mui/icons-material";
import { MouseEvent, useCallback } from "react";
import { User } from "../../../../types/User";
import { deepOrange } from "@mui/material/colors";

interface DoctorSectionProps {
    clinicDoctors: User[];
    onAssignClick: () => void;
    onDismissClick: (doctorId: number) => void;
};

const DoctorSection: React.FC<DoctorSectionProps> = (props) => {

    const handleAssignClick = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        props.onAssignClick();
    }, []);

    interface DoctorItemProps {
        doctor: User;
        onDismissClick: (doctorId: number) => void;
    };

    const DoctorItem: React.FC<DoctorItemProps> = (props) => {

        const handleDismissClick = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
            props.onDismissClick(props.doctor.id);
        }, []);

        return (
            <>
                <Box sx={{ pt: 1, pb: 1 }}>
                    <Stack direction={"row"} sx={{ alignItems: "center" }} gap={1} pb={2}>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>{props.doctor.name.substring(0, 1)}</Avatar>
                        <Typography variant="h6">Dr. {props.doctor.name}</Typography>
                        <Tooltip title={"Dismiss"}>
                            <IconButton onClick={handleDismissClick}>
                                <LinkOff color="error" />
                            </IconButton>
                        </Tooltip>
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
                            <IconButton color="primary" onClick={handleAssignClick}>
                                <Add />
                                <Typography variant="button">Assign</Typography>
                            </IconButton>
                        </Stack>
                        <Stack direction={"column"} gap={2}>
                            <Stack direction={"column"}>
                                {
                                    props.clinicDoctors && props.clinicDoctors.length > 0
                                        ?
                                        props.clinicDoctors.map((doc, idx) => (
                                            <DoctorItem key={idx} doctor={doc} onDismissClick={props.onDismissClick} />
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