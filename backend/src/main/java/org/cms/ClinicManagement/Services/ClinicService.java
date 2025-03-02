package org.cms.ClinicManagement.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.cms.ClinicManagement.DTOs.AssignDoctorDto;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.Enums.Status;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;

    private final UserRepository userRepository;

    public Iterable<Clinic> getAll() {
        return clinicRepository.findAll();
    }

    public Clinic get(int clinicId) {
        var clinic = clinicRepository.findById(clinicId)
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

    public Page<Clinic> getPage(int page, int pageSize, HttpServletResponse response) {
        var pageable = PageRequest.of(page, pageSize);
        var dataPage = clinicRepository.findAll(pageable);

        int totalPages = (int)Math.ceil((double)clinicRepository.count() / pageSize);
        response.setIntHeader("X-Total-Pages", totalPages);

        return dataPage;
    }

    public Clinic create(Clinic clinic) {
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

    // patient manager is not implemented yet
    public BasicResultSet assignPatient(int clinicId, int patientId) {
        var clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found"));
            
        return BasicResultSet.builder()
                .resultCode(200)
                .message("Patient assigned successfully")
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
