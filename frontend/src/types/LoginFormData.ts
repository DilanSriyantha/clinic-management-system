import { instanceOf } from "../utils/TypeChecker";

export interface LoginFormData {
    email: string | null;
    password: string | null;
};

export const isLoginFormData = (object: any): object is LoginFormData => {
    return instanceOf<LoginFormData>(object, ["email", "password"]);
}