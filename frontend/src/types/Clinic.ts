import { Status } from "../enums/Status";

export interface Clinic {
    caption: string;
    description: string;
    doctorUid?: string;
    dayOfWeek: string;
    time: string;
    status?: Status;
    updatedAt?: string;
};