import React, { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../models/User";

interface AuthProviderType {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthProviderType>(
    {} as AuthProviderType
);

interface AuthProviderProps {
    children?: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [_user, _setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user: _user, setUser: _setUser }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = (): [User | null, (user: User | null) => void] => {
    const ctx = useContext(AuthContext);

    return [ctx.user, ctx.setUser];
};