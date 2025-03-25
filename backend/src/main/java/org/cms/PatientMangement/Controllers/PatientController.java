package org.cms.PatientMangement.Controllers;

import org.cms.PatientMangement.DTOs.PatientDto;
import org.cms.PatientMangement.Models.Patient;
import org.cms.PatientMangement.Services.PatientService;
import org.cms.PrescriptionManagement.DTOs.PrescriptionDto;
import org.cms.Types.BasicResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("api/v1/patient-management")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<Patient>> getPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(patientService.getPage(page, pageSize));
    }
    
    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResult> create(@RequestBody PatientDto patientDto) {
        return ResponseEntity.ok(patientService.create(patientDto));
    }

    @PutMapping("/update")
    public @ResponseBody ResponseEntity<BasicResult> update(@RequestParam int id, @RequestBody PatientDto latestPatientDetails) {
        return ResponseEntity.ok(patientService.update(id, latestPatientDetails));
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResult> delete(@RequestParam int id) {
        return ResponseEntity.ok(patientService.delete(id));
    }

    @DeleteMapping("/deleteBatch")
    public @ResponseBody ResponseEntity<BasicResult> deleteBatch(@RequestBody int[] ids) {
        return ResponseEntity.ok(patientService.deleteBatch(ids));
    }

    @PostMapping("/addPrescription")
    public ResponseEntity<BasicResult> addPrescription(@RequestBody PrescriptionDto prescription) {
        return ResponseEntity.ok(patientService.addPrescription(prescription));
    }
}
