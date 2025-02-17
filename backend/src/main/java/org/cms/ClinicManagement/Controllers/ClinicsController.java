package org.cms.ClinicManagement.Controllers;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.RandomBasedGenerator;
import jakarta.servlet.http.HttpServletResponse;
import org.cms.ClinicManagement.Models.Clinic;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.DateFormatter;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/clinic-management")
public class ClinicsController {
    private final List<Clinic> clinicList = new ArrayList<>();
    private final RandomBasedGenerator uuid4 = Generators.randomBasedGenerator();

    public ClinicsController() {
        generateClinics();
    }

    @PostMapping("/create")
    public BasicResultSet createClinic(@RequestBody Clinic clinic) {
        clinic.setUid(uuid4.generate());
        clinic.setStatus(1);
        clinic.setDateCreated(DateFormatter.getInstance().format(new Date()));
        clinicList.add(clinic);

        return new BasicResultSet(200, "Successful");
    }

    private void generateClinics() {
        String[] days = new String[]{ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
        Random random = new Random();

        for(int i = 0; i < 100; i++){
            Clinic clinic = new Clinic(
                    uuid4.generate(),
                    "Clinic " + (i+1),
                    "Lorem ipsum lorem ipsum",
                    null,
                    days[random.nextInt(0, 7)],
                    "12:00 PM",
                    1,
                    "2025-01-01"
            );
            clinicList.add(clinic);
        }
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping("/list")
    public List<Clinic> getAll(@RequestParam Map<String, String> params, HttpServletResponse response) {
        /// paging system starts ///
        int page = -1;
        int pageSize = -1;
        if(params.containsKey("page"))
            page = Integer.parseInt(params.get("page"));

        if(params.containsKey("pageSize"))
            pageSize = Integer.parseInt(params.get("pageSize"));

        if(page != -1 && pageSize != -1){
            int offsetIdx = ((page - 1) * pageSize);
            int boundIdx = (((page - 1) * pageSize) + pageSize);

            if(boundIdx > clinicList.size() - 1)
                boundIdx = clinicList.size();

            response.setIntHeader("X-Total-Pages", (int) Math.ceil((double)clinicList.size() / pageSize));

            return clinicList.subList(offsetIdx, boundIdx);
        }
        /// paging system ends ///

        return clinicList;
    }
}
