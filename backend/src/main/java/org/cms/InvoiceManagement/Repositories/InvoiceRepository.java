package org.cms.InvoiceManagement.Repositories;

import org.cms.InvoiceManagement.Models.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query(value = "SELECT COALESCE(MAX(id), 0) + 1 FROM invoice", nativeQuery = true)
    Integer findNextInvoiceNumber();

    @Query(value = """
            SELECT * FROM (
                SELECT
                    i.id,
                    i.created_at,
                    i.date,
                    i.number,
                    i.sub_total,
                    i.updated_at,
                    p.id AS pharmacist_id,
                    p.name AS pharmacist_name
                FROM invoice i
                INNER JOIN user p ON p.id = i.pharmacist_id
            ) AS t WHERE t.number=:number
            """, nativeQuery = true)
    Page<Invoice> searchByNumber(Pageable pageable, @Param("number") String number);

    @Query(value = """
            SELECT * FROM (
                SELECT
                    i.id,
                    i.created_at,
                    i.date,
                    i.number,
                    i.sub_total,
                    i.updated_at,
                    p.id AS pharmacist_id,
                    p.name AS pharmacist_name
                FROM invoice i
                INNER JOIN user p ON p.id = i.pharmacist_id
            ) AS t WHERE t.date LIKE :date
            """, nativeQuery = true)
    Page<Invoice> searchByDate(Pageable pageable, @Param("date") String date);

    @Query(value = """
            SELECT * FROM (
                SELECT
                    i.id,
                    i.created_at,
                    i.date,
                    i.number,
                    i.sub_total,
                    i.updated_at,
                    p.id AS pharmacist_id,
                    p.name AS pharmacist_name
                FROM invoice i
                INNER JOIN user p ON p.id = i.pharmacist_id
            ) AS t WHERE t.pharmacist_name LIKE :creatorName
            """, nativeQuery = true)
    Page<Invoice> searchByCreatorName(Pageable pageable, @Param("creatorName") String creatorName);
}
