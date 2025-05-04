package org.cms.PharmacyStockManagement.Repositories;

import java.util.List;

import org.cms.PharmacyStockManagement.DTOs.StockArrivalTrendDto;
import org.cms.PharmacyStockManagement.DTOs.StockSummaryDto;
import org.cms.PharmacyStockManagement.DTOs.VendorWiseStockDistDto;
import org.cms.PharmacyStockManagement.Models.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, Integer> {

    @Query(value = "SELECT * FROM stock AS s WHERE s.caption LIKE :caption", nativeQuery = true)
    Page<Stock> searchStockByCaption(Pageable pageable, @Param("caption") String caption);

    @Query(value = "SELECT * FROM stock AS s WHERE s.vendor LIKE :vendor", nativeQuery = true)
    Page<Stock> searchStockByVendor(Pageable pageable, @Param("vendor") String vendor);

    @Query(value = "SELECT * FROM stock AS s WHERE s.date LIKE :date", nativeQuery = true)
    Page<Stock> searchStockByDate(Pageable pageable, @Param("date") String date);

    @Query(value = """
        SELECT
            vendor AS vendorName,
            COUNT(*) AS totalStockItems,
            ROUND(COUNT(*) * 100.0 / (
                SELECT COUNT(*) FROM stock 
                WHERE created_at BETWEEN :startDate AND :endDate
            ), 2) AS stockPercentage
        FROM stock
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY vendor
        ORDER BY totalStockItems DESC
    """, nativeQuery = true)
    List<VendorWiseStockDistDto> getVendorWiseStockDistribution(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT
            date AS stockDate,
            COUNT(*) AS newStockCount
        FROM stock
        WHERE STR_TO_DATE(date, '%Y-%m-%d') BETWEEN :startDate AND :endDate
        GROUP BY date
        ORDER BY STR_TO_DATE(date, '%Y-%m-%d');
    """, nativeQuery = true)
    List<StockArrivalTrendDto> getStockArrivalTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT
            (SELECT vendor
            FROM stock
            WHERE created_at BETWEEN :startDate AND :endDate
            GROUP BY vendor
            ORDER BY COUNT(*) DESC
            LIMIT 1) AS topVendorName,

            (SELECT COUNT(*)
            FROM stock
            WHERE vendor = (
                SELECT vendor
                FROM stock
                WHERE created_at BETWEEN :startDate AND :endDate
                GROUP BY vendor
                ORDER BY COUNT(*) DESC
                LIMIT 1
            )
            AND created_at BETWEEN :startDate AND :endDate) AS topVendorStockCount,

            (SELECT caption
            FROM item
            WHERE current_qty IS NOT NULL
            ORDER BY current_qty ASC
            LIMIT 1) AS fastestMovingItemName,

            (SELECT current_qty
            FROM item
            WHERE current_qty IS NOT NULL
            ORDER BY current_qty ASC
            LIMIT 1) AS fastestMovingItemQty,

            (SELECT caption
            FROM item
            WHERE current_qty IS NOT NULL
            ORDER BY current_qty DESC
            LIMIT 1) AS slowestMovingItemName,

            (SELECT current_qty
            FROM item
            WHERE current_qty IS NOT NULL
            ORDER BY current_qty DESC
            LIMIT 1) AS slowestMovingItemQty,

            (SELECT COUNT(*)
            FROM item
            WHERE current_qty < 20) AS lowStockItemCount
    """, nativeQuery = true)
    StockSummaryDto getStockSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
