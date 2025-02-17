import React, { createContext, ReactNode, useContext } from "react";

export interface BasicResultSet {
    resultCode: number;
    message: string;
};

interface ApiProviderType {
    get: <T>(endpoint: string, urlParams?: Record<string, string>) => Promise<T[]>;
    post: <T>(endpoint: string, requestBodyJson: T) => Promise<BasicResultSet>;
    put: <T>(endpoint: string, requestBodyJson: T) => Promise<BasicResultSet>;
};

interface ApiProviderProps {
    children?: ReactNode;
};

const ApiContext = createContext<ApiProviderType>(
    {} as ApiProviderType
);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const api_url = import.meta.env.VITE_API_URL;

    const get = async<T = any>(endpoint: string, urlParams?: Record<string, string>): Promise<T[]> => {
        const url = api_url + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
        try{
            const res: Response = await fetch(url, { 
                method: "GET",
                headers: {
                    "Content-type": "application/json;"
                } 
            });
            if(!res.ok)
                throw new Error(`Fetch error [useApi]: status: ${res.status} - ${res.statusText}`);
            
            return (await res.json()) as T[];
        }catch(err){
            throw new Error(`Fetch error [useApi]: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const post = async<T = any>(endpoint: string, requestBodyJson: T): Promise<BasicResultSet> => {
        const url = api_url + endpoint;
        try{
            const res: Response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(requestBodyJson),
                headers: {
                    "Content-type": "application/json;"
                }
            });
            
            if(!res.ok)
                throw new Error(`Fetch error [useApi]: status: ${res.status} - ${res.statusText}`);

            return (await res.json()) as BasicResultSet;
        }catch(err){
            throw new Error(`Fetch error [useApi]: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    const put = async<T = any>(endpoint: string, requestBodyJson: T): Promise<BasicResultSet> => {
        try{
            const res: Response = await fetch(endpoint, {
                method: "PUT",
                body: JSON.stringify(requestBodyJson),
                headers: {
                    "Content-type": "application/json;"
                }
            });

            if(!res.ok)
                throw new Error(`Fetch error [useApi]: status: ${res.status} - ${res.statusText}`);

            return (await res.json()) as BasicResultSet;
        }catch(err){
            throw new Error(`Fetch error [useApi]: ${err instanceof Error ? err.message : "Unknown error"}`);
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