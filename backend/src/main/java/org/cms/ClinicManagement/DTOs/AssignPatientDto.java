package org.cms.ClinicManagement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignPatientDto {
    private int clinicId;

    private int[] patientIds;
}
