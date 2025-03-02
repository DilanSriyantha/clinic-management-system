package org.cms.Models;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;


@Getter
@Setter

public class Patient {
    private int id;
    private int age;
    private String name;
    private String telephone;
    private String email;
    private String address;
    private String allergiesNote;
    private String description;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private int referenceId;
//    private List<Prescriptions>  prescriptions;
//    private List<Appointment>  appointments;

    public Patient (int id,int age,String name,String telephone,String email,String address,String allergiesNote,String description,Timestamp createdAt,Timestamp updatedAt,int referenceId){
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


}
