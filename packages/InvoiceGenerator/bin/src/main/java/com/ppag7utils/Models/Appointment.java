package com.ppag7utils.Models;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Appointment {
    private Integer id;
    private String referenceId;
    private String patientName;
    private String clinicName;
    private String doctorName;
    private Integer queuePosition;
    private Timestamp updatedAt;
    
    public Appointment() {
    }

    public Appointment(Integer id, String referenceId, String patientName, String clinicName, String doctorName,
            Integer queuePosition, Timestamp updatedAt) {
        this.id = id;
        this.referenceId = referenceId;
        this.patientName = patientName;
        this.clinicName = clinicName;
        this.doctorName = doctorName;
        this.queuePosition = queuePosition;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Integer getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
