package org.cms.ClinicManagement.Controllers;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.RandomBasedGenerator;
import jakarta.servlet.http.HttpServletResponse;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.ClinicManagement.Repositories.ClinicRepository;
import org.cms.ClinicManagement.Services.ClinicService;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.DateFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/clinic-management")
public class ClinicsController {

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private ClinicService clinicService;

    public ClinicsController() {
        generateClinics();
    }

    @PostMapping("/create")
    public Clinic createClinic(@RequestBody Clinic clinic, @RequestParam int doctorId) {
        clinic.setStatus(1);

        return clinicService.save(clinic, doctorId);
    }

    private void generateClinics() {
//        String[] days = new String[]{ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
//        Random random = new Random();
//
//        for(int i = 0; i < 100; i++){
//            Clinic clinic = new Clinic(
//                    uuid4.generate(),
//                    "Clinic " + (i+1),
//                    "Lorem ipsum lorem ipsum",
//                    null,
//                    days[random.nextInt(0, 7)],
//                    "12:00 PM",
//                    1,
//                    "2025-01-01"
//            );
//            clinicList.add(clinic);
//        }
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
