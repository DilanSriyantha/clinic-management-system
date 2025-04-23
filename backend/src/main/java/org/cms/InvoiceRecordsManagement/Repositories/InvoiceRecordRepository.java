package org.cms.InvoiceRecordsManagement.Repositories;

import org.cms.InvoiceRecordsManagement.Models.InvoiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRecordRepository extends JpaRepository<InvoiceRecord, Integer> {
    
}
