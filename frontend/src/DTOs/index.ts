import { GridRowId } from "@mui/x-data-grid";

export interface AssignDoctorDto {
    clinicId: number;
    doctorId: GridRowId;
};

export interface PatientDto {
    name: string;
    birthday: string;
    address: string;
    email: string;
    telephone: string;
    allergiesNote: string;
};

export namespace PatientDto {
    export function from(object: any): PatientDto {
        var patientDto: PatientDto = {} as PatientDto;
        
        const keys = Object.keys(object);
        for(var i = 0; i < keys.length; i++) {
            if(keys[i] in patientDto)
                patientDto[keys[i] as keyof typeof patientDto] = object[keys[i]];
        }

        return patientDto;
    }
}