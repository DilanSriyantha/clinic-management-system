package org.cms.ClinicManagement.Models;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.cms.Enums.Status;
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
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String caption;

    private String description;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "clinic_doctor",
            joinColumns = @JoinColumn(name = "clinic_id"),
            inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    // inform the json serializer that this entity is the owner of doctors in order to prevent infinite recursion.
    private List<User> doctors = new ArrayList<>();

    private String dayOfWeek;

    private String time;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @UpdateTimestamp
    private Timestamp updatedAt;

    @CreationTimestamp
    private Timestamp createdAt;
}