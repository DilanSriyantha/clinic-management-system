package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    Page<Item> findAllByStockId(PageRequest pageable, int stockId);
    
    @Query(value = """
        SELECT * FROM item WHERE CONCAT('S', stock_id, '-I', id) = :itemCode
        """, nativeQuery = true)
    Page<Item> findAllByItemCode(PageRequest pageable, @Param("itemCode") String itemCode);
}