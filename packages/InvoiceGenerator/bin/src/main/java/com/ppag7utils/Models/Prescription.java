package com.ppag7utils.Models;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Prescription {
    private Integer id;
    private String patientName;
    private String doctorName;
    private List<PrescriptionLine> prescriptionLines = new ArrayList<>();
    private Timestamp updatedAt;

    public Prescription() {
    }

    public Prescription(Integer id, String patientName, String doctorName, List<PrescriptionLine> prescriptionLines,
            Timestamp updatedAt) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.prescriptionLines = prescriptionLines;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public List<PrescriptionLine> getPrescriptionLines() {
        return prescriptionLines;
    }

    public void setPrescriptionLines(List<PrescriptionLine> prescriptionLines) {
        this.prescriptionLines = prescriptionLines;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
