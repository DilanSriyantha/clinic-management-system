import { useRoutes } from "react-router";
import AuthRoutes from "./AuthRouter";
import MainRoutes from "./MainRouter";
import { useAuth } from "../hooks/useAuth";
import { ReactElement, useMemo } from "react";

const AppRoutes = (): ReactElement | null => {
    const [user, setUser] = useAuth();

    const routes = useMemo(() => {
        return user ? MainRoutes : AuthRoutes;
    }, [user]);

    return useRoutes(routes);
};

export default AppRoutes;