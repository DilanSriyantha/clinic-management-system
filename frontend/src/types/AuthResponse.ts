import { User } from "./User";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const isAuthResponse = (object: any): object is  AuthResponse => {
    return (typeof object === 'object' && object !== null && 'accessToken' in object && 'refreshToken' in object);
};