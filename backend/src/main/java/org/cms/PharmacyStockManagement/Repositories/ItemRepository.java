package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    
}
