import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { AuthResponse, isAuthResponse } from "../types/AuthResponse";
import { useApi } from "./useApi";
import { isNull } from "../utils/TypeChecker";
import { isLoginFormData, LoginFormData } from "../types/LoginFormData";
import { isRegisterFormData, RegisterFormData } from "../types/RegisterFormData";

interface AuthProviderType {
    user: AuthResponse | null;
    setUser: (loginFormData: AuthResponse | null) => void;
    authenticate: (loginFormData: LoginFormData) => Promise<AuthResponse | undefined>;
    register: (registerFormData: RegisterFormData) => Promise<AuthResponse | undefined>;
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

    const _authenticate = useCallback(async (loginFormData: LoginFormData): Promise<AuthResponse | undefined> => {
        try{
            const res = await api.post<LoginFormData, AuthResponse>("/auth/authenticate", loginFormData);
            if(res){
                _setUser(res);
                return res;
            }
        }catch(err){
            throw err;
        }
    }, [_user]);

    const _register = useCallback(async (registerFormData: RegisterFormData): Promise<AuthResponse | undefined> => {
        try{
            const res = await api.post<RegisterFormData, AuthResponse>("/auth/register", registerFormData);
            if(res)
                return res;
        }catch(err) {
            throw err;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user: _user, setUser: __setUser, authenticate: _authenticate, register: _register }}>
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

interface AuthManagerType {
    authenticate: (loginFormData: LoginFormData) => Promise<AuthResponse | undefined>;
    register: (registerFormData: RegisterFormData) => Promise<AuthResponse | undefined>;
};

export const useAuthManager = (): AuthManagerType => {
    const ctx = useContext(AuthContext);

    if(!ctx)
        throw new Error("useAuthManager() hook must be used within an AuthProvider");

    return { 
        authenticate: ctx.authenticate,
        register: ctx.register,
    };
}