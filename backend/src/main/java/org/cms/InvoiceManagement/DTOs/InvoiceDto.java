package org.cms.InvoiceManagement.DTOs;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDto {

    private Integer id;

    private Integer number;

    private Date date;

    private Float subTotal;

    private Integer pharmacistId;

    private String pharmacistName;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
