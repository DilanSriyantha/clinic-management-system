package com.ppag7cms.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Record {
    
    private int id;
    private String itemCaption;
    private float itemSellingPrice;
    private int quantity;
    private float total;
    
    public Record() {
    }

    public Record(int id, String itemCaption, float itemSellingPrice, int quantity, float total) {
        this.id = id;
        this.itemCaption = itemCaption;
        this.itemSellingPrice = itemSellingPrice;
        this.quantity = quantity;
        this.total = total;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getItemCaption() {
        return itemCaption;
    }

    public void setItemCaption(String itemCaption) {
        this.itemCaption = itemCaption;
    }

    public float getItemSellingPrice() {
        return itemSellingPrice;
    }

    public void setItemSellingPrice(float itemSellingPrice) {
        this.itemSellingPrice = itemSellingPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "Record [id=" + id + ", itemCaption=" + itemCaption + ", itemSellingPrice=" + itemSellingPrice
                + ", quantity=" + quantity + ", total=" + total + "]";
    }
}
