package org.cms.AppointmentManagement.Services;

import org.cms.AppointmentManagement.DTOs.AppointmentCreateRequest;
import org.cms.AppointmentManagement.DTOs.AppointmentDto;
import org.cms.AppointmentManagement.Models.Appointment;
import org.cms.AppointmentManagement.Repositories.AppointmentRepository;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;

    private final PatientRepository patientRepository;

    private final UserRepository doctorRepository;

    private final ClinicRepository clinicRepository;

    public Page<AppointmentDto> getPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.findAll(pageable).map(Appointment::toDto);
    }

    public BasicResultSet createAppointment(AppointmentCreateRequest request) {
        var patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new EntityNotFoundException("Patient not found."));

        var doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new EntityNotFoundException("Doctor not found."));

        var clinic = clinicRepository.findById(request.getClinicId())
            .orElseThrow(() -> new EntityNotFoundException("Clinic not found."));

        var appointment = ModelMapper.getInstance().map(request, Appointment.class);

        if(appointment == null) 
            throw new InternalError("Error occurred when mapping AppointmentCreateRequest to Appointment");

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setClinic(clinic);

        appointmentRepository.save(appointment);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Appointment created successfully.")
            .build();
    }

    public BasicResultSet updateAppointment(int appointmentId, AppointmentCreateRequest request) {
        var appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        appointment = ModelMapper.getInstance().map(request, Appointment.class);

        if(appointment == null)
            throw new InternalError("Error occurred when mapping AppointmentCreateRequest to Appointment");

        appointmentRepository.save(appointment);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Appointment updated successfully.")
            .build();
    }

    public BasicResultSet deleteAppointment(int appointmentId) {
        var appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        appointmentRepository.delete(appointment);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Appointment deleted successfully")
            .build();
    }
}
