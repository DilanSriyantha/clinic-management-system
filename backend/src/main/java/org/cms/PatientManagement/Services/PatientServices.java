package org.cms.PatientManagement.Services;

import org.cms.PatientManagement.Models.Patient;

import java.sql.Timestamp;
import java.util.Iterator;
import java.util.List;

public class PatientServices {
    PatientRecords patientRecords = new PatientRecords();
    private final List<Patient> patientsList = patientRecords.getPatientList();
    private int firstId = 1000;

    public void addPatient(int age, String name, String telephone, String email, String address, String allergiesNote, String description, Timestamp createdAt,int referenceId){
        //when frist adding upadated date = created date
        Timestamp updatedAt = createdAt;

        //id creation
        int id =+ firstId;
        firstId++;


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

    public Patient findPatientById(int id){

        Iterator<Patient> iterator = patientsList.iterator();

        while(iterator.hasNext()){

            Patient patient = iterator.next();
            if(patient.getId() == id){
                return patient;
            }
        }
        return null;
    }

    public Patient findPatientByName(String Name){

        Iterator<Patient> iterator = patientsList.iterator();

        while(iterator.hasNext()){

            Patient patient = iterator.next();
            if(patient.getName() == Name){
                return patient;
            }
        }
        return null;
    }
}
