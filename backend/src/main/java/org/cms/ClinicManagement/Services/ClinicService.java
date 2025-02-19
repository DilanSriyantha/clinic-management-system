package org.cms.ClinicManagement.Services;

import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.SystemAdministration.Models.User;
import org.cms.SystemAdministration.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    public Clinic save(Clinic clinic, int doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if(doctor.getRole() != 2)
            throw new IllegalArgumentException("Selected user is not a doctor");

        clinic.setDoctor(doctor);

        return clinicRepository.save(clinic);
    }
}
