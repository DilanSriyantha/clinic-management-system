package org.cms.Configurations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private int statusCode;

    private String message;

    public ErrorResponse(String message)
    {
        super();
        this.message = message;
    }
}
