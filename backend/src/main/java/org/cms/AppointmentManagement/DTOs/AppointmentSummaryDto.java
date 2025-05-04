package org.cms.AppointmentManagement.DTOs;

public interface AppointmentSummaryDto {
    Long getTotalAppointments();
    Double getAverageAppointmentsPerDay();
    String getDateWithHighestAppointments();
    String getTopPatientName();
    Long getTotalAppointmentsForTopPatient();
}
