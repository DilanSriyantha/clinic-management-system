import { User } from "./User";

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    owner: User;
    visibility?: string;
    createdAt: string;
    updatedAt: string;
};