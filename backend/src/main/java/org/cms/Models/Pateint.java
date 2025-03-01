package org.cms.Models;

import java.util.Date;
import java.util.LinkedList;

public class Pateint {
    private int pateintID;
    private String pateintName;
    private int pateintContactNumber;
    private String pateintGmail;
    private String pateintAddress;
    private LinkedList<String>pateintAllergies;
    private LinkedList<String> pateintDiscription;
    private Date registeredDate;

    public Pateint(){}


    public int getPateintID() {
        return pateintID;
    }

    public void setPateintID(int pateintID) {
        this.pateintID = pateintID;
    }

    public String getPateintName() {
        return pateintName;
    }

    public void setPateintName(String pateintName) {
        this.pateintName = pateintName;
    }

    public int getPateintContactNumber() {
        return pateintContactNumber;
    }

    public void setPateintContactNumber(int pateintContactNumber) {
        this.pateintContactNumber = pateintContactNumber;
    }

    public String getPateintGmail() {
        return pateintGmail;
    }

    public void setPateintGmail(String pateintGmail) {
        this.pateintGmail = pateintGmail;
    }

    public String getPateintAddress() {
        return pateintAddress;
    }

    public void setPateintAddress(String pateintAddress) {
        this.pateintAddress = pateintAddress;
    }

    public LinkedList<String> getPateintAllergies() {
        return pateintAllergies;
    }

    public void setPateintAllergies(LinkedList<String> pateintAllergies) {
        this.pateintAllergies = pateintAllergies;
    }

    public LinkedList<String> getPateintDiscription() {
        return pateintDiscription;
    }

    public void setPateintDiscription(LinkedList<String> pateintDiscription) {
        this.pateintDiscription = pateintDiscription;
    }

    public Date getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(Date registeredDate) {
        this.registeredDate = registeredDate;
    }
}
