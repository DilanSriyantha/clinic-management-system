package org.cms.PatientMangement.DTOs;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {

    private int id;

    private String name;

    private String referenceId;

    private String birthday;

    private int age;

    private String email;

    private String address;

    private String telephone;
    
    private String allergiesNote;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
