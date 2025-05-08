package org.cms.Enums;

import java.util.HashMap;
import java.util.Map;

public enum DrugCategory {
    ANTIBIOTIC("ANT"),
    ANALGESICS("ANL"),
    ANTIPYRETICS("ANP"),
    VITAMINS_AND_SUPPLIMENTS("VIT"),
    ANTIHISTAMINES("ANH"),
    ANTACIDS("ANTAC"),
    ANTIVIRALS("ANTIV"),
    ANTIFUNGALS("ANTIF"),
    ANTIDIABETICS("ANTID"),
    ANTIHYPERTENSIVES("ANTIH"),
    CENTRAL_NERVOUS_SYSTEM("CNS"),
    CARDIAVASCULAR_DRUGS("CVS"),
    GASTROINTESTINAL_DRUGS("GIT"),
    DERMATOLOGICALS("DER"),
    PEDIATRIC_MEDICINES("PED"),
    OPTHALMIC("EYE"),
    OTIC("EAR"),
    NASAL_PREPARATIONS("NAS"),
    RESPIRATORY_MEDICATIONS("RESP"),
    OBSTETRICS("OBS"),
    VACCINES("VAC"),
    ANESTHETICS("ANA"),
    OTHER("OTH");

    private final String code;
    private static final Map<String, DrugCategory> map = new HashMap<>();

    private DrugCategory(String code) {
        this.code = code;
    }

    static {
        for(var category : DrugCategory.values())
            map.put(category.code, category);
    }

    public DrugCategory categoryOf(String code) {
        return map.get(code);
    }

    public String code() {
        return this.code;
    }
}
