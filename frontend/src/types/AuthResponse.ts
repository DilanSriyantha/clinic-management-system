import { User } from "./User";

export interface AuthResponse {
    token: string;
    user: User;
}

export const isAuthResponse = (object: any): object is  AuthResponse => {
    return (typeof object === 'object' && object !== null && 'token' in object);
};