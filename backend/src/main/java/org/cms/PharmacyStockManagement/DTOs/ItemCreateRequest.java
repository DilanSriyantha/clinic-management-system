package org.cms.PharmacyStockManagement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemCreateRequest {

    private String caption;

    private String description;

    private Integer initialQty;

    private Integer currentQty;

    private Float unitPurchasePrice;

    private Float unitSellingPrice;
}
