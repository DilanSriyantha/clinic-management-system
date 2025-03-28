package org.cms.AppointmentManagement.Models;

import java.sql.Timestamp;

import org.cms.AppointmentManagement.DTOs.AppointmentDto;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.PatientMangement.Models.Patient;
import org.cms.Users.Models.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@Table(name = "appointment", uniqueConstraints = @UniqueConstraint(columnNames = { "reference_id" }))
@AllArgsConstructor
@NoArgsConstructor
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Clinic clinic;

    @ManyToOne
    private User doctor;

    private Integer queuePosition;

    @Column(name = "reference_id", unique = true, nullable = false)
    private String referenceId;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;

    public static AppointmentDto toDto(Appointment appointment) {
        return AppointmentDto.builder()
            .id(appointment.getId())
            .patientId(appointment.getPatient().getId())
            .patientName(appointment.getPatient().getName())
            .clinicId(appointment.getClinic().getId())
            .clinicName(appointment.getClinic().getCaption())
            .doctorId(appointment.getDoctor().getId())
            .doctorName(appointment.getDoctor().getName())
            .queuePosition(appointment.getQueuePosition())
            .referenceId(appointment.getReferenceId())
            .createdAt(appointment.getCreatedAt())
            .updatedAt(appointment.getUpdatedAt())
            .build();
    }
}
