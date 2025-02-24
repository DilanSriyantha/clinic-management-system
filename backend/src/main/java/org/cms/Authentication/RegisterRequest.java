package org.cms.Authentication;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;
import org.cms.Enums.Role;

@Data
@Builder
public class RegisterRequest {

    private String name;

    private String password;

    private String referenceId;

    private String imagePath;

    private String birthday;

    private String email;

    private String address;

    private String telephone;

    private Float percentage;

    @Enumerated(value = EnumType.ORDINAL)
    private Role role;

    private String specialization;
}
