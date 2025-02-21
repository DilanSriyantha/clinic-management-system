import { Role } from "../enums/Role";
import { instanceOf } from "../utils/TypeChecker"

export interface RegisterFormData {
    name: string | null;
    birthday: string | null;
    address: string | null;
    email: string | null;
    password: string | null;
    telephone: string | null;
    specialization: string | null;
    percentage: number | null;
    role: Role | null;
};

export const isRegisterFormData = (object: any): object is RegisterFormData => {
    return instanceOf<RegisterFormData>(object, []);
}