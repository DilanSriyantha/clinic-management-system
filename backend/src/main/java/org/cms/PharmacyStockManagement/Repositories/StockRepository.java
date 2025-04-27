package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, Integer> {

    @Query(value = """
            SELECT * FROM stock AS s WHERE s.caption LIKE :caption
            """, nativeQuery = true)
    Page<Stock> searchStockByCaption(Pageable pageable, @Param("caption") String caption);

    @Query(value = """
            SELECT * FROM stock AS s WHERE s.vendor LIKE :vendor
            """, nativeQuery = true)
    Page<Stock> searchStockByVendor(Pageable pageable, @Param("vendor") String vendor);

    @Query(value = """
            SELECT * FROM stock AS s WHERE s.date LIKE :date
            """, nativeQuery = true)
    Page<Stock> searchStockByDate(Pageable pageable, @Param("date") String date);
}
