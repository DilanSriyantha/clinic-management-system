package org.cms.ClinicManagement.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.cms.ClinicManagement.DTOs.AssignDoctorDto;
import org.cms.ClinicManagement.DTOs.AssignPatientDto;
import org.cms.ClinicManagement.DTOs.ClinicDto;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.Enums.Status;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.Users.DTOs.UserDto;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;

    private final UserRepository userRepository;

    private final PatientRepository patientRepository;

    private final Function<Clinic, ClinicDto> rowMapper = (clinic) -> {
        var c = ModelMapper.getInstance().map(clinic, ClinicDto.class);

        var doctorDtos = StreamSupport.stream(getDoctorsByClinic(clinic.getId()).spliterator(), false).collect(Collectors.toList()).stream().map((doc) -> ModelMapper.getInstance().map(doc, UserDto.class)).collect(Collectors.toList());

        c.setDoctors(doctorDtos);

        return c;
    };

    public Iterable<Clinic> getAll() {
        return clinicRepository.findAll();
    }

    public ClinicDto get(int clinicId) {
        var clinic = clinicRepository.findById(clinicId).map(rowMapper)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));

        var doctors = clinic.getDoctors();
        System.out.println(doctors.size());

        return clinic;
    }

    public Iterable<User> getDoctorsByClinic(int clinicId) {
        var clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));

        return clinic.getDoctors();
    }

    public Page<ClinicDto> getPage(int page, int pageSize, HttpServletResponse response) {
        var pageable = PageRequest.of(page, pageSize);
        
        return clinicRepository.findAll(pageable).map(rowMapper);
    }

    public Page<ClinicDto> searchByCaption(int page, int pageSize, String caption) {
        var pageable = PageRequest.of(page, pageSize);

        return clinicRepository.searchByCaption(pageable, "%" + caption + "%").map(rowMapper);
    }

    public Page<ClinicDto> searchByDOW(int page, int pageSize, String dow) {
        var pageable = PageRequest.of(page, pageSize);

        return clinicRepository.searchByDOW(pageable, "%" + dow + "%").map(rowMapper);
    }

    public Page<ClinicDto> searchByTime(int page, int pageSize, String time) {
        var pageable = PageRequest.of(page, pageSize);

        return clinicRepository.searchByTime(pageable, "%" + time + "%").map(rowMapper);
    }

    public Page<ClinicDto> searchByDoctorName(int page, int pageSize, String doctorName) {
        var pageable = PageRequest.of(page, pageSize);

        return clinicRepository.searchByDoctorName(pageable, "%" + doctorName + "%").map(rowMapper);
    }

    public Clinic create(Clinic clinic) {
        System.out.println(clinic.toString());
        clinic.setStatus(Status.ACTIVE);

        return clinicRepository.save(clinic);
    }

    public BasicResultSet assignDoctor(AssignDoctorDto assignDoctorDto) {
        var clinic = clinicRepository.findById(assignDoctorDto.getClinicId())
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));

        var doctor = userRepository.findById(assignDoctorDto.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        clinic.getDoctors().add(doctor);

        System.out.println("doctors count : " + clinic.getDoctors().size());

        clinicRepository.save(clinic);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Doctor assigned successfully.")
                .build();
    }

    public BasicResultSet dissmissDoctor(AssignDoctorDto dismissDoctorDto) {
        var clinic = clinicRepository.findById(dismissDoctorDto.getClinicId())
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));

        var doctor = userRepository.findById(dismissDoctorDto.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        clinic.getDoctors().removeIf(user -> user.getId() == doctor.getId());

        System.out.println("doctors count : " + clinic.getDoctors().size());

        clinicRepository.save(clinic);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Doctor dismissed successfully")
                .build();
    }

    @Transactional
    public BasicResultSet assignPatients(AssignPatientDto assignPatientDto) {
        var clinic = clinicRepository.findById(assignPatientDto.getClinicId())
                .orElseThrow(() -> new EntityNotFoundException("clinic not found"));

        for(int patientId : assignPatientDto.getPatientIds()) {
                var patient = patientRepository.findById(patientId)
                        .orElseThrow(() -> new EntityNotFoundException("patient not found"));
                clinic.getPatients().add(patient);
        }
        
        clinicRepository.save(clinic);
            
        return BasicResultSet.builder()
                .resultCode(200)
                .message("Patient assigned successfully")
                .build();
    }

    @Transactional
    public BasicResultSet dismissPatients(AssignPatientDto dismissPatientDto) {
        var clinic = clinicRepository.findById(dismissPatientDto.getClinicId())
                .orElseThrow(() -> new EntityNotFoundException("clinic not found"));

        for(int patientId : dismissPatientDto.getPatientIds())
                clinic.getPatients().removeIf((p) -> p.getId() == patientId);

        clinicRepository.save(clinic);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Patient dismissed successfully.")
                .build();
    }

    public BasicResultSet delete(int id) {
        var clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));

        clinicRepository.delete(clinic);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Clinic deleted successfully")
                .build();
    }
}
