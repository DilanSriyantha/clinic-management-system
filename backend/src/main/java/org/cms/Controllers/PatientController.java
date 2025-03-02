package org.cms.Controllers;


import org.cms.Models.Patient;
import org.cms.Services.PatientRecords;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class PatientController {

    PatientRecords patientRecords = new PatientRecords();
    private List<Patient> patientsList = patientRecords.getPatientList();
    private  int firstId = 1000;

    public void addPatient(int age, String name, String telephone, String email, String address, String allergiesNote, String description, Timestamp createdAt){
        //when frist adding upadated date = created date
        Timestamp updatedAt = createdAt;

        //id creation
        int id =+ firstId;
        firstId++;

        //refernce id nee to get
        int referenceId = 0;

        Patient patient = new Patient(id,age,name,telephone,email,address,allergiesNote,description,createdAt,updatedAt,referenceId);
        patientsList.add(patient);

        System.out.println("New patient add to system " + patient.getName()+" " + patient.getId());
    }


    public void removePatientByName(String name){
        Iterator<Patient> iterator = patientsList.iterator();

        while(iterator.hasNext()){
            Patient patient = iterator.next();

            if(patient.getName() == name){
                iterator.remove();;
                System.out.println("Patient has been removed " + patient.getName());
                return;
            }

        }
        System.out.println("Patient has not been found!");
    }

    public void removePatientById(int id){
        Iterator<Patient> iterator = patientsList.iterator();

        while(iterator.hasNext()){
            Patient patient = iterator.next();

            if(patient.getId() == id){
                iterator.remove();;
                System.out.println("Patient has been removed " + patient.getId());
                return;
            }

        }
        System.out.println("Patient has not been found!");
    }

    public void updatePatient(int id,int age, String name, String telephone, String email, String address, String allergiesNote, String description){

        Timestamp updatedAt = new Timestamp(System.currentTimeMillis());

        Iterator<Patient> iterator = patientsList.iterator();

        while(iterator.hasNext()){
            Patient patient = iterator.next();

            if(patient.getId() == id){

                patient.setAge(age);
                patient.setName(name);
                patient.setTelephone(telephone);
                patient.setEmail(email);
                patient.setAddress(address);
                patient.setAllergiesNote(allergiesNote);
                patient.setDescription(description);
                patient.setUpdatedAt(updatedAt);

                System.out.println("Patient has been Updated" + patient.getId());
                return;
            }

        }
        System.out.println("Patient has not been found!");
    }

}
