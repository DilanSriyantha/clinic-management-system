package org.cms.PharmacyStockManagement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockCreateRequest {
    
    private String caption;

    private String vendor;

    private String date;
}
