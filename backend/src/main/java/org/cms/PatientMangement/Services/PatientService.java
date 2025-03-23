package org.cms.PatientMangement.Services;

import java.lang.reflect.Field;

import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PatientMangement.Models.Patient;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.Types.BasicResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    public Page<Patient> getPage(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);

        return patientRepository.findAll(pageable);
    }

    public BasicResult create(PatientDto patientDto) {
        var patient = patientDto.toPatient();

        patientRepository.save(patient);

        return BasicResult.builder()
            .status(200)
            .message("Patient created successfully.")
            .build();
    }

    public BasicResult update(int id, PatientDto latestPatientDetails) {
        var patient = patientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Patient not found."));

        Field[] fields = latestPatientDetails.getClass().getFields();

        try{
            for(var field : fields) {
                if(field.get(latestPatientDetails) != null) {
                    patient.getClass().getField(field.getName()).setAccessible(true);
                    patient.getClass().getField(field.getName()).set(patient, field);
                }
            }
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
}