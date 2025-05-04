package org.cms.ClinicManagement.Controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.cms.ClinicManagement.DTOs.AssignDoctorDto;
import org.cms.ClinicManagement.DTOs.AssignPatientDto;
import org.cms.ClinicManagement.DTOs.ClinicAppointmentDistributionDto;
import org.cms.ClinicManagement.DTOs.ClinicDto;
import org.cms.ClinicManagement.DTOs.ClinicPatientRegTrendDto;
import org.cms.ClinicManagement.DTOs.ClinicSummaryDto;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Services.ClinicService;
import org.cms.Users.Models.User;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    public @ResponseBody ResponseEntity<ClinicDto> get(@RequestParam int clinicId) {
        return ResponseEntity.ok(clinicService.get(clinicId));
    }

    @GetMapping("/doctorsByClinic")
    public @ResponseBody ResponseEntity<Iterable<User>> getDoctorsByClinic(@RequestParam int clinicId) {
        return ResponseEntity.ok(clinicService.getDoctorsByClinic(clinicId));
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<ClinicDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(clinicService.getPage(page, pageSize, response));
    }

    @GetMapping("/searchByCaption")
    public @ResponseBody ResponseEntity<Page<ClinicDto>> handleSearchByCaption(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(clinicService.searchByCaption(page, pageSize, searchKey));
    }

    @GetMapping("/searchByDayOfWeek")
    public @ResponseBody ResponseEntity<Page<ClinicDto>> handleSearchByDOW(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(clinicService.searchByDOW(page, pageSize, searchKey));
    }

    @GetMapping("/searchByTime")
    public @ResponseBody ResponseEntity<Page<ClinicDto>> handleSearchByTime(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(clinicService.searchByTime(page, pageSize, searchKey));
    }

    @GetMapping("/searchByDoctor")
    public @ResponseBody ResponseEntity<Page<ClinicDto>> handleSearchByDoctorName(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(clinicService.searchByDoctorName(page, pageSize, searchKey));
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

    @PostMapping("/assignPatients")
    public @ResponseBody ResponseEntity<BasicResultSet> assignPatients(@RequestBody AssignPatientDto assignPatientDto) {
        return ResponseEntity.ok(clinicService.assignPatients(assignPatientDto));
    } 

    @PostMapping("/dismissPatients")
    public @ResponseBody ResponseEntity<BasicResultSet> dismissPatients(@RequestBody AssignPatientDto dismissPatientDto) {
        return ResponseEntity.ok(clinicService.dismissPatients(dismissPatientDto));
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> delete(@RequestParam int id) {
        return ResponseEntity.ok(clinicService.delete(id));
    }

    @GetMapping("/getClinicAppointmentDistribution")
    public @ResponseBody ResponseEntity<List<ClinicAppointmentDistributionDto>> handleGetClinicAppointmentDistribution(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(clinicService.getClinicAppointmentDistribution(startDate, endDate));
    }

    @GetMapping("/getClinicPatientRegTrend")
    public @ResponseBody ResponseEntity<List<ClinicPatientRegTrendDto>> handleGetClinicPatientRegTrend(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(clinicService.getClinicPatientRegTrend(startDate, endDate));
    }

    @GetMapping("/getClinicSummary")
    public @ResponseBody ResponseEntity<ClinicSummaryDto> handleGetClinicSummary(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(clinicService.getClinicSummary(startDate, endDate));
    }
}
