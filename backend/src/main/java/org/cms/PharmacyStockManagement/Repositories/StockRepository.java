package org.cms.PharmacyStockManagement.Repositories;

import org.cms.PharmacyStockManagement.Models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Integer> {
    
}
