package org.cms.ClinicManagement.DTOs;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.cms.Enums.Status;
import org.cms.PatientMangement.Models.Patient;
import org.cms.Users.Models.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClinicDto {

    private Integer id;

    private String caption;

    private String description;

    private List<User> doctors = new ArrayList<>();

    private List<Patient> patients = new ArrayList<>();

    private String dayOfWeek;

    private String time;

    private Status status;

    private Timestamp updatedAt;

    private Timestamp createdAt;
}
