import { useNavigate, useRoutes } from "react-router";
import AuthRoutes from "./AuthRouter";
import MainRoutes from "./MainRouter";
import { useAuth } from "../hooks/useAuth";
import { ReactElement, useEffect, useMemo } from "react";

const AppRoutes = (): ReactElement | null => {
    const [user] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        navigate("", { replace: true });
    }, [user]);

    const routes = useMemo(() => ( 
        user ? MainRoutes : AuthRoutes
    ), [user]);
    
    return useRoutes(routes);
};

export default AppRoutes;