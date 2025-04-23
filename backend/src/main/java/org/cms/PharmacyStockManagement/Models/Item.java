package org.cms.PharmacyStockManagement.Models;

import java.sql.Timestamp;

import org.cms.Enums.DrugCategory;
import org.cms.Enums.DrugForm;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

    @Column(unique = true)
    private String itemCode;

    private String caption;

    private String description;

    private Integer strength;

    @Enumerated(value = EnumType.STRING)
    private DrugCategory category;

    @Enumerated(value = EnumType.STRING)
    private DrugForm form;

    private Integer initialQty;

    private Integer currentQty;

    private Float unitPurchasePrice;

    private Float unitSellingPrice;

    @ManyToOne
    private Stock stock;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updateAt;

    @PrePersist
    @PreUpdate
    public void generateItemCode() {
        this.itemCode = String.format("%s-%s-%d-%s-%d", category.code(), caption.toUpperCase().substring(0, 3), strength, form.code(), id);
    }
}
