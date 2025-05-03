package com.ppag7utils.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Record {

    private int id;
    private String description;
    private float unitPrice;
    private int quantity;
    private float total;

    public Record() {
    }

    public Record(int id, String description, float unitPrice, int quantity, float total) {
        this.id = id;
        this.description = description;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.total = total;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getdescription() {
        return description;
    }

    public void setdescription(String description) {
        this.description = description;
    }

    public float getunitPrice() {
        return unitPrice;
    }

    public void setunitPrice(float unitPrice) {
        this.unitPrice = unitPrice;
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
        return "Record [id=" + id + ", description=" + description + ", unitPrice=" + unitPrice
                + ", quantity=" + quantity + ", total=" + total + "]";
    }
}
