import { Alert, Snackbar } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useState } from "react";

export interface AlertSnackbarProps {
    severity?: "success" | "error" | "warning" | "info";
    variant?: "filled" | "outlined" | "standard";
    message?: string;
    autoHideDuration?: number;
    ref?: Ref<any>;
};

export interface AlertSnackbarHandles {
    show: () => void;
    hide: () => void;
};

const AlertSnackbar = forwardRef<AlertSnackbarHandles, AlertSnackbarProps>(({...props}, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        show() {
            setOpen(true);
        },
        hide() {
            setOpen(false);
        }
    }));

    return (
        <Snackbar
            open={open}
            autoHideDuration={props.autoHideDuration}
        >
            <Alert severity={props.severity} variant={props.variant}>{props.message}</Alert>
        </Snackbar>
    );
});

export default AlertSnackbar;