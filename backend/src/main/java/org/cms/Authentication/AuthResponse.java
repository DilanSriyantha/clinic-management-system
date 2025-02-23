package org.cms.Authentication;

import lombok.Builder;
import lombok.Data;
import org.cms.Users.Models.User;

@Data
@Builder
public class AuthResponse {

    private String accessToken;

    private String refreshToken;

    private User user;
}
