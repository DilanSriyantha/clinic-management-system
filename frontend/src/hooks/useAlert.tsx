import { Box, Stack, Snackbar, Alert } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

interface AlertContextType {
    setSuccess: (message: string, autoHideDuration?: number) => void;
    setInfo: (message: string, autoHideDuration?: number) => void;
    setWarning: (message: string, autoHideDuration?: number) => void;
    setError: (message: string, autoHideDuration?: number) => void;
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

    const setAlert = (alert: AlertModel) => {
        setAlerts(prev => [...prev, alert]);
    };

    const setSuccess = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 1000, severity: "success" });
    };

    const setInfo = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 1000, severity: "info" });
    };

    const setWarning = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 1000, severity: "warning" });
    };

    const setError = (message: string, autoHideDuration?: number) => {
        setAlert({ message: message, autoHideLatency: autoHideDuration ? autoHideDuration : 1000, severity: "error" });
    };

    return (
        <AlertContext.Provider value={{ setSuccess: setSuccess, setInfo: setInfo, setWarning: setWarning, setError: setError }}>
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
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const ctx = useContext(AlertContext);

    return ctx;
};
