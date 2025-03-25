package org.cms.PatientMangement.Services;

import java.lang.reflect.Field;
import java.util.Arrays;

import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PatientMangement.Models.Patient;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.PrescriptionManagement.DTOs.PrescriptionDto;
import org.cms.Types.BasicResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    private final EntityManager entityManager;

    public Page<Patient> getPage(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);

        return patientRepository.findAll(pageable);
    }

    public BasicResult create(PatientDto patientDto) {
        var patient = patientDto.toPatient();

        var referenceId = patientRepository.generateReferenceId();
        patient.setReferenceId(referenceId);
    
        patientRepository.save(patient);

        return BasicResult.builder()
            .status(200)
            .message("Patient created successfully.")
            .build();
    }

    public BasicResult update(int id, PatientDto latestPatientDetails) {
        var patient = patientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Patient not found."));

        try{
            patient.update(latestPatientDetails);
            patientRepository.save(patient);
        }catch(Exception ex){
            throw new InternalError(ex);
        }

        System.out.println(patient.toString());

        return BasicResult.builder()
            .status(200)
            .message("Patient updated successfully.")
            .build();
    }

    public BasicResult delete(int id) {
        var patient = patientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        patientRepository.delete(patient);

        return BasicResult.builder()
            .status(200)
            .message("Patient deleted successfully.")
            .build();
    }

    @Transactional
    public BasicResult deleteBatch(int[] ids) {
        Iterable<Integer> batch = intsToIterable(ids);

        patientRepository.deleteAllByIdInBatch(batch);

        return BasicResult.builder()
            .status(200)
            .message("Batch deleted successfuly.")
            .build();
    }

    public BasicResult addPrescription(PrescriptionDto prescription) {
        

        return BasicResult.builder()
            .status(200)
            .message("Prescription added successfully.")
            .build();
    }

    private Iterable<Integer> intsToIterable(int[] arr) {
        return () -> Arrays.stream(arr).iterator();
    }
}