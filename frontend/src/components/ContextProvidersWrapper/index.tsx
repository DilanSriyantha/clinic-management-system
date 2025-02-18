import React, { ReactNode } from "react";
import { ApiProvider } from "../../hooks/useApi";
import { AuthProvider } from "../../hooks/useAuth";

interface ContextProvidersWrapperProps {
    children?: ReactNode;
};

const ContextProvidersWrapper: React.FC<ContextProvidersWrapperProps> = ({ children }) => {
    return (
        <>
            <ApiProvider>
                <AuthProvider>
                    { children }
                </AuthProvider>
            </ApiProvider>
        </>
    );
}

export default ContextProvidersWrapper;