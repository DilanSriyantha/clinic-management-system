import { RouteObject } from "react-router";
import BaseLayout from "../layouts/BaseLayout";
import RouteLoader from "./RouteLoader";
import { lazy } from "react";

const Login = RouteLoader(lazy(() => import("../pages/Authentication/Login")));
 
const AuthRoutes: RouteObject[] = [
    {
        path: "/",
        element: <BaseLayout />,
        children: [
            {
                path: "",
                element: <Login />
            }
        ]
    }
];

export default AuthRoutes;