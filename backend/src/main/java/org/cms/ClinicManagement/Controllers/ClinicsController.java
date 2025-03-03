package org.cms.ClinicManagement.Controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.cms.ClinicManagement.DTOs.AssignDoctorDto;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Services.ClinicService;
import org.cms.Users.Models.User;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/clinic-management")
@RequiredArgsConstructor
public class ClinicsController {

    private final ClinicService clinicService;

    @GetMapping("/all")
    public @ResponseBody ResponseEntity<Iterable<Clinic>> getAll() {
        return ResponseEntity.ok(clinicService.getAll());
    }

    @GetMapping("/byId")
    public @ResponseBody ResponseEntity<Clinic> get(@RequestParam int clinicId) {
        return ResponseEntity.ok(clinicService.get(clinicId));
    }

    @GetMapping("/doctorsByClinic")
    public @ResponseBody ResponseEntity<Iterable<User>> getDoctorsByClinic(@RequestParam int clinicId) {
        return ResponseEntity.ok(clinicService.getDoctorsByClinic(clinicId));
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<Clinic>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(clinicService.getPage(page, pageSize, response));
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<Clinic> create(@RequestBody Clinic clinic) {
        return ResponseEntity.ok(clinicService.create(clinic));
    }

    @PostMapping("/assignDoctor")
    public @ResponseBody ResponseEntity<BasicResultSet> assignDoctor(@RequestBody AssignDoctorDto assignDoctorDto) {
        return ResponseEntity.ok(clinicService.assignDoctor(assignDoctorDto));
    }

    @PostMapping("/dismissDoctor")
    public @ResponseBody ResponseEntity<BasicResultSet> dismissDoctor(@RequestBody AssignDoctorDto dismissDoctorDto) {
        return ResponseEntity.ok(clinicService.dissmissDoctor(dismissDoctorDto));
    }

    @PostMapping("/assignPatient")
    public @ResponseBody ResponseEntity<BasicResultSet> assignPatient(@RequestParam int clinicId, @RequestParam int patientId) {
        return ResponseEntity.ok(clinicService.assignPatient(clinicId, patientId));
    } 

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> delete(@RequestParam int id) {
        return ResponseEntity.ok(clinicService.delete(id));
    }
}
