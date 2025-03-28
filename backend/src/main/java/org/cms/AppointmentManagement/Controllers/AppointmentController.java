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