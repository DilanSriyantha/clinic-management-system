package org.cms.Authentication;

import lombok.Builder;
import lombok.Data;
import org.cms.Users.Models.User;

@Data
@Builder
public class AuthResponse {

    private String token;

    private User user;
}
