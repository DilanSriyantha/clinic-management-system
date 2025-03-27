package org.cms.PatientMangement.Models;

import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.List;

import org.cms.ClinicManagement.Models.Clinic;
import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PrescriptionManagement.Models.Prescription;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@Table(
    name = "patient",
    uniqueConstraints = 
        @UniqueConstraint(columnNames = {"reference_id", "email"})
)
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "reference_id", unique = true, nullable = false)
    private String referenceId;

    private String birthday;

    @Formula("(YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - " +
            "(DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d')))")
    private Integer age;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    private String address;

    private String telephone;
    
    private String allergiesNote;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prescription> prescriptions;

    @ManyToMany(mappedBy = "patients")
    private List<Clinic> clinics;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;

    public void update(PatientDto patientDto) throws Exception {
        Field[] currentFields = this.getClass().getDeclaredFields();
        Field[] newFields = patientDto.getClass().getDeclaredFields();

        for(var newField : newFields) {
            for(var currentField : currentFields) {
                if(!currentField.getName().equals(newField.getName())) continue;

                currentField.setAccessible(true);
                newField.setAccessible(true);
                currentField.set(this, newField.get(patientDto));
            }
        }
    }

    @Override
    public String toString() {
        return "{" + "id: " + id + ", name: " + name + ", reference_id: " + referenceId + ", birthday: " + birthday + ", age: " + age + ", email: " + email + ", address: " + address + ", telephone: " + telephone + ", allergiesNote: " + allergiesNote + ", createdAt: " + createdAt + ", updatedAt: " + updatedAt + "}";
    }
}
