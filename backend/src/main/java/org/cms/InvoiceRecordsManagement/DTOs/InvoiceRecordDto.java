package org.cms.InvoiceRecordsManagement.DTOs;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceRecordDto {
    
    private Integer id;

    private Integer invoiceId;

    private Integer invoiceNumber;

    private Integer itemId;

    private String itemCaption;

    private Float itemSellingPrice;

    private Integer quantity;

    private Float total;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
