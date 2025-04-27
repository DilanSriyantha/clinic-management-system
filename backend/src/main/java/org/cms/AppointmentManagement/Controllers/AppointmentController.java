package org.cms.AppointmentManagement.Controllers;

import org.cms.AppointmentManagement.DTOs.AppointmentCreateRequest;
import org.cms.AppointmentManagement.DTOs.AppointmentDto;
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
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByRefId(@RequestParam int page, @RequestParam int pageSize, @RequestParam String refId) {
        return ResponseEntity.ok(appointmentService.searchByRefId(page, pageSize, refId));
    }

    @GetMapping("/searchByClinic")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByClinic(@RequestParam int page, @RequestParam int pageSize, @RequestParam String clinicName) {
        return ResponseEntity.ok(appointmentService.searchByClinic(page, pageSize, clinicName));
    }

    @GetMapping("/searchByDoctor")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByDoctor(@RequestParam int page, @RequestParam int pageSize, @RequestParam String doctorName) {
        return ResponseEntity.ok(appointmentService.searchByDoctor(page, pageSize, doctorName));
    }

    @GetMapping("/searchByPatientName")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByPatientName(@RequestParam int page, @RequestParam int pageSize, @RequestParam String patientName) {
        return ResponseEntity.ok(appointmentService.searchByPatientName(page, pageSize, patientName));
    }

    @GetMapping("/searchByPatientTelephone")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByTelephone(@RequestParam int page, @RequestParam int pageSize, @RequestParam String patientTelephone) {
        return ResponseEntity.ok(appointmentService.searchByPatientTelephone(page, pageSize, patientTelephone));
    }

    @GetMapping("/searchByPatientRefId")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByPatientRefId(@RequestParam int page, @RequestParam int pageSize, @RequestParam String patientRefId) {
        return ResponseEntity.ok(appointmentService.searchByPatientRefId(page, pageSize, patientRefId));
    }

    @GetMapping("/searchByDate")
    public @ResponseBody ResponseEntity<Page<AppointmentDto>> handleSearchByDate(@RequestParam int page, @RequestParam int pageSize, @RequestParam String date) {
        return ResponseEntity.ok(appointmentService.searchByDate(page, pageSize, date));
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
}