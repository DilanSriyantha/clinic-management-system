import { lazy, Suspense } from "react";
import SuspenseLoader from "../components/SuspenseLoader";
import { RouteObject } from "react-router";
// import BaseLayout from "../layouts/BaseLayout";
import SidebarLayout from "../layouts/SidebarLayout";

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
            }
        ]
    }
];

export default routes;