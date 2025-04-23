package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    Page<Item> findAllByStockId(PageRequest pageable, int stockId);
    Page<Item> findAllByItemCode(PageRequest pageable, String itemCode);
}