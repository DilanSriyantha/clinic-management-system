package org.cms.Models;

import java.util.Date;

public class Patient {
    private int id;
    private int age;
    private String name;
    private int telephone;
    private String email;
    private String address;
    private String allergiesNote;
    private String description;
    private Date createdAt;
    private Date updatedAt;
    private int referenceId;
//    private List<Prescriptions>  prescriptions;
//    private List<Appointment>  appointments;

    public Patient (int id,int age,String name,int telephone,String email,String address,String allergiesNote,String description,Date createdAt,Date updatedAt,int referenceId){
        this.id = id;
        this.age = age;
        this.name = name;
        this.telephone = telephone;
        this.email = email;
        this.address = address;
        this.allergiesNote = allergiesNote;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.referenceId = referenceId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTelephone() {
        return telephone;
    }

    public void setTelephone(int telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAllergiesNote() {
        return allergiesNote;
    }

    public void setAllergiesNote(String allergiesNote) {
        this.allergiesNote = allergiesNote;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(int referenceId) {
        this.referenceId = referenceId;
    }



}
