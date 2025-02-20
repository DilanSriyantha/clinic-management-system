package org.cms.Authentication;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthRequest {

    private String referenceId;

    private String password;
}
