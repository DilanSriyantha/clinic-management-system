import { Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { Clinic } from "../../../../types/Clinic";
import { CalendarIcon, TimeIcon } from "@mui/x-date-pickers";
import { Person } from "@mui/icons-material";
import { MouseEvent } from "react";

interface ClinicCardProps {
    clinic: Clinic;
    onClick?: (clinicId: number) => void;
};

const ClinicCard: React.FC<ClinicCardProps> = (props) => {

    function handleCardMediaAreaClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        if(!props.onClick)
            return;

        props.onClick(props.clinic.id);
    }

    return (
        <>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea onClick={handleCardMediaAreaClick}>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://static.vecteezy.com/system/resources/previews/037/247/199/non_2x/ai-generated-national-doctors-day-advertisment-background-with-copy-space-free-photo.jpg"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.clinic.caption}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", pb: 1 }}>
                            {props.clinic.description}
                        </Typography>
                        <Stack direction="row" gap={.5} sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            pb: 1
                        }}>
                            <Chip icon={<CalendarIcon />} label={props.clinic.dayOfWeek} />
                            <Chip icon={<TimeIcon />} label={props.clinic.time} />
                        </Stack>
                        <Stack direction={"column"} sx={{ pl: 1, pr: 1 }}>
                            <Chip icon={<Person />} label={props.clinic.doctorUid ? props.clinic.doctorUid : "Not assigned!"} />
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}

export default ClinicCard;