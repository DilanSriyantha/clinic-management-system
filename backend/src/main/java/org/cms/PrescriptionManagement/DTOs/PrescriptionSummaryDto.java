package org.cms.PrescriptionManagement.DTOs;

public interface PrescriptionSummaryDto {
    Long getTotalPrescriptions();
    Long getPrescriptionsInPeriod();
    Long getAvgItemsPerPrescription();
}
