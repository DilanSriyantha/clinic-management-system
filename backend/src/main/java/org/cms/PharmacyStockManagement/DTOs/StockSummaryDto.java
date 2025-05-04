package org.cms.PharmacyStockManagement.DTOs;

public interface StockSummaryDto {
    String getTopVendorName();
    Long getTopVendorStockCount();
    String getFastestMovingItemName();
    Long getFastestMovingItemQty();
    String getSlowestMovingItemName();
    Long getSlowestMovingItemQty();
    Long getLowStockItemCount();
}
