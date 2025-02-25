package org.cms.Dashboard.Controllers;

import lombok.RequiredArgsConstructor;
import org.cms.Dashboard.Models.DashboardReport;
import org.cms.Dashboard.Services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/report")
    public @ResponseBody ResponseEntity<DashboardReport> getReport() throws IllegalAccessException {
        return ResponseEntity.ok(dashboardService.getReport());
    }
}
