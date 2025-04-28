export enum SearchBy {
    REF_ID,
    CLINIC,
    DOCTOR,
    PATIENT_NAME,
    PATIENT_TELEPHONE,
    PATIENT_REF_ID,
    DATE,
    EMAIL,
    NAME,
    TELEPHONE,
    NUMBER,
    CREATOR_NAME,
    CAPTION,
    DOW,
    TIME,
    VENDOR,
    CATEGORY,
    FORM,
    STRENGTH,
};

export namespace SearchBy {
    export function getEndpoint(value: SearchBy): string {
        switch(value) {
            case SearchBy.REF_ID:
                return "/searchByRefId";
            case SearchBy.CLINIC:
                return "/searchByClinic";
            case SearchBy.DOCTOR:
                return "/searchByDoctor";
            case SearchBy.PATIENT_REF_ID:
                return "/searchByPatientRefId";
            case SearchBy.PATIENT_NAME:
                return "/searchByPatientName";
            case SearchBy.PATIENT_TELEPHONE:
                return "/searchByPatientTelephone";
            case SearchBy.DATE:
                return "/searchByDate";
            case SearchBy.EMAIL:
                return "/searchByEmail";
            case SearchBy.NAME:
                return "/searchByName";
            case SearchBy.TELEPHONE:
                return "/searchByTelephone";
            case SearchBy.NUMBER:
                return "/searchByNumber";
            case SearchBy.CREATOR_NAME:
                return "/searchByCreatorName";
            case SearchBy.CAPTION:
                return "/searchByCaption";
            case SearchBy.DOW:
                return "/searchByDayOfWeek";
            case SearchBy.TIME:
                return "/searchByTime";
            case SearchBy.VENDOR:
                return "/searchByVendor";
            case SearchBy.CATEGORY:
                return "/searchByCategory";
            case SearchBy.FORM:
                return "/searchByForm";
            case SearchBy.STRENGTH:
                return "/searchByStrength";
            default:
                return "";
        }
    }
}