package org.cms.InvoiceRecordsManagement.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceRecordCreateRequest {

    private Integer invoiceId;

    private Integer invoiceNumber;

    private Integer itemId;

    private Integer quantity;

    private Float total;
}
