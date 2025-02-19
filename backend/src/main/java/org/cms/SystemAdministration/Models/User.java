package org.cms.SystemAdministration.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(name = "REF_ID", columnNames = "reference_id"))
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String password;

    @Column(name = "reference_id", unique = true, nullable = false)
    private String referenceId;

    private String imagePath;

    private String birthday;

    private String email;

    private String address;

    private String telephone;

    private Float percentage;

    private Integer status;

    private Integer role;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;
}
