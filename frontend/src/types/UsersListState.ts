import { GridRowId } from "@mui/x-data-grid";
import { Role } from "../enums/Role";
import { User } from "./User";

export interface UsersListState {
    role: Role;
    selectedIds: Set<GridRowId>;
    list: User[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
};