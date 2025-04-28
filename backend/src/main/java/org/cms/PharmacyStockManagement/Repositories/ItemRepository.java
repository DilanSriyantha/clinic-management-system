package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    
    Page<Item> findAllByStockId(PageRequest pageable, int stockId);
    Page<Item> findAllByItemCode(PageRequest pageable, String itemCode);

    @Query(value = "SELECT * FROM item AS i WHERE i.caption LIKE :caption", nativeQuery = true)
    Page<Item> searchItemByCaption(Pageable pageable, @Param("caption") String caption);

    @Query(value = "SELECT * FROM item AS i WHERE i.category LIKE :category", nativeQuery = true)
    Page<Item> searchItemByCategory(Pageable pageable, @Param("category") String category);

    @Query(value = "SELECT * FROM item AS i WHERE i.form LIKE :form", nativeQuery = true)
    Page<Item> searchItemByForm(Pageable pageable, @Param("form") String form);

    @Query(value = "SELECT * FROM item AS i WHERE i.strength LIKE :strength", nativeQuery = true)
    Page<Item> searchItemByStrength(Pageable pageable, @Param("strength") String strength);
}