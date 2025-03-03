import { Status } from "../enums/Status";
import { User } from "./User";

export interface ClinicDetailsState {
    id: number;
    caption: string;
    description: string;
    doctors: Set<User>;
    dayOfWeek: string;
    time: string;
    status: Status;
    updatedAt: string;
    loading: boolean;
};