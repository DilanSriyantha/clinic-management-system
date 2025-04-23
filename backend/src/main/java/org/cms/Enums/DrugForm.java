package org.cms.Enums;

import java.util.HashMap;
import java.util.Map;

public enum DrugForm {
    TABLET("TAB"),
    CAPSULE("CAP"),
    SYRUP("SYP"),
    SUSPENSION("SUSP"),
    INJECTION("INJ"),
    CREAM("CRM"),
    OINTMENT("OINT"),
    GEL("GEL"),
    SOLUTION("SOL"),
    DROPS("DROPS"),
    LOZENGES("LOZ"),
    POWDER("PWD"),
    SUPPOSITORY("SUPP"),
    SPRAY("SPRAY"),
    TRANSDERMAL_PATCH("PATCH"),
    INHALER("INHL"),
    SHAMPOO("SHAM"),
    MEDICATED_SOAP("SOAP"),
    FOAM("FOAM"),
    MOUTHWASH("MOUTH"),
    TEST_STRIP("STRIP"),
    OTHER("OTH");

    private final String code; 
    private static final Map<String, DrugForm> map = new HashMap<>();

    private DrugForm(String code) {
        this.code = code;
    }

    static {
        for(var form : DrugForm.values())
            map.put(form.code, form);
    }

    public DrugForm formOf(String code) {
        return map.get(code);
    }

    public String code() {
        return this.code;
    }
}
