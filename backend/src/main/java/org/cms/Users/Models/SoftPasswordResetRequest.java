package org.cms.Users.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SoftPasswordResetRequest {

    private String currentPassword;

    private String newPassword;
}
