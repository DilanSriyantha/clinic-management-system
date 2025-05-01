package com.ppag7cms.Models;

import java.sql.Date;
import java.sql.Timestamp;

public class Invoice {
    
    private int id;
    private int number;
    private Date date;
    private Float subTotal;
    private String pharmacistName;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Invoice(int id, int number, Date date, Float subTotal, String pharmacistName, Timestamp createdAt,
            Timestamp updatedAt) {
        this.id = id;
        this.number = number;
        this.date = date;
        this.subTotal = subTotal;
        this.pharmacistName = pharmacistName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Invoice() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Float getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Float subTotal) {
        this.subTotal = subTotal;
    }

    public String getPharmacistName() {
        return pharmacistName;
    }

    public void setPharmacistName(String pharmacistName) {
        this.pharmacistName = pharmacistName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
