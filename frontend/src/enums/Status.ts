export enum Status {
    ACTIVE = 0,
    INACTIVE = 1
};

export namespace Status {
    export function valueOf(value: string | number): Status | ((value: string | number) => Status | typeof valueOf | undefined) | undefined {
        if (typeof value === 'string'){
            if(!(value in Status)) return undefined;
    
            return Status[value as keyof typeof Status];
        }

        if(typeof value === 'number'){
            return Object.values(Status).includes(value as Status) ? value as Status : undefined;
        }
    }
};