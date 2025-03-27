package org.cms.PrescriptionManagement.Controllers;

import org.cms.PrescriptionManagement.DTOs.PrescriptionDto;
import org.cms.PrescriptionManagement.Services.PrescriptionService;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/api/v1/prescription-management")
@RequiredArgsConstructor
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;

    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<PrescriptionDto>> handleGetPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(prescriptionService.getPage(page, pageSize));
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreatePrescription(@RequestBody PrescriptionDto prescriptionDto) {
        return ResponseEntity.ok(prescriptionService.create(prescriptionDto));
    }
    
    @PutMapping("/update")
    public @ResponseBody ResponseEntity<BasicResultSet> handleUpdatePrescription(@RequestParam int prescriptionId, @RequestBody PrescriptionDto latestPrescription) {
        return ResponseEntity.ok(prescriptionService.update(prescriptionId, latestPrescription));
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDeletePrescription(@RequestParam int prescriptionId) {
        return ResponseEntity.ok(prescriptionService.delete(prescriptionId));
    }
}
