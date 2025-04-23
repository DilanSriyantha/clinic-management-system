package org.cms.InvoiceManagement.DTOs;

import java.sql.Date;
import java.util.List;

import org.cms.InvoiceRecordsManagement.DTOs.InvoiceRecordCreateRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceCreateRequest {
    
    private Integer number;

    private Date date;

    private Float subTotal;

    private Integer pharmacistId;

    private List<InvoiceRecordCreateRequest> records;
}
