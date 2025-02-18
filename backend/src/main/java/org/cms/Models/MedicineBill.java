package org.cms.Models;

import javax.swing.*;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.cms.Models.Medicine;

public class MedicineBill {
    private int billId;
    private String medName;
    private int quantity;
    private int price;
    private int totalPrice;
    private Date billDate;

    public MedicineBill(int billId, String medName, int quantity, int price, int totalPrice, Date billDate) {
        this.billId = billId;
        this.medName = medName;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
        this.billDate = billDate;
    }

    public int getBillId() {
        return billId;
    }

    public void setBillId(int billId) {
        this.billId = billId;
    }

    public String getMedName() {
        return medName;
    }

    public void setMedName(String medName) {
        this.medName = medName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getBillDate() {
        return billDate;
    }

    public void setBillDate(Date billDate) {
        this.billDate = billDate;
    }
}
