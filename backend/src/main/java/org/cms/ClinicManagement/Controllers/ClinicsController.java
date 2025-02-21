package org.cms.ClinicManagement.Controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.ClinicManagement.Services.ClinicService;
import org.cms.Enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/clinic-management")
@RequiredArgsConstructor
public class ClinicsController {

    private final ClinicRepository clinicRepository;

    private final ClinicService clinicService;

    @PostMapping("/create")
    public Clinic createClinic(@RequestBody Clinic clinic, @RequestParam String doctorReferenceId, @RequestParam int role) {
        clinic.setStatus(1);

        return clinicService.save(clinic, Role.valueOf(role), doctorReferenceId);
    }

    @GetMapping("/all")
    public @ResponseBody Iterable<Clinic> getAll() {
        return clinicRepository.findAll();
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping("/page")
    public Page<Clinic> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            HttpServletResponse response
    ) {
        Pageable pageable = PageRequest.of(page, pageSize);
        int totalPages = (int) Math.ceil((double)clinicRepository.count() / pageSize);
        response.setIntHeader("X-Total-Pages", totalPages);

        return clinicRepository.findAll(pageable);
    }
}
