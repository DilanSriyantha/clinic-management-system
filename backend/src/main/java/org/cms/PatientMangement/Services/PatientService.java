package org.cms.PatientMangement.Services;

import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.PatientMangement.DTOs.PatientAgeDistributionTrendDto;
import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PatientMangement.DTOs.PatientRegistrationSummaryDto;
import org.cms.PatientMangement.DTOs.PatientRegistrationTrendDto;
import org.cms.PatientMangement.DTOs.UpdatePatientRequest;
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

    private final ClinicRepository clinicRepository;

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

    public BasicResult update(int id, UpdatePatientRequest latestPatientDetails) throws Exception {
        var patient = patientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Patient not found."));

        patient = ModelMapper.getInstance().fill(latestPatientDetails, patient);

        System.out.println(patient.toString());
        
        patientRepository.save(patient);

        return BasicResult.builder()
            .status(200)
            .message("Patient updated successfully.")
            .build();
    }

    @Transactional
    public BasicResult delete(int id) {
        var patient = patientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        patient.getAppointments().clear();
        patient.getPrescriptions().clear();
        patient.getClinics().clear();

        patientRepository.delete(patient);

        return BasicResult.builder()
            .status(200)
            .message("Patient deleted successfully.")
            .build();
    }

    @Transactional
    public BasicResult deleteBatch(int[] ids) {
        for(int i = 0; i < ids.length; i++){
            var patient = patientRepository.findById(ids[i])
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

            patient.getAppointments().clear();
            patient.getPrescriptions().clear();
            patient.getClinics().forEach(clinic -> {
                clinic.getPatients().removeIf(pat -> pat.getId() == patient.getId());
                clinicRepository.save(clinic);
            });
            patient.getClinics().clear();

            patientRepository.delete(patient);
        }

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

    public List<PatientRegistrationTrendDto> getPatientRegistrationTrend(String startDate, String endDate) {
        return patientRepository.getPatientRegistrationTrend(startDate, endDate);
    }

    public List<PatientAgeDistributionTrendDto> getPatientAgeDistributionTrend() {
        return patientRepository.getPatientAgeDistributionTrend();
    }

    public PatientRegistrationSummaryDto getPatientRegistrationSummary(String startDate, String endDate) {
        return patientRepository.getPatientRegistrationSummary(startDate, endDate);
    }

    private Iterable<Integer> intsToIterable(int[] arr) {
        return () -> Arrays.stream(arr).iterator();
    }
}