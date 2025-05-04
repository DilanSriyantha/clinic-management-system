package org.cms.AppointmentManagement.Controllers;

import java.util.List;

import org.cms.AppointmentManagement.DTOs.AppointmentCreateRequest;
import org.cms.AppointmentManagement.DTOs.AppointmentDto;
import org.cms.AppointmentManagement.DTOs.AppointmentSummaryDto;
import org.cms.AppointmentManagement.DTOs.AppointmentTrendDto;
import org.cms.AppointmentManagement.Services.AppointmentService;
import org.cms.Types.BasicResult;
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
@RequestMapping("/api/v1/appointment-management")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    @GetMapping("/maxQueuePosition")
    public @ResponseBody ResponseEntity<Integer> handleGetMaxQueuePosition(@RequestParam int clinicId) {
        return ResponseEntity.ok(appointmentService.getMaxQueuePosition(clinicId));
    }
    

    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleGetPage(@RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(appointmentService.getPage(page, pageSize));
    }

    @GetMapping("/searchByRefId")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByRefId(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByRefId(page, pageSize, searchKey));
    }

    @GetMapping("/searchByClinic")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByClinic(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByClinic(page, pageSize, searchKey));
    }

    @GetMapping("/searchByDoctor")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByDoctor(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByDoctor(page, pageSize, searchKey));
    }

    @GetMapping("/searchByPatientName")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByPatientName(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByPatientName(page, pageSize, searchKey));
    }

    @GetMapping("/searchByPatientTelephone")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByTelephone(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByPatientTelephone(page, pageSize, searchKey));
    }

    @GetMapping("/searchByPatientRefId")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByPatientRefId(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByPatientRefId(page, pageSize, searchKey));
    }

    @GetMapping("/searchByDate")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByDate(@RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(appointmentService.searchByDate(page, pageSize, searchKey));
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<BasicResultSet> handleCreateAppointm(@RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @PutMapping("/update")
    public @ResponseBody ResponseEntity<BasicResultSet> handleUpdateAppointment(@RequestParam int appointmentId, @RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointment(appointmentId, request));
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> handleDelete(@RequestParam int appointmentId) {
        return ResponseEntity.ok(appointmentService.deleteAppointment(appointmentId));
    }

    @DeleteMapping("/deleteBatch")
    public @ResponseBody ResponseEntity<BasicResult> handleDeleteBatch(@RequestBody int[] ids) {
        return ResponseEntity.ok(appointmentService.deleteBatch(ids));
    }

    @GetMapping("/getAppointmentTrend")
    public @ResponseBody ResponseEntity<List<AppointmentTrendDto>> handleGetAppointmentTrend(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(appointmentService.getAppointmentTrend(startDate, endDate));
    }

    @GetMapping("/getAppointmentSummary")
    public @ResponseBody ResponseEntity<AppointmentSummaryDto> handleGetAppointmentSummary(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(appointmentService.getAppointmentSummary(startDate, endDate));
    }
}