import { Stack } from "@mui/material";
import { DatePicker, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";

export interface DateRange {
    startDate: string,
    endDate: string
};

export interface DateRangePickerProps {
    onChange: (value: DateRange) => void;
};

const firstDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1);
const lastDayOfMonth = new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1, 0);

export default function DateRangePicker({ onChange }: DateRangePickerProps) {    
    const [startDate, setStartDate] = useState<string>(moment(firstDayOfMonth).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState<string>(moment(lastDayOfMonth).format("YYYY-MM-DD"));

    useEffect(() => {
        onChange({ startDate: startDate, endDate: endDate });
    }, [startDate && endDate]);

    const handleStartDateChange = useCallback((value: Moment | null, _context: PickerChangeHandlerContext<DateValidationError>): void => {
        if(!value) return;

        setStartDate(value.format("YYYY-MM-DD"));
    }, []);

    const handleEndDateChange = useCallback((value: Moment | null, _context: PickerChangeHandlerContext<DateValidationError>): void => {
        if(!value) return;

        setEndDate(value.format("YYYY-MM-DD"));
    }, []);

    return (
        <>
            <Stack direction={"row"} gap={1}>
                <DatePicker onChange={handleStartDateChange} label="Start Date" defaultValue={moment(firstDayOfMonth)} />
                <DatePicker onChange={handleEndDateChange} label="End Date" defaultValue={moment(lastDayOfMonth)} />
            </Stack>
        </>
    );
}