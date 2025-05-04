package org.cms.Users.DTOs;

public interface UserAccountsSummaryDto {
    Long getTotal();
    Long getAdminCount();
    Long getDoctorCount();
    Long getReceptionistCount();
    Long getPharmacistCount();
}
