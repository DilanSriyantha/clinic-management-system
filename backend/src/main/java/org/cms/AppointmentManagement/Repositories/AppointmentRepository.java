package org.cms.AppointmentManagement.Repositories;

import org.cms.AppointmentManagement.Models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    
}
