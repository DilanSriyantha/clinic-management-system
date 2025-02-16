package org.cms.ClinicManagement.Controllers;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.RandomBasedGenerator;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.DateFormatter;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clinic-management")
public class ClinicsController {
    private final List<Clinic> clinicList = new ArrayList<>();
    private final RandomBasedGenerator uuid4 = Generators.randomBasedGenerator();

    @PostMapping("/create")
    public BasicResultSet createClinic(@RequestBody Clinic clinic) {
        clinic.setUid(uuid4.generate());
        clinic.setStatus(1);
        clinic.setDateCreated(DateFormatter.getInstance().format(new Date()));
        clinicList.add(clinic);

        return new BasicResultSet(200, "Successful");
    }

    @GetMapping("/list")
    public List<Clinic> getAll() {
        return clinicList;
    }
}
