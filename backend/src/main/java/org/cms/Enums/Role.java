package org.cms.Enums;

import java.util.HashMap;
import java.util.Map;

public enum Role {
    ADMIN(1),
    DOCTOR(2),
    RECEPTIONIST(3),
    PHARMACIST(4);

    private final int value;
    private static final Map<Integer, Role> map = new HashMap<>();

    private Role(int value) {
        this.value = value;
    }

    static {
        for(Role role : Role.values())
            map.put(role.value, role);
    }

    public static Role valueOf(int value){
        return map.get(value);
    }
}