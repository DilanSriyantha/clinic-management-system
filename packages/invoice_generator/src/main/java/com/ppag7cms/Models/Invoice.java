package com.ppag7cms.Models;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Invoice {
    
    private int id;
    private int number;
    private Date date;
    private Float subTotal;
    private String pharmacistName;
    private List<Record> records;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Invoice(int id, int number, Date date, Float subTotal, String pharmacistName, List<Record> records, Timestamp createdAt,
            Timestamp updatedAt) {
        this.id = id;
        this.number = number;
        this.date = date;
        this.subTotal = subTotal;
        this.pharmacistName = pharmacistName;
        this.records = records;
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

    public List<Record> getRecords() {
        return records;
    }

    public void setRecords(List<Record> records) {
        this.records = records;
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

    @Override
    public String toString() {
        List<String> recs = records.stream().map(rec -> "\t" + rec.toString()).collect(Collectors.toList());

        return "Invoice [id=" + id + ",\nnumber=" + number + ",\ndate=" + date + ",\nsubTotal=" + subTotal
                + ",\npharmacistName=" + pharmacistName + ",\nrecords=\n" + String.join("\n", recs) + ",\ncreatedAt=" + createdAt + ",\nupdatedAt=" + updatedAt + "]";
    }
}
