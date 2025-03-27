package org.cms.ScheduleManagement.Repositories;

import java.sql.Date;

import org.cms.Enums.EventVisibility;
import org.cms.ScheduleManagement.Models.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScheduleRepository extends JpaRepository<Event, Integer> {
    Page<Event> findAllByOwnerIdAndDate(int ownerId, Date date, Pageable pageable);
    Page<Event> findAllByDateAndVisibility(Date date, EventVisibility visibility, Pageable pageable);
    Page<Event> findAllByDateAndOwnerId(Date date, int ownerId, Pageable pageable);
    Page<Event> findAllByDateAndVisibilityOrOwnerId(Date date, EventVisibility visibility, int ownerId, Pageable pageable);

    @Query(value = """
            SELECT * FROM event e WHERE e.date=:date AND (e.visibility=:visibility OR e.owner_id=:ownerId)
            """, nativeQuery = true)
    Page<Event> findRelevantPage(@Param("date") Date date, @Param("visibility") EventVisibility visibility, @Param("ownerId") int ownerId, Pageable pageable);
}
