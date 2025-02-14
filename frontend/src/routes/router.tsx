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
                path: "/doctor-management",
                element: <DoctorManagement />
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