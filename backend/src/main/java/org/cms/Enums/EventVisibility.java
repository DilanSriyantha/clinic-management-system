package org.cms.Enums;

import java.util.HashMap;
import java.util.Map;

public enum EventVisibility {
    PUBLIC(0),
    PRIVATE(1);

    private final int value;
    private static final Map<Integer, EventVisibility> map = new HashMap<>();

    private EventVisibility(int val) {
        value = val;
    }

    static {
        for(EventVisibility visibility : EventVisibility.values()) 
            map.put(visibility.value, visibility);
    }

    public EventVisibility valueOf(int value) {
        return map.get(value);
    }
}