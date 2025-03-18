package org.cms.PatientManagement.Controllers;

import org.cms.PatientManagement.Models.Patient;
import org.cms.PatientManagement.Services.PatientService;

import java.sql.Timestamp;
import java.util.List;

public class PatientController {

    private final PatientService patientService = new PatientService();

    public void addPatient(int age, String name, String telephone, String email, String address, String allergiesNote, String description, Timestamp createdAt, int referenceId){
        patientService.addPatient(age, name, telephone, email, address, allergiesNote, description, createdAt, referenceId);
    }
    public void removePatientByName(String name){
        patientService.removePatientByName(name);
    }
    public void removePatientById(int id){
        patientService.removePatientById(id);
    }

    public void updatePatient(int id,int age, String name, String telephone, String email, String address, String allergiesNote, String description, Timestamp createdAt, int referenceId){
        patientService.updatePatient(id, age, name, telephone, email, address, allergiesNote, description);
    }

    public Patient findPatientById(int id){
      return   patientService.findPatientById(id);
    }
    public Patient findPatientByName(String Name){
        return  patientService.findPatientByName(Name);
    }

   public Patient create(Patient patientDto) {
        return patientService.create(patientDto);
   }

    public boolean delete(int id) {
        return patientService.delete(id);
    }

//    public List<Prescriptions> getPrescriptions(int id) {
//        return patientService.getPrescriptions(id);
//    }
}
