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
public class StockDto {
    
    private Integer id;

    private String caption;

    private String vendor;

    private String date;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
