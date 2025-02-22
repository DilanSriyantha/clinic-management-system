import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { ServerException } from "../types/ServerException";
import { useAuth } from "./useAuth";
import { AuthResponse } from "../types/AuthResponse";
import { LoginFormData } from "../types/LoginFormData";
import { RegisterFormData } from "../types/RegisterFormData";

export interface BasicResultSet {
    resultCode: number;
    message: string;
};

interface ApiProviderType {
    get: <T>(endpoint: string, urlParams?: Record<string, string>, token?: string, getHeaders?: (headers: Headers) => void) => Promise<T>;
    post: <T, R>(endpoint: string, requestBodyJson: T, token?: string) => Promise<R>;
    put: <T, R>(endpoint: string, requestBodyJson: T, token?: string) => Promise<R>;
};

interface ApiProviderProps {
    children?: ReactNode;
};

const ApiContext = createContext<ApiProviderType>(
    {} as ApiProviderType
);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const [user] = useAuth();

    const api_url = import.meta.env.VITE_API_URL;

    const get = async<T = any>(endpoint: string, urlParams?: Record<string, string>, token?: string, getHeaders?: (headers: Headers) => void): Promise<T> => {
        const url = api_url + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
        token = token ? token : user?.token ? user?.token : undefined;
        const options: RequestInit = {
            method: "GET",
            headers: token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if (!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            if (getHeaders)
                getHeaders(res.headers);

            return (await res.json()) as T;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const post = async<T = any, R = any>(endpoint: string, requestBodyJson: T, token?: string): Promise<R> => {
        const url = api_url + endpoint;
        token = token ? token : user?.token ? user?.token : undefined;
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(requestBodyJson),
            headers: token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            console.log(token);
            const res: Response = await fetch(url, options);

            if (!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            return (await res.json()) as R;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const put = async<T = any, R = any>(endpoint: string, requestBodyJson: T, token?: string): Promise<R> => {
        const url = api_url + endpoint;
        token = token ? token : user?.token ? user?.token : undefined;
        const options: RequestInit = {
            method: "PUT",
            body: JSON.stringify(requestBodyJson),
            headers: token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if (!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);

            return (await res.json()) as R;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    return (
        <ApiContext.Provider value={{ get, post, put }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const ctx = useContext(ApiContext);

    if (!ctx)
        throw new Error("useApi hook must be utilized withing a ApiProvider");

    return ctx;
};

interface AuthManagerType {
    authenticate: (loginFormData: LoginFormData) => Promise<AuthResponse | undefined>;
    register: (registerFormData: RegisterFormData) => Promise<AuthResponse | undefined>;
};

export const useAuthManager = (): AuthManagerType => {
    const [user, setUser] = useAuth();
    const api = useApi();

    const authenticate = useCallback(async (loginFormData: LoginFormData): Promise<AuthResponse | undefined> => {
        try {
            const res = await api.post<LoginFormData, AuthResponse>("/auth/authenticate", loginFormData);
            if (res) {
                setUser(res);
                return res;
            }
        } catch (err) {
            throw err;
        }
    }, [user]);

    const register = useCallback(async (registerFormData: RegisterFormData): Promise<AuthResponse | undefined> => {
        try {
            const res = await api.post<RegisterFormData, AuthResponse>("/auth/register", registerFormData);
            if (res)
                return res;
        } catch (err) {
            throw err;
        }
    }, []);

    return {
        authenticate: authenticate,
        register: register,
    };
};