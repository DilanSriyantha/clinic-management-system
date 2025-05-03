import { lazy } from "react";
import RouteLoader from "./RouteLoader";
import { Typography } from "@mui/material";
import { RouteObject } from "react-router";
import SidebarLayout from "../layouts/SidebarLayout";

const Dashboard = RouteLoader(lazy(() => import("../pages/Dashboard")));

const CreateAccount = RouteLoader(lazy(() => import("../pages/Users/CreateAccount")));
const UpdateUser = RouteLoader(lazy(() => import("../pages/Users/UpdateUser")));
const UsersList = RouteLoader(lazy(() => import("../pages/Users/UserList")));

const ClinicList = RouteLoader(lazy(() => import("../pages/ClinicManagement/ClinicList")));
const ClinicDetails = RouteLoader(lazy(() => import("../pages/ClinicManagement/ClinicDetails")));
const CreateClinic = RouteLoader(lazy(() => import("../pages/ClinicManagement/CreateClinic")));

const CreateEvent = RouteLoader(lazy(() => import("../pages/ScheduleManagement/CreateEvent")));
const UpdateEvent = RouteLoader(lazy(() => import("../pages/ScheduleManagement/UpdateEvent")));

const PatientsList = RouteLoader(lazy(() => import("../pages/PatientManagement/PatientsList")));
const CreatePatient = RouteLoader(lazy(() => import("../pages/PatientManagement/CreatePatient")));
const UpdatePatient = RouteLoader(lazy(() => import("../pages/PatientManagement/UpdatePatient")));

const CreatePrescription = RouteLoader(lazy(() => import("../pages/PrescriptionManagement/CreatePrescription")));
const PrescriptionList = RouteLoader(lazy(() => import("../pages/PrescriptionManagement/PrescriptionList")));

const CreateAppointment = RouteLoader(lazy(() => import("../pages/AppointmentManagement/CreateAppointment")));
const AppointmentList = RouteLoader(lazy(() => import("../pages/AppointmentManagement/AppointmentList")));

const CreateStock = RouteLoader(lazy(() => import("../pages/PharmacyStockManagement/CreateStock")));
const StockList = RouteLoader(lazy(() => import("../pages/PharmacyStockManagement/StockList")));

const CreateItem = RouteLoader(lazy(() => import("../pages/PharmacyStockManagement/CreateItem")));
const ItemList = RouteLoader(lazy(() => import("../pages/PharmacyStockManagement/ItemList")));

const CreateInvoice = RouteLoader(lazy(() => import("../pages/PharmacySalesManagement/CreateInvoice")));
const InvoiceList = RouteLoader(lazy(() => import("../pages/PharmacySalesManagement/InvoiceList")));
const InvoiceRecordsList = RouteLoader(lazy(() => import("../pages/PharmacySalesManagement/InvoiceRecordsList")));

const MainRoutes: RouteObject[] = [
    {
        path: "/",
        element: <SidebarLayout />,
        children: [
            // users
            {
                path: "",
                element: <Dashboard />
            },
            {
                path: "schedule-management/create",
                element: <CreateEvent />
            },
            {
                path: "schedule-management/update",
                element: <UpdateEvent />
            },
            {
                path: "users/create",
                element: <CreateAccount />
            },
            {
                path: "users/list/update/",
                element: <UpdateUser />
            },
            {
                path: "users/list",
                element: <UsersList />
            },
            {
                path: "clinic-management/list",
                element: <ClinicList />
            },
            {
                path: "clinic-management/create",
                element: <CreateClinic />
            },
            {
                path: "clinic-management/list/clinic-details",
                element: <ClinicDetails />
            },
            // patient management
            {
                path: "patient-management/list",
                element: <PatientsList />
            },
            {
                path: "patient-management/create",
                element: <CreatePatient />
            },
            {
                path: "patient-management/update",
                element: <UpdatePatient />
            },
            {
                path: "prescription-management/create",
                element: <CreatePrescription />
            },
            {
                path: "prescription-management/list",
                element: <PrescriptionList />
            },
            {
                path: "appointment-management/create",
                element: <CreateAppointment />
            }, 
            {
                path: "appointment-management/list",
                element: <AppointmentList />
            },
            {
                path: "pharmacy-stock-management/create-stock",
                element: <CreateStock />
            },
            {
                path: "pharmacy-stock-management/list-stocks",
                element: <StockList />
            },
            {
                path: "pharmacy-stock-management/create-item",
                element: <CreateItem />
            }, 
            {
                path: "pharmacy-stock-management/list-items",
                element: <ItemList />
            },
            {
                path: "pharmacy-sales-management/create",
                element: <CreateInvoice />
            },
            {
                path: "pharmacy-sales-management/list",
                element: <InvoiceList />
            },
            {
                path: "pharmacy-sales-management/list/invoice-records",
                element: <InvoiceRecordsList />
            },
            // billing
            {
                path: "billing",
                element: <><Typography variant='h1'>Billing & Payments</Typography></>
            },
            // pharmacy 
            {
                path: "pharmacy",
                element: <><Typography variant='h1'>Pharmacy Management</Typography></>
            },
            // reporting
            {
                path: "reporting-and-analysis/user-report",
                element: <><Typography variant="h1">User Report</Typography></>
            },
            {
                path: "reporting-and-analysis/patient-report",
                element: <><Typography variant="h1">Patient Report</Typography></>
            },
            {
                path: "reporting-and-analysis/prescription-report",
                element: <><Typography variant="h1">Prescription Report</Typography></>
            },
            {
                path: "reporting-and-analysis/clinic-report",
                element: <><Typography variant="h1">CLinic Report</Typography></>
            },
            {
                path: "reporting-and-analysis/appointment-report",
                element: <><Typography variant="h1">Appointment Report</Typography></>
            },
            {
                path: "reporting-and-analysis/pharmacy-sales-report",
                element: <><Typography variant="h1">Pharmacy Sales Report</Typography></>
            },
            {
                path: "reporting-and-analysis/pharmacy-stocks-report",
                element: <><Typography variant="h1">Pharmacy Stocks Report</Typography></>
            },
            // backup
            {
                path: "backup",
                element: <><Typography variant='h1'>Backup & Restore</Typography></>
            }
        ]
    }
];

export default MainRoutes;