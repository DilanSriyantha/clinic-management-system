package org.cms.InvoiceManagement.Repositories;

import org.cms.InvoiceManagement.Models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    
    @Query(value = "SELECT COALESCE(MAX(id), 0) + 1 FROM invoice", nativeQuery = true)
    Integer findNextInvoiceNumber();
}
