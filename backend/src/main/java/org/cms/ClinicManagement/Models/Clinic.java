package org.cms.ClinicManagement.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.cms.Enums.Status;
import org.cms.PatientMangement.Models.Patient;
import org.cms.Users.Models.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String caption;

    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    private List<User> doctors = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    private List<Patient> patients = new ArrayList<>();

    private String dayOfWeek;

    private String time;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @UpdateTimestamp
    private Timestamp updatedAt;

    @CreationTimestamp
    private Timestamp createdAt;
}