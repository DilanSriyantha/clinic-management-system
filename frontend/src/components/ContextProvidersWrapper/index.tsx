import React, { ReactNode } from "react";
import { ApiProvider } from "../../hooks/useApi";
import { AuthProvider } from "../../hooks/useAuth";
import { AlertProvider } from "../../hooks/useAlert";

interface ContextProvidersWrapperProps {
    children?: ReactNode;
};

const ContextProvidersWrapper: React.FC<ContextProvidersWrapperProps> = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <ApiProvider>
                    <AlertProvider>
                        {children}
                    </AlertProvider>
                </ApiProvider>
            </AuthProvider>
        </>
    );
}

export default ContextProvidersWrapper;