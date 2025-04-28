package org.cms.Users.DTOs;

import java.sql.Timestamp;

import org.cms.Enums.Role;
import org.cms.Enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    
    private Integer id;

    private String name;

    private String birthday;

    private String address;

    private String referenceId;

    private String email;

    private String telephone;

    private String specialization;

    private float percentage;

    private Status status;

    private Role role;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
