package org.cms.Dashboard.Services;

import lombok.RequiredArgsConstructor;
import org.cms.Dashboard.Models.DashboardReport;
import org.cms.Dashboard.Repositories.DashboardRepositoryImpl;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepositoryImpl dashboardRepository;

    public DashboardReport getReport() throws IllegalAccessException {
        return dashboardRepository.getDashboardReport();
    }
}
