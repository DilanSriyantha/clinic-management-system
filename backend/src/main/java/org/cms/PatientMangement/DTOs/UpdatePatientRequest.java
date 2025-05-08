package org.cms.PatientMangement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePatientRequest {
    
    private String name;

    private String email;

    private String birthday;

    private String telephone;
    
    private String address;

    private String allergiesNote;
}
