import { ChevronLeft, ChevronRight, Delete, Edit, Visibility } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Chip, Container, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { CalendarIcon, DateCalendar, DateView, TimeIcon } from "@mui/x-date-pickers";
import { PickerSelectionState } from "@mui/x-date-pickers/internals";
import moment from "moment";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Event } from "../../types/Event";
import { BasicResultSet, useApi } from "../../hooks/useApi";
import { PageResponse } from "../../types/PageResponse";
import { deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";

function ScheduleCalendar() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [event, setEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(Date.now()));
    const [nextable, setNextable] = useState<boolean>(false);

    const [user] = useAuth();

    const api = useApi();
    const alert = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [page, selectedDate]);

    const fetchEvents = useCallback(async () => {
        try {
            if(!isLoading) setIsLoading(true);

            const res = await api.get<PageResponse<Event>>("/schedule-management/getRelevantEvents", {
                userId: `${user?.user.id}`,
                page: `${page}`,
                pageSize: `${1}`,
                date: moment(selectedDate).format("yyyy-MM-DD")
            });
            if (res)
                if (res.content.length > 0){
                    setEvent(res.content[0]);
                    setNextable(!res.last);
                }else{
                    setEvent(null);
                }

            setTimeout(() => setIsLoading(false), 1000);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }, [page, event, selectedDate, isLoading]);

    const handleDateChange = useCallback((value: any, selectionState?: PickerSelectionState | undefined, selectedView?: DateView | undefined): void => {
        setSelectedDate(value);
    }, [selectedDate]);

    function handleUpdateEventClick(_event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        navigate("schedule-management/create", { state: event });
    }

    function handleDeleteEventClick(_event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        alert.setAlertDialog("Are you sure?", "Are you sure you want to delete the event?", "Yes", "No",
            () => deleteEvent()
        );
    }

    async function deleteEvent() {
        try{
            const res = await api.delete<BasicResultSet>("/schedule-management/deleteEvent", {
                eventId: `${event?.id}`
            });
            if(res){
                console.log(res);
                alert.setSuccess("Event deleted successfuly."); 
                (page > 0) ? setPage(p => p-1) : setEvent(null); 
            }
        }catch(err) {
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }

    return (
        <>
            <Box gap={2} sx={{ mb: 4, p: 0, flexDirection: "row", display: "flex", flex: 1 }}>
                <Card sx={{ flex: .6 }}>
                    {
                        isLoading
                        ?
                            <Container sx={{ justifyContent : "center", height: "100%", display: "flex", flexDirection: "column" }}>
                                <Skeleton variant="text"></Skeleton>
                                <Skeleton variant="text"></Skeleton>
                                <Skeleton variant="text"></Skeleton>
                                <Skeleton variant="text"></Skeleton>
                            </Container>
                        :
                            <CardContent sx={{ height: "100%" }}>
                                <Box sx={{ alignItems: "center", justifyContent: "start", display: "flex", flexDirection: "row", flex: 1 }} >
                                    <Box sx={{ alignItems: "center", justifyContent: "start", display: "flex", flexDirection: "row", flex: .8 }}>
                                        <TimeIcon fontSize="small" />
                                        <Typography variant="subtitle1" fontStyle="italic" sx={{ pl: 1 }}>{moment(selectedDate!).format("MMMM Do, yyyy")} {moment(selectedDate).format("yyyy-MM-DD").match(moment(new Date(Date.now())).format("yyyy-MM-DD")) && "(Today)" }</Typography>
                                    </Box>
                                    <Box sx={{ flex: .2, display: "flex", justifyContent: "end" }}>
                                        <Stack direction={"row"}>
                                            <Tooltip title={"Previous"}>
                                                <IconButton 
                                                    onClick={() => setPage(prev => prev-1)}
                                                    disabled={page===0}
                                                >
                                                    <ChevronLeft />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={"Next"}>
                                                <IconButton 
                                                    onClick={() => setPage(prev => prev+1)}
                                                    disabled={nextable===false}
                                                >
                                                    <ChevronRight />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                </Box>
                                {
                                    event
                                    ?
                                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, height: "90%" }}>
                                            <Container sx={{ display: "flex", flexDirection: "column", flex: .8, gap: 1 }}>
                                                <Typography variant="h5">{event?.title}</Typography>
                                                <Typography variant="body1">{event?.description}</Typography>
                                            </Container>
                                            <Box sx={{ display: "flex", flexDirection: "column", flex: .2 }}>
                                                <Stack direction={"row"} gap={1}>
                                                    <Chip icon={<CalendarIcon />} label={event?.date} />
                                                    <Chip icon={<TimeIcon />} label={moment(Date.parse(event.date + " " + event?.time)).format("hh:mm A")} />
                                                    <Chip icon={<Visibility />} label={event.visibility}/>
                                                </Stack>
                                                <Stack direction={"row"} sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                                                        <Avatar sx={{ bgcolor: deepPurple[500] }}>{event.owner.name.substring(0, 1)}</Avatar>
                                                        <Stack sx={{ textAlign: "start" }}>
                                                            <Typography variant="subtitle1">Posted by</Typography>
                                                            <Typography variant="h6">{event.owner.name} ({event.owner.role})</Typography>
                                                        </Stack>
                                                    </Box>
                                                    {
                                                        event.owner.id === user?.user.id
                                                        &&
                                                        <Stack direction={"row"} gap={1} justifyContent={"center"} alignItems={"center"}>
                                                            <Tooltip title="Update event details">
                                                                <Button startIcon={<Edit />} variant="contained" onClick={handleUpdateEventClick}>Update</Button>
                                                            </Tooltip>
                                                            <Tooltip title="Delete event details">
                                                                <Button startIcon={<Delete />} variant="contained" color="error" onClick={handleDeleteEventClick}>Delete</Button>
                                                            </Tooltip>
                                                        </Stack>
                                                    }
                                                </Stack>
                                            </Box>
                                        </Box>
                                    :
                                        <Box sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Typography variant="subtitle1" fontStyle="italic">No event(s)</Typography>
                                        </Box>
                                }
                            </CardContent>
                    }
                </Card>
                <Card sx={{ flex: .40 }}>
                    {
                        useMemo(() => <DateCalendar defaultValue={moment(Date.now())} onChange={handleDateChange} />, [])
                    }
                </Card>
            </Box>
        </>
    );
}

export default ScheduleCalendar;