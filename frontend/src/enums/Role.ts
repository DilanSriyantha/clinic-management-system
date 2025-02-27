export enum Role {
    ADMIN = 0,
    DOCTOR = 1,
    RECEPTIONIST = 2,
    PHARMACIST = 3
};

export namespace Role {
    export function valueOf(value: string | number): Role | ((value: string | number) => Role | typeof valueOf | undefined) | undefined {
        if(typeof value === 'string'){
            if(!(value in Role)) return undefined;

            return Role[value as keyof typeof Role];
        }

        if(typeof value === 'number'){
            return Object.values(Role).includes(value as Role) ? value as Role : undefined;
        }
    }
};