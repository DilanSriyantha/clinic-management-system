import { Clinic } from "./Clinic";

export interface ClinicListState {
    list: Clinic[],
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    loading: boolean;
};