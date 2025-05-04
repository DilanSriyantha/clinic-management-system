package org.cms.PatientMangement.DTOs;

public interface PatientRegistrationSummaryDto {
    Long getTotalPatients();
    Long getNewPatientsInPeriod();
    Long getAge50Plus();
    Long getAge25To49();
    Long getAge18To24();
    Long getAge10To17();
    Long getAgeBelow10();
}
