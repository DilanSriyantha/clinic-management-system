import { lazy } from "react";
import RouteLoader from "./RouteLoader";
import { Typography } from "@mui/material";
import { RouteObject } from "react-router";
import SidebarLayout from "../layouts/SidebarLayout";
import DoctorManagement from "../pages/DoctorManagement";

const Dashboard = RouteLoader(lazy(() => import("../pages/Dashboard")));
const CreateAccount = RouteLoader(lazy(() => import("../pages/Users/CreateAccount")));
const UsersList = RouteLoader(lazy(() => import("../pages/Users/UserList")));
const ClinicList = RouteLoader(lazy(() => import("../pages/ClinicManagement/ClinicList")));
const CreateClinic = RouteLoader(lazy(() => import("../pages/ClinicManagement/CreateClinic")));

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
                path: "users/create",
                element: <CreateAccount />
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
            // doctor management
            {
                path: "doctor-management",
                element: <DoctorManagement />
            },
            {
                path: "doctor-management/queue",
                element: <><Typography variant='h1'>Patient</Typography></>
            },
            {
                path: "doctor-management/prescription",
                element: <><Typography variant='h1'>Prescription</Typography></>
            },
            {
                path: "doctor-management/lab-requests",
                element: <><Typography variant='h1'>Lab request</Typography></>
            },
            {
                path: "doctor-management/patients",
                element: <><Typography variant='h1'>Patients</Typography></>
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