package org.cms.PrescriptionManagement.Services;

import java.util.ArrayList;
import java.util.List;

import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.PrescriptionManagement.DTOs.PrescriptionDto;
import org.cms.PrescriptionManagement.Models.Prescription;
import org.cms.PrescriptionManagement.Models.PrescriptionLine;
import org.cms.PrescriptionManagement.Repositories.PrescriptionLinesRepository;
import org.cms.PrescriptionManagement.Repositories.PrescriptionRepository;
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
public class PrescriptionService {
     
    private final PrescriptionRepository prescriptionRepository;

    private final PrescriptionLinesRepository prescriptionLinesRepository;

    private final PatientRepository patientRepository;

    private final UserRepository userRepository;

    public Page<Prescription> getPage(int page, int pageSize) {
        var pageable = PageRequest.of(page, pageSize);

        return prescriptionRepository.findAll(pageable);
    }

    @Transactional
    public BasicResultSet create(PrescriptionDto prescriptionDto) {
        var patient = patientRepository.findById(prescriptionDto.getPatientId())
            .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        var doctor = userRepository.findById(prescriptionDto.getDoctorId())
            .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        var prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);

        prescriptionRepository.save(prescription);

        List<PrescriptionLine> prescriptionLines = new ArrayList<>();
        for(var line : prescriptionDto.getPrescriptionLines()) {
            var prescriptionLine = ModelMapper.getInstance().map(line,  PrescriptionLine.class);

            if(prescriptionLine == null)
                throw new InternalError("Error occurred when mapping PrescriptionLineDto into PrescriptionLine");

            prescriptionLine.setPrescription(prescription);
            prescriptionLines.add(prescriptionLine);
        }
        
        prescriptionLinesRepository.saveAll(prescriptionLines);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Prescription created successfully.")
            .build();
    }

    public BasicResultSet update(int prescriptionId, PrescriptionDto latestPrescription) {
        var prescription = prescriptionRepository.findById(prescriptionId)
            .orElseThrow(() -> new EntityNotFoundException("Prescription not found"));

        prescription = ModelMapper.getInstance().map(latestPrescription, Prescription.class);

        if(prescription == null)
            throw new InternalError("Error occured when mapping PrescriptionDto into Prescription");
        
        return BasicResultSet.builder()
            .resultCode(200)
            .message("Prescription updated successfully.")
            .build();
    }

    public BasicResultSet delete(int presriptionId) {
        var prescription = prescriptionRepository.findById(presriptionId)
            .orElseThrow(() -> new EntityNotFoundException("Prescription not found"));

        prescriptionRepository.delete(prescription);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Prescription deleted successfully")
            .build();
    }
}
