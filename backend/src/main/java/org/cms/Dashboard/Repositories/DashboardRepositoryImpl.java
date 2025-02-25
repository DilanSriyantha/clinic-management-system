package org.cms.Dashboard.Repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.cms.Dashboard.Models.DashboardReport;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Field;

@Repository
public class DashboardRepositoryImpl {

    @PersistenceContext
    private EntityManager entityManager;

    public DashboardReport getDashboardReport() throws IllegalAccessException {
        Query query = entityManager.createNativeQuery("""
                SELECT
                (SELECT COUNT(*) FROM `user` WHERE `role` = 'ADMIN') AS admin_count,
                (SELECT COUNT(*) FROM `user` WHERE `role` = 'DOCTOR') AS doctor_count,
                (SELECT COUNT(*) FROM `user` WHERE `role` = 'RECEPTIONIST') AS receptionist_count,
                (SELECT COUNT(*) FROM `user` WHERE `role` = 'PHARMACIST') AS pharmacist_count,
                (SELECT COUNT(*) FROM `clinic`) AS clinic_count
            """);

        Object[] result = (Object[]) query.getSingleResult();

        return generateReport(result);
    }

    private DashboardReport generateReport(Object[] result) throws IllegalAccessException {
        var dashboardReport = new DashboardReport();
        Field[] fields = dashboardReport.getClass().getDeclaredFields();

        int i = 0;
        for(Field field : fields) {
            field.setAccessible(true);

            if(i >= result.length){
                field.set(dashboardReport, 0);
                continue;
            }

            field.set(dashboardReport, ((Number)result[i]).intValue());
            i++;
        }

        return dashboardReport;
    }
}
