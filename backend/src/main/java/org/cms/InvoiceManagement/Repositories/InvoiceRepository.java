package org.cms.InvoiceManagement.Repositories;

import java.util.List;

import org.cms.InvoiceManagement.DTOs.SalesSummary;
import org.cms.InvoiceManagement.DTOs.SalesTrendDto;
import org.cms.InvoiceManagement.DTOs.TopSaleDto;
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

    @Query(value = """
        SELECT
            i.date AS saleDate,
            SUM(ir.total) AS totalSales
        FROM
            invoice i
        JOIN
            invoice_record ir ON i.id = ir.invoice_id
        WHERE
            i.date BETWEEN :startDate AND :endDate
        GROUP BY
            i.date
        ORDER BY
            i.date
    """, nativeQuery = true)
    List<SalesTrendDto> getSalesTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        WITH totalSold AS (
            SELECT IFNULL(SUM(ir.quantity), 0) AS totalQuantity
            FROM invoice_record ir
            JOIN invoice inv ON ir.invoice_id = inv.id
            WHERE inv.date BETWEEN :startDate AND :endDate
        ),

        itemSales AS (
            SELECT 
                i.caption AS itemName,
                IFNULL(SUM(ir.quantity), 0) AS qtySold
            FROM invoice_record ir
            JOIN item i ON ir.item_id = i.id
            JOIN invoice inv ON ir.invoice_id = inv.id
            WHERE inv.date BETWEEN :startDate AND :endDate
            GROUP BY i.id, i.caption
        ),

        top5 AS (
            SELECT 
                itemName,
                qtySold
            FROM itemSales
            ORDER BY qtySold DESC
            LIMIT 5
        ),

        otherItems AS (
            SELECT 
                'Other' AS itemName,
                IFNULL(SUM(qtySold), 0) AS qtySold
            FROM itemSales
            WHERE itemName NOT IN (SELECT itemName FROM top5)
        )

        SELECT 
            t.itemName,
            t.qtySold,
            ROUND(IFNULL((t.qtySold / NULLIF(ts.totalQuantity, 0)) * 100, 0), 2) AS percentage
        FROM top5 t, totalSold ts

        UNION ALL

        SELECT 
            o.itemName,
            o.qtySold,
            ROUND(IFNULL((o.qtySold / NULLIF(ts.totalQuantity, 0)) * 100, 0), 2) AS percentage
        FROM otherItems o, totalSold ts;
    """, nativeQuery = true)
    List<TopSaleDto> getTopSalesUpto5(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT 
            IFNULL(SUM(i.subtotal), 0) AS totalRevenue,

            IFNULL((
                SELECT SUM(ir.quantity)
                FROM invoice_record ir
                JOIN invoice inv ON ir.invoice_id = inv.id
                WHERE inv.date BETWEEN :startDate AND :endDate
            ), 0) AS totalItemsSold,

            COUNT(i.id) AS totalInvoicesIssued,

            (
                SELECT p.name
                FROM invoice i2
                JOIN patient p ON i2.patient_id = p.id
                WHERE i2.date BETWEEN :startDate AND :endDate
                GROUP BY p.id
                ORDER BY SUM(i2.subtotal) DESC
                LIMIT 1
            ) AS patientWithHighestRevenue,

            (
                SELECT SUM(i2.subtotal)
                FROM invoice i2
                WHERE i2.date BETWEEN :startDate AND :endDate
                GROUP BY i2.patient_id
                ORDER BY SUM(i2.subtotal) DESC
                LIMIT 1
            ) AS highestRevenue,

            (
                SELECT p.name
                FROM invoice i3
                JOIN patient p ON i3.patient_id = p.id
                WHERE i3.date BETWEEN :startDate AND :endDate
                GROUP BY p.id
                ORDER BY SUM(i3.subtotal) ASC
                LIMIT 1
            ) AS patientWithLowestRevenue,

            (
                SELECT SUM(i3.subtotal)
                FROM invoice i3
                WHERE i3.date BETWEEN :startDate AND :endDate
                GROUP BY i3.patient_id
                ORDER BY SUM(i3.subtotal) ASC
                LIMIT 1
            ) AS lowestRevenue,

            ROUND(AVG(patientRevenue.total), 2) AS avgRevenuePerPatient

        FROM invoice i

        LEFT JOIN (
            SELECT patient_id, SUM(subtotal) AS total
            FROM invoice
            WHERE date BETWEEN :startDate AND :endDate
            GROUP BY patient_id
        ) AS patientRevenue ON i.patient_id = patientRevenue.patient_id

        WHERE i.date BETWEEN :startDate AND :endDate
    """, nativeQuery = true)
    SalesSummary getSalesSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
