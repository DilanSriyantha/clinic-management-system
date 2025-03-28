package org.cms.AppointmentManagement.Repositories;

import org.cms.AppointmentManagement.Models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query(
        value =
            """
                SELECT COALESCE(MAX(queue_position), 0) + 1 
                FROM appointment
                WHERE clinic_id = 1
                AND DATE(created_at) = CURRENT_DATE
            """, 
        nativeQuery = true
    )
    Integer findMaxQueuePosition(@Param("clinicId") int clinicId);

    @Query(
        value =
            """
                SELECT CONCAT("AP_", COALESCE(MAX(id), 0) + 1) 
                FROM appointment
            """, 
        nativeQuery = true
    )
    String generateReferenceId();
}
