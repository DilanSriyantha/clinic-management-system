package org.cms.AppointmentManagement.Services;

import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.cms.AppointmentManagement.DTOs.AppointmentCreateRequest;
import org.cms.AppointmentManagement.DTOs.AppointmentDto;
import org.cms.AppointmentManagement.DTOs.AppointmentSummaryDto;
import org.cms.AppointmentManagement.DTOs.AppointmentTrendDto;
import org.cms.AppointmentManagement.Models.Appointment;
import org.cms.AppointmentManagement.Repositories.AppointmentRepository;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.Types.BasicResult;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;

    private final PatientRepository patientRepository;

    private final UserRepository doctorRepository;

    private final ClinicRepository clinicRepository;

    private final Function<Appointment, AppointmentDto> rowMapper = (appointment) -> {
        var a = ModelMapper.getInstance().map(appointment, AppointmentDto.class);

            a.setClinicId(appointment.getClinic().getId());
            a.setClinicName(appointment.getClinic().getCaption());
            a.setDoctorId(appointment.getDoctor().getId());
            a.setDoctorName(appointment.getDoctor().getName());
            a.setPatientId(appointment.getPatient().getId());
            a.setPatientName(appointment.getPatient().getName());

            return a;
    };

    public Integer getMaxQueuePosition(int clinicId) {
        return appointmentRepository.findMaxQueuePosition(clinicId);
    }

    public Page<AppointmentDto> getPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.findAll(pageable).map(rowMapper);
    }
    
    public Page<AppointmentDto> searchByRefId(int page, int pageSize, String refId) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByRefId(pageable, "%" + refId + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByClinic(int page, int pageSize, String clinicName) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByClinic(pageable, "%" + clinicName + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByDoctor(int page, int pageSize, String doctorName) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByDoctor(pageable, "%" + doctorName + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByPatientName(int page, int pageSize, String patientName) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByPatientName(pageable, "%" + patientName + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByPatientTelephone(int page, int pageSize, String patientTelephone) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByPatientTelephone(pageable, "%" + patientTelephone + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByPatientRefId(int page, int pageSize, String patientRefId) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByPatientRefId(pageable, "%" + patientRefId + "%").map(rowMapper);
    }

    public Page<AppointmentDto> searchByDate(int page, int pageSize, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return appointmentRepository.searchByDate(pageable, "%" + date + "%").map(rowMapper);
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
        appointment.setReferenceId(appointmentRepository.generateReferenceId());

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

    @Transactional
    public BasicResult deleteBatch(int[] ids) {
        for(int i = 0; i < ids.length; i++) {
            var appointment = appointmentRepository.findById(ids[i])
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

            var patient = patientRepository.findById(appointment.getPatient().getId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

            patient.getAppointments().removeIf(ap -> ap.getId() == appointment.getId());

            patientRepository.save(patient);

            appointmentRepository.delete(appointment);
        }

        return BasicResult.builder()
            .status(200)
            .message("Batch deleted successfuly.")
            .build();
    }

    public List<AppointmentTrendDto> getAppointmentTrend(String startDate, String endDate) {
        return appointmentRepository.getAppointmentTrend(startDate, endDate);
    }

    public AppointmentSummaryDto getAppointmentSummary(String startDate, String endDate) {
        return appointmentRepository.getAppointmentSummary(startDate, endDate);
    }

    private Iterable<Integer> intsToIterable(int[] arr) {
        return () -> Arrays.stream(arr).iterator();
    }
}
