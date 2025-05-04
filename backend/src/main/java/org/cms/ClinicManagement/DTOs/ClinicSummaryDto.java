package org.cms.ClinicManagement.DTOs;

public interface ClinicSummaryDto {
    Long getTotalClinics();
    String getClinicWithHighestAvgPatients();
    Double getHighestAvgPatientsPercentage();
    String getClinicWithHighestAvgAppointments();
    Double getHighestAvgAppointmentsPercentage();
    String getBusiestDayOfWeek();
}
