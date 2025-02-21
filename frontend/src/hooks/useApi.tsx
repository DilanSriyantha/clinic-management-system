import React, { createContext, ReactNode, useContext } from "react";
import { useAuth } from "./useAuth";
import { ServerException } from "../types/ServerException";

export interface BasicResultSet {
    resultCode: number;
    message: string;
};

interface ApiProviderType {
    get: <T>(endpoint: string, urlParams?: Record<string, string>, getHeaders?: (headers: Headers) => void) => Promise<T[]>;
    post: <T, R>(endpoint: string, requestBodyJson: T) => Promise<R>;
    put: <T>(endpoint: string, requestBodyJson: T) => Promise<BasicResultSet>;
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

    const get = async<T = any>(endpoint: string, urlParams?: Record<string, string>, getHeaders?: (headers: Headers) => void): Promise<T[]> => {
        const url = api_url + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
        const options: RequestInit = {
            method: "GET",
            headers: user?.token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${user?.token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try{
            const res: Response = await fetch(url, options);

            if(!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);

            if(getHeaders)
                getHeaders(res.headers);

            return (await res.json()) as T[];
        }catch(err){
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const post = async<T = any, R = any>(endpoint: string, requestBodyJson: T): Promise<R> => {
        const url = api_url + endpoint;
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(requestBodyJson),
            headers: user?.token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${user?.token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try{
            const res: Response = await fetch(url, options);
            
            if(!res.ok){
                const serverException: ServerException = (await res.json()) as ServerException;
                throw new Error(`${serverException.statusCode} - ${serverException.message}`);
            }

            return (await res.json()) as R;
        }catch(err){
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const put = async<T = any>(endpoint: string, requestBodyJson: T): Promise<BasicResultSet> => {
        const url = api_url + endpoint;
        const options: RequestInit = {
            method: "PUT",
            body: JSON.stringify(requestBodyJson),
            headers: user?.token ? {
                "Content-type": "application/json;",
                "Authorization": `Bearer ${user?.token}`
            } : {
                "Content-type": "application/json;"
            }
        };
        try{
            const res: Response = await fetch(url, options);

            if(!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);

            return (await res.json()) as BasicResultSet;
        }catch(err){
            throw new Error(`${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    return (
        <ApiContext.Provider value={{ get, post, put }}>
            { children }
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const ctx = useContext(ApiContext);

    return ctx;
};