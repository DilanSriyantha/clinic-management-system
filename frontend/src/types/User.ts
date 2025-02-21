import { Timestamp } from "./Timestamp";

export interface User {
    id: number;
    name: string;
    password: string;
    referenceId: string;
    imagePath: string;
    birthday: string;
    email: string;
    address: string;
    telephone: string;
    percentage: number;
    status: number;
    role: number;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: any[];
    credentialsNonExpired: boolean;
    enabled: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};