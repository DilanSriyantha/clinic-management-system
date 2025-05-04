package org.cms.ClinicManagement.DTOs;

public interface ClinicAppointmentDistributionDto {
    Long getClinicId();
    String getClinicName();
    Long getAppointmentCount();
    Float getAppointmentPercentage();
}
