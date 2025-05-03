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

    private Float subtotal;

    private Float discount;

    private Float paidAmount;

    private Float balance;

    private Integer pharmacistId;

    private Integer patientId;

    private List<InvoiceRecordCreateRequest> records;
}
