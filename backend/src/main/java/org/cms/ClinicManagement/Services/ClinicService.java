package org.cms.ClinicManagement.Services;

import jakarta.servlet.http.HttpServletResponse;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.Enums.Role;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ClinicService {

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Clinic> findAll(Pageable pageable) {
        return clinicRepository.findAll(pageable);
    }

    public Page<Clinic> getPage(int page, int pageSize, HttpServletResponse response) {
        var pageable = PageRequest.of(page, pageSize);
        var dataPage = clinicRepository.findAll(pageable);

        int totalPages = (int)Math.ceil((double)clinicRepository.count() / pageSize);
        response.setIntHeader("X-Total-Pages", totalPages);

        return dataPage;
    }

    public Clinic save(Clinic clinic, Role role, String referenceId) {
        var doctor = userRepository.findByRoleAndReferenceId(role, referenceId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        clinic.setDoctor(doctor);

        return clinicRepository.save(clinic);
    }
}
