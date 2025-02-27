package org.cms.Enums;

import java.util.HashMap;
import java.util.Map;

public enum Status {
    ACTIVE(0),
    INACTIVE(1);

    private final int value;
    private static final Map<Integer, Status> map = new HashMap<>();

    private Status(int value) {
        this.value = value;
    }

    static {
        for(Status status : Status.values())
            map.put(status.value, status);
    }

    public static Status valueOf(int value) {
        return map.get(value);
    }

    private int getValue() {
        return value;
    }
}
