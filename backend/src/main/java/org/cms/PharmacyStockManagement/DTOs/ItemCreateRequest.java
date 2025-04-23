package org.cms.PharmacyStockManagement.DTOs;

import org.cms.Enums.DrugCategory;
import org.cms.Enums.DrugForm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemCreateRequest {

    private Integer stockId;

    private String caption;

    private String description;

    private DrugCategory category;

    private DrugForm form;

    private Integer initialQty;

    private Integer currentQty;

    private Float unitPurchasePrice;

    private Float unitSellingPrice;
}
