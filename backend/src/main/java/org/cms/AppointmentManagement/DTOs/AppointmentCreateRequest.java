package org.cms.AppointmentManagement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentCreateRequest {

    private Integer patientId;

    private Integer clinicId;

    private Integer doctorId;

    private Integer queuePosition;
}
