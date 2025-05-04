package org.cms.InvoiceManagement.DTOs;

public interface SalesSummary {
    Double getTotalRevenue();
    Long getTotalItemsSold();
    Long getTotalInvoicesIssued();
    String getPatientWithHighestRevenue();
    Double getHighestRevenue();
    String getPatientWithLowestRevenue();
    Double getLowestRevenue();
    Double getAvgRevenuePerPatient();
}
