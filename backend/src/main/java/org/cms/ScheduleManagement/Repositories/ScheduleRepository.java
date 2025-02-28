package org.cms.ScheduleManagement.Repositories;

import org.cms.ScheduleManagement.Models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Event, Integer> {
}
