package org.cms.PrescriptionManagement.DTOs;

public interface PrescriptionIssueDistributionDto {
    
    String getDoctorRefId();
    String getDoctorName();
    Long getPrescriptionCount();
    Long getPercentageOfTotal();
}
