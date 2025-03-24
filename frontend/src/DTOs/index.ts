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
        var patientDto: PatientDto = {
            name: "",
            birthday: "",
            address: "",
            email: "",
            telephone: "",
            allergiesNote: "",
        };
        
        const keys = Object.keys(object);
        for(var i = 0; i < keys.length; i++) {
            console.log(keys[i], object[keys[i]]);
            if(keys[i] in patientDto)
                patientDto[keys[i] as keyof PatientDto] = object[keys[i]];
        }

        console.log(patientDto);

        return patientDto;
    }
}