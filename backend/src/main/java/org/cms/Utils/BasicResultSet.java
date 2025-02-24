package org.cms.Utils;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BasicResultSet {

    private final Integer resultCode;

    private final String message;
}
