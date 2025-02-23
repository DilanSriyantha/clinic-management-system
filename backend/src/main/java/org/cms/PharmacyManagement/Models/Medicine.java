package org.cms.PharmacyManagement.Models;

import java.util.Date;


public class Medicine {
    private int medId;
    private String medName;
    private String compName;
    private String phnNum;
    private int price;
    private int quantity;
    private Date expDate;
    private String storeLoc;

    public Medicine(int medId, String medName, String compName, String phnNum, int price, int quantity, Date expDate, String storeLoc) {
        this.medId = medId;
        this.medName = medName;
        this.compName = compName;
        this.phnNum = phnNum;
        this.price = price;
        this.quantity = quantity;
        this.expDate = expDate;
        this.storeLoc = storeLoc;
    }

    public int insert(){
        return medId;
    }

    public void update(){

    }

    public void delete(){
        //DBManager.delete("medicine","medId=" + this.medId);
    }

    public int getMedId() {
        return medId;
    }

    public void setMedId(int medId) {
        this.medId = medId;
    }

    public String getMedName() {
        return medName;
    }

    public void setMedName(String medName) {
        this.medName = medName;
    }

    public String getCompName() {
        return compName;
    }

    public void setCompName(String compName) {
        this.compName = compName;
    }

    public String getPhnNum() {
        return phnNum;
    }

    public void setPhnNum(String phnNum) {
        this.phnNum = phnNum;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Date getExpDate() {
        return expDate;
    }

    public void setExpDate(Date expDate) {
        this.expDate = expDate;
    }

    public String getStoreLoc() {
        return storeLoc;
    }

    public void setStoreLoc(String storeLoc) {
        this.storeLoc = storeLoc;
    }
}
