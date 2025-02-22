import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { AuthResponse } from "../types/AuthResponse";
import { useApi } from "./useApi";
import { LoginFormData } from "../types/LoginFormData";
import { RegisterFormData } from "../types/RegisterFormData";

interface AuthProviderType {
    user: AuthResponse | null;
    setUser: (loginFormData: AuthResponse | null) => void;
};

const AuthContext = createContext<AuthProviderType>(
    {} as AuthProviderType
);

interface AuthProviderProps {
    children?: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [_user, _setUser] = useState<AuthResponse | null>(null);

    const api = useApi();

    const __setUser = useCallback((authResponse: AuthResponse | null) => {
        _setUser(authResponse);
    }, [_user]);

    return (
        <AuthContext.Provider value={{ user: _user, setUser: __setUser }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = (): [AuthResponse | null, (authResponse: AuthResponse | null) => void] => {
    const ctx = useContext(AuthContext);
    
    if(!ctx) 
        throw new Error("useAuth() hook must be used within an AuthProvider");

    return [ctx.user, ctx.setUser];
};