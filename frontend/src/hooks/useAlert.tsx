import { Box, Stack, Snackbar, Alert } from "@mui/material";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import AlertDialog, { AlertDialogRef } from "../components/AlertDialog";

interface AlertContextType {
    setSuccess: (message: string, autoHideDuration?: number) => void;
    setInfo: (message: string, autoHideDuration?: number) => void;
    setWarning: (message: string, autoHideDuration?: number) => void;
    setError: (message: string, autoHideDuration?: number) => void;
    setAlertDialog: (title: string, content: string, positiveText: string, negativeText: string, onPositiveAction?: () => void | Promise<void>, onNegativeAction?: () => void | Promise<void>) => void;
};

interface AlertProviderProps {
    children: ReactNode;
};

const AlertContext = createContext<AlertContextType>(
    {} as AlertContextType
);

interface AlertModel {
    message: string;
    autoHideLatency?: number;
    severity: "success" | "info" | "warning" | "error";
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertModel[]>([]);

    const alertDialogRef = useRef<AlertDialogRef>(null);

    const setAlert = (alert: AlertModel) => {
        setAlerts(prev => [...prev, alert]);
    };

    const setSuccess = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 3000, severity: "success" });
    };

    const setInfo = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 3000, severity: "info" });
    };

    const setWarning = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 3000, severity: "warning" });
    };

    const setError = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 3000, severity: "error" });
    };

    const setAlertDialog = (title: string, content: string, positiveText: string, negativeText: string, onPositiveAction?: () => void | Promise<void>, onNegativeAction?: () => void | Promise<void>) => {
        alertDialogRef?.current?.setupAndOpen(title, content, positiveText, negativeText, onPositiveAction, onNegativeAction);
    };

    return (
        <AlertContext.Provider value={{ setSuccess: setSuccess, setInfo: setInfo, setWarning: setWarning, setError: setError, setAlertDialog: setAlertDialog }}>
            <Box sx={{
                display: "flex",
                position: "absolute",
                right: 0,
                bottom: 2,
                p: 2,
                zIndex: 1111111
            }}>
                <Stack direction='column-reverse' gap={1}>
                    {
                        alerts.map((alert, idx) => (
                            <Box key={idx}>
                                <Snackbar
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    open={true}
                                    autoHideDuration={alert.autoHideLatency}
                                    onClose={() => setAlerts(prev => prev.slice(0, idx))}
                                    key={'bottom' + 'right'}
                                >
                                    <Alert severity={alert.severity}>{alert.message}</Alert>
                                </Snackbar>
                            </Box>
                        ))
                    }
                </Stack>
            </Box>
            <AlertDialog
                ref={alertDialogRef}
            />
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const ctx = useContext(AlertContext);

    return ctx;
};
