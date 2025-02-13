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

function Dashboard() {
    const theme = useTheme();

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
                        <Box >
                            <DashboardCard icon={StethoscopeIcon} title="Doctor(s)" number={3} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={UsersIcon} title="Patient(s)" number={3} bgColor={theme.colors.info.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={MedicalServicesIcon} title="Pharmacist(s)" number={3} bgColor={theme.colors.warning.dark} />
                        </Box>
                    </Grid2>

                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={ReceptionistIcon} title="Receptionist(s)" number={3} bgColor={theme.colors.warning.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={AppointmentIcon} title="Appointment(s) Today" number={3} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={ReceiptIcon} title="Invoice(s) Today" number={3} bgColor={theme.colors.info.dark} />
                        </Box>
                    </Grid2>

                    <Grid2 size={4}>
                        <Box >
                            <DashboardCard icon={PillIcon} title="Medicine(s) Low Stocks" number={3} bgColor={theme.colors.error.dark} />
                        </Box>
                    </Grid2>
                    <Grid2 size={8}>
                        <Box >
                            <DashboardCard icon={CashIcon} title="Total Payment(s) Today" number={150000} bgColor={theme.colors.success.dark} />
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>

        </>
    );
}

export default Dashboard;