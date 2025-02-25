import { Box, Grid2, useTheme } from "@mui/material";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "./PageHeader";
import DashboardCard from "../../components/DashboardCard";
import StethoscopeIcon from "../../assets/stethoscope_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import UsersIcon from "../../assets/users.svg";
import MedicalServicesIcon from "../../assets/medical_services_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import ReceptionistIcon from "../../assets/support_agent_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import AppointmentIcon from "../../assets/event_available_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import ReceiptIcon from "../../assets/receipt_long_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import PillIcon from "../../assets/pill_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import CashIcon from "../../assets/payments_24dp_00_FILL0_wght400_GRAD0_opsz24.svg";
import { useCallback, useEffect, useReducer } from "react";
import { useApi } from "../../hooks/useApi";
import { useAlert } from "../../hooks/useAlert";
import { DashboardReport } from "../../types/DashboardReport";
import { DashboardState } from "../../types/DashboardState";

const initialState: DashboardState = {
    doctorCount: 0,
    patientCount: 0,
    pharmacistCount: 0,
    receptionistCount: 0,
    todayAppointmentCount: 0,
    todayInvoiceCount: 0,
    lowStockMedicineCount: 0,
    todayIncomeCount: 0,
    loading: false,
};

enum ActionType {
    SET_FIELD,
    SET_ALL_FIELDS,
    SET_LOADING
};

const reducer = (state: DashboardState, action: { type: ActionType, payload: any }): DashboardState => {
    switch(action.type){
        case ActionType.SET_FIELD:
            return {...state, [action.payload.name]: action.payload.value};
        case ActionType.SET_ALL_FIELDS:
            return {...state, doctorCount: action.payload.doctorCount, patientCount: action.payload.patientCount, pharmacistCount: action.payload.pharmacistCount, receptionistCount: action.payload.receptionistCount, todayAppointmentCount: action.payload.todayAppointmentCount, todayInvoiceCount: action.payload.todayInvoiceCount, lowStockMedicineCount: action.payload.lowStockMedicineCount, todayIncomeCount: action.payload.todayIncomeCount, loading: false};
        case ActionType.SET_LOADING:
            return {...state, loading: action.payload.loading};
        default:
            return state;
    }
}

function Dashboard() {
    const theme = useTheme();
    const api = useApi();
    const alert = useAlert();

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = useCallback(async () => {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        try{
            const res = await api.get<DashboardReport>("/dashboard/report");
            if(res) {
                console.log(res);
                dispatch({ type: ActionType.SET_ALL_FIELDS, payload: res });
            }
        }catch(err){
            console.log(err);
            alert.setError(err instanceof Error ? err.message : "Unknown error");
            dispatch({ type: ActionType.SET_LOADING, payload: false });
        }
    }, []);

    return (
        <>
            <Box sx={{ 
                mb: 3,
            }}>
                <PageTitleWrapper>
                    <PageHeader />
                </PageTitleWrapper>
                <Grid2 container spacing={5}>
                    <Grid2 size={4}>
                        <Box>
                            <DashboardCard icon={StethoscopeIcon} title="Doctor(s)" number={state.doctorCount} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={UsersIcon} title="Patient(s)" number={state.patientCount} bgColor={theme.colors.info.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={MedicalServicesIcon} title="Pharmacist(s)" number={state.pharmacistCount} bgColor={theme.colors.warning.dark} />
                        </Box>
                    </Grid2>

                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={ReceptionistIcon} title="Receptionist(s)" number={state.receptionistCount} bgColor={theme.colors.warning.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={AppointmentIcon} title="Appointment(s) Today" number={state.todayAppointmentCount} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={ReceiptIcon} title="Invoice(s) Today" number={state.todayInvoiceCount} bgColor={theme.colors.info.dark} />
                        </Box>
                    </Grid2>

                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={PillIcon} title="Medicine(s) Low Stocks" number={state.lowStockMedicineCount} bgColor={theme.colors.error.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={8}>
                        <Box >
                            <DashboardCard icon={CashIcon} title="Total Payment(s) Today" number={state.todayIncomeCount} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>

        </>
    );
}

export default Dashboard;