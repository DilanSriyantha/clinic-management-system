package org.cms.PatientManagement.Services;

import org.cms.PatientManagement.Models.Patient;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class PatientRecords {

    private List<Patient> patientList;


    public PatientRecords() {
        patientList = new ArrayList<>();

        patientList.add(new Patient(1, 25, "John Doe", "123-456-7890", "john.doe@example.com",
                "123 Main St, City", "Peanuts", "Asthma patient",
                new Timestamp(System.currentTimeMillis()), new Timestamp(System.currentTimeMillis()), 101));

        patientList.add(new Patient(2, 30, "Jane Smith", "987-654-3210", "jane.smith@example.com",
                "456 Elm St, Town", "None", "Diabetic",
                new Timestamp(System.currentTimeMillis()), new Timestamp(System.currentTimeMillis()), 102));

        patientList.add(new Patient(3, 40, "Michael Johnson", "555-123-4567", "michael.j@example.com",
                "789 Oak St, Village", "Pollen", "High blood pressure",
                new Timestamp(System.currentTimeMillis()), new Timestamp(System.currentTimeMillis()), 103));
    }


    public List<Patient> getPatientList() {
        return patientList;
    }
}