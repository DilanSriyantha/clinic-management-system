package org.cms.PatientMangement.DTOs;

import java.sql.Timestamp;

import org.cms.PatientMangement.Models.Patient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private String name;

    private String birthday;

    private String email;

    private String address;

    private String telephone;
    
    private String allergiesNote;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    public Patient toPatient() {
        return Patient.builder()
            .name(name)
            .birthday(birthday)
            .email(email)
            .address(address)
            .telephone(telephone)
            .allergiesNote(allergiesNote)
            .createdAt(createdAt)
            .updatedAt(updatedAt)
            .build();
    } 
}
