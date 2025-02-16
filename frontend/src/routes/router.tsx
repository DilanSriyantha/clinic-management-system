import { lazy, Suspense } from "react";
import SuspenseLoader from "../components/SuspenseLoader";
import { RouteObject } from "react-router";
// import BaseLayout from "../layouts/BaseLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import DoctorManagement from "../pages/DoctorManagement";
import { Typography } from "@mui/material";

const Loader = (Component: React.ElementType) => (props: any) => (
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

// pages
const Dashboard = Loader(lazy(() => import("../pages/Dashboard")));
const CreateAccount = Loader(lazy(() => import("../pages/Users/CreateAccount")));
const UsersList = Loader(lazy(() => import("../pages/Users/UserList")));

// routes
const routes: RouteObject[] = [
    {
        path: "",
        element: <SidebarLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/users/create",
                element: <CreateAccount />
            },
            {
                path: "/users/list",
                element: <UsersList />
            },
            {
                path: "/doctor-management",
                element: <DoctorManagement />
            },
            {
                path: "/doctor-management/queue",
                element: <><Typography variant='h1'>Patient</Typography></>
            },
            {
                path: "/doctor-management/prescription",
                element: <><Typography variant='h1'>Prescription</Typography></>
            },
            {
                path: "/doctor-management/lab-requests",
                element: <><Typography variant='h1'>Lab request</Typography></>
            },
            {
                path: "/doctor-management/patients",
                element: <><Typography variant='h1'>Patients</Typography></>
            },
            {
                path: "/billing",
                element: <><Typography variant='h1'>Billing & Payments</Typography></>
            },
            {
                path: "/pharmacy",
                element: <><Typography variant='h1'>Pharmacy Management</Typography></>
            },
            {
                path: "/reporting",
                element: <><Typography variant='h1'>Reporting & Analyzis</Typography></>
            },
            {
                path: "/backup",
                element: <><Typography variant='h1'>Backup & Restore</Typography></>
            }
        ]
    }
];

export default routes;