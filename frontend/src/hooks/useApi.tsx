import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { ServerException } from "../types/ServerException";
import { useAuth } from "./useAuth";
import { AuthResponse } from "../types/AuthResponse";
import { LoginFormData } from "../types/LoginFormData";
import { RegisterFormData } from "../types/RegisterFormData";
import { useAlert } from "./useAlert";

export interface BasicResultSet {
    resultCode: number;
    message: string;
};

interface ApiProviderType {
    get: <T>(endpoint: string, urlParams?: Record<string, string>, accessToken?: string, getHeaders?: (headers: Headers) => void) => Promise<T>;
    post: <T, R>(endpoint: string, requestBodyJson?: T, accessToken?: string) => Promise<R>;
    put: <T, R>(endpoint: string, urlParams?: Record<string, string>, requestBodyJson?: T, accessToken?: string) => Promise<R>;
    delete: <T, R>(endpoint: string, requestBodyJson?: T, accessToken?: string) => Promise<R>;
};

interface ApiProviderProps {
    children?: ReactNode;
};

const ApiContext = createContext<ApiProviderType>(
    {} as ApiProviderType
);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const [user, setUser] = useAuth();
    const alert = useAlert();

    const api_url = import.meta.env.VITE_API_URL;

    const get = async<T = any>(endpoint: string, urlParams?: Record<string, string>, accessToken?: string, getHeaders?: (headers: Headers) => void): Promise<T> => {
        const url = api_url + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
        accessToken = accessToken ? accessToken : user?.accessToken ? user?.accessToken : undefined;
        const options: RequestInit = {
            method: "GET",
            headers: accessToken ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${accessToken}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if (!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                handleJwtTokenExpired(serverException);
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            if (getHeaders)
                getHeaders(res.headers);

            return (await res.json()) as T;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const post = async<T = any, R = any>(endpoint: string, requestBodyJson?: T, accessToken?: string): Promise<R> => {
        const url = api_url + endpoint;
        accessToken = accessToken ? accessToken : user?.accessToken ? user?.accessToken : undefined;
        const options: RequestInit = {
            method: "POST",
            body: requestBodyJson && JSON.stringify(requestBodyJson),
            headers: accessToken ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${accessToken}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if (!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                handleJwtTokenExpired(serverException);
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            return (await res.json()) as R;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const put = async<T = any, R = any>(endpoint: string, urlParams?: Record<string, string>, requestBodyJson?: T, accessToken?: string): Promise<R> => {
        const url = api_url + endpoint + (urlParams && `?${new URLSearchParams(urlParams).toString()}`);
        accessToken = accessToken ? accessToken : user?.accessToken ? user?.accessToken : undefined;
        const options: RequestInit = {
            method: "PUT",
            body: requestBodyJson && JSON.stringify(requestBodyJson),
            headers: accessToken ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${accessToken}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if (!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                handleJwtTokenExpired(serverException);
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            return (await res.json()) as R;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const _delete = async<T = any, R = any>(endpoint: string, requestBodyJson?: T, accessToken?: string): Promise<R> => {
        const url = api_url + endpoint;
        accessToken = accessToken ? accessToken : user?.accessToken ? user?.accessToken : undefined;
        const options: RequestInit = {
            method: "DELETE",
            body: requestBodyJson && JSON.stringify(requestBodyJson),
            headers: accessToken ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${accessToken}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try {
            const res: Response = await fetch(url, options);

            if(!res.ok) {
                const serverException: ServerException = (await res.json()) as ServerException;
                handleJwtTokenExpired(serverException);
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            return (await res.json()) as R;
        } catch (err) {
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const handleJwtTokenExpired = useCallback(async (serverException: ServerException) => {
        const jwtTokenExpired = serverException.statusCode === 401 && serverException.message.startsWith("JwtToken is expired.");
        
        if(!jwtTokenExpired)
            return;
        
        alert.setAlertDialog("Session Expired!", "Your session has been exceeded. Do you want to extend the session?", "Yes", "No", refreshJwtAccessToken);
    }, [user]);

    const refreshJwtAccessToken = useCallback(async () => {
        try{
            const res = await post<string, AuthResponse>("/auth/refresh", undefined, user?.refreshToken);
            if(res){
                setUser(res);
                alert.setSuccess("Session is extended by 10 minutes");
            }
        }catch(err){
            alert.setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [user]);

    return (
        <ApiContext.Provider value={{ get, post, put, delete: _delete }}>
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