import { lazy, Suspense } from "react";
import SuspenseLoader from "../components/SuspenseLoader";
import { RouteObject } from "react-router";
// import BaseLayout from "../layouts/BaseLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import DoctorManagement from "../pages/DoctorManagement";
import { Typography } from "@mui/material";
import BaseLayout from "../layouts/BaseLayout";

const Loader = (Component: React.ElementType) => (props: any) => (
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

// pages
const Login = Loader(lazy(() => import("../pages/Authentication/Login")));
const Dashboard = Loader(lazy(() => import("../pages/Dashboard")));
const CreateAccount = Loader(lazy(() => import("../pages/Users/CreateAccount")));
const UsersList = Loader(lazy(() => import("../pages/Users/UserList")));
const ClinicList = Loader(lazy(() => import("../pages/ClinicManagement/ClinicList")));
const CreateClinic = Loader(lazy(() => import("../pages/ClinicManagement/CreateClinic")));

// routes
const routes: RouteObject[] = [
    {
        path: "/",
        element: <BaseLayout />,
        children: [
            {
                path: "",
                element: <Login />
            }
        ]
    },
    {
        path: "/",
        element: <SidebarLayout />,
        children: [
            // users
            {
                path: "main/dashboard",
                element: <Dashboard />
            },
            {
                path: "main/users/create",
                element: <CreateAccount />
            },
            {
                path: "main/users/list",
                element: <UsersList />
            },
            {
                path: "main/clinic-management/list",
                element: <ClinicList />
            },
            {
                path: "main/clinic-management/create",
                element: <CreateClinic />
            },
            // doctor management
            {
                path: "main/doctor-management",
                element: <DoctorManagement />
            },
            {
                path: "main/doctor-management/queue",
                element: <><Typography variant='h1'>Patient</Typography></>
            },
            {
                path: "main/doctor-management/prescription",
                element: <><Typography variant='h1'>Prescription</Typography></>
            },
            {
                path: "main/doctor-management/lab-requests",
                element: <><Typography variant='h1'>Lab request</Typography></>
            },
            {
                path: "main/doctor-management/patients",
                element: <><Typography variant='h1'>Patients</Typography></>
            },
            // billing
            {
                path: "main/billing",
                element: <><Typography variant='h1'>Billing & Payments</Typography></>
            },
            // pharmacy 
            {
                path: "main/pharmacy",
                element: <><Typography variant='h1'>Pharmacy Management</Typography></>
            },
            // reporting
            {
                path: "main/reporting",
                element: <><Typography variant='h1'>Reporting & Analyzis</Typography></>
            },
            // backup
            {
                path: "main/backup",
                element: <><Typography variant='h1'>Backup & Restore</Typography></>
            }
        ]
    }
];

export default routes;