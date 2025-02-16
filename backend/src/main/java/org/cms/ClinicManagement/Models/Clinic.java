package org.cms.ClinicManagement.Models;

import java.util.UUID;

public class Clinic {
    UUID uid;
    String caption;
    String description;
    String doctorUid;
    String dayOfWeek;
    String time;
    int status;
    String dateCreated;

    public Clinic(UUID uid, String caption, String description, String doctorUid, String dayOfWeek, String time, int status, String dateCreated) {
        this.uid = uid;
        this.caption = caption;
        this.description = description;
        this.doctorUid = doctorUid;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
        this.status = status;
        this.dateCreated = dateCreated;
    }

    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDoctorUid() {
        return doctorUid;
    }

    public void setDoctorUid(String doctorUid) {
        this.doctorUid = doctorUid;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }
}
