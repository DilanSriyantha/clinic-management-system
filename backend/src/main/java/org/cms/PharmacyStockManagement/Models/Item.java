package org.cms.PharmacyStockManagement.Models;

import java.sql.Timestamp;

import org.cms.PharmacyStockManagement.DTOs.ItemDto;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    
    @Id
    @GeneratedValue
    private Integer id;

    private String caption;

    private String description;

    private Integer initialQty;

    private Integer currentQty;

    private Float unitPurchasePrice;

    private Float unitSellingPrice;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updateAt;

    public static ItemDto toDto(Item item) {
        return ItemDto.builder()
            .id(item.id)
            .caption(item.caption)
            .description(item.description)
            .initialQty(item.initialQty)
            .currentQty(item.currentQty)
            .unitPurchasePrice(item.unitPurchasePrice)
            .unitSellingPrice(item.unitSellingPrice)
            .createdAt(item.createdAt)
            .updateAt(item.updateAt)
            .build();
    }
}
