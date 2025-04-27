package org.cms.PatientMangement.Services;

import java.util.Arrays;
import java.util.function.Function;

import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PatientMangement.Models.Patient;
import org.cms.PatientMangement.Repositories.PatientRepository;
import org.cms.PrescriptionManagement.DTOs.PrescriptionDto;
import org.cms.Types.BasicResult;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    private final Function<Patient, PatientDto> rowMapper = (patient) -> ModelMapper.getInstance().map(patient, PatientDto.class);

    public Page<PatientDto> getPage(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);

        return patientRepository.findAll(pageable).map(rowMapper);
    }

    public Page<PatientDto> searchByName(int page, int pageSize, String name) {
        var pageable = PageRequest.of(page, pageSize);

        return patientRepository.searchByName(pageable, "%" + name + "%").map(rowMapper);
    }

    public Page<PatientDto> searchByRefId(int page, int pageSize, String refId) {
        var pageable = PageRequest.of(page, pageSize);

        return patientRepository.searchByRefId(pageable,"%" + refId + "%").map(rowMapper);
    }

    public Page<PatientDto> searchByEmail(int page, int pageSize, String email) {
        var pageable = PageRequest.of(page, pageSize);

        return patientRepository.searchByEmail(pageable, "%" + email + "%").map(rowMapper);
    }

    public Page<PatientDto> searchByTelephone(int page, int pageSize, String telephone) {
        var pageable = PageRequest.of(page, pageSize);

        return patientRepository.searchByTelephone(pageable, "%" + telephone + "%").map(rowMapper);
    }

    public BasicResult create(PatientDto patientDto) {
        var patient = ModelMapper.getInstance().map(patientDto, Patient.class);

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