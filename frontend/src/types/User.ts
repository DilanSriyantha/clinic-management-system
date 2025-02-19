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
    createdAt: Timestamp;
};