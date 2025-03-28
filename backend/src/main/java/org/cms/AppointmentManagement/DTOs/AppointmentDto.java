package org.cms.AppointmentManagement.DTOs;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDto {

    private Integer id;

    private Integer patientId;

    private String patientName;

    private Integer clinicId;

    private String clinicName;

    private Integer doctorId;

    private String doctorName;

    private Integer queuePosition;

    private String referenceId;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
