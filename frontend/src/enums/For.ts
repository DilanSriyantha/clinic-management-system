export enum For {
    ASSIGN_DOCTOR_TO_CLINIC,
    ASSIGN_PATIENTS_TO_CLINIC,
    SELECTING_PATIENT,
    SELECTING_CLINIC,
    SELECTING_PATIENT_FOR_APPOINTMENT,
    CREATING_PATIENT_ON_THE_FLY,
    SELECTING_PATIENT_FOR_INVOICE
};

export namespace For {
    export function valueOf(value: number | string): For | ((value: number | string) => For | typeof valueOf | undefined) | undefined {
        if(typeof value === "string") {
            if(!(value in For)) return undefined;

            return For[value as keyof typeof For];
        }

        if(typeof value === "number") {
            return Object.values(For).includes(value as For) ? value as For : undefined;
        }
    }
};