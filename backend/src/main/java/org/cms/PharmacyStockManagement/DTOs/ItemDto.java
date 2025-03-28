package org.cms.PharmacyStockManagement.DTOs;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemDto {

    private Integer id;

    private String caption;

    private String description;

    private Integer initialQty;

    private Integer currentQty;

    private Float unitPurchasePrice;

    private Float unitSellingPrice;

    private Timestamp createdAt;

    private Timestamp updateAt;
}
