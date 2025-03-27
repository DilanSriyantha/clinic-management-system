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
                path: "reporting",
                element: <><Typography variant='h1'>Reporting & Analyzis</Typography></>
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