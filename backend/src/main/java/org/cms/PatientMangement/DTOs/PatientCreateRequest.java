package org.cms.PatientMangement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientCreateRequest {
    
    private String name;

    private String birthday;

    private String email;

    private String address;

    private String telephone;
    
    private String allergiesNote;
}
