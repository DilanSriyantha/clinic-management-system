package org.cms.ScheduleManagement.Services;

import java.sql.Date;
import java.util.List;

import org.cms.Enums.EventVisibility;
import org.cms.ScheduleManagement.DTOs.EventDto;
import org.cms.ScheduleManagement.Models.Event;
import org.cms.ScheduleManagement.Repositories.ScheduleRepository;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;

    private final UserRepository userRepository;

    public List<Event> getAllEvents() {
        var events = scheduleRepository.findAll();

        return events;
    }

    public List<Event> getEventsByOwnerId(int ownerId) {
        var owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new UsernameNotFoundException("Event owner not found"));

        return owner.getEvents();
    }

    public Page<Event> getEventsPageByOwnerIdAndDate(int page, int pageSize, int ownerId, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return scheduleRepository.findAllByOwnerIdAndDate(ownerId, Date.valueOf(date), pageable);
    }

    public Page<Event> getRelevantEvents(int userId, int page, int pageSize, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return scheduleRepository.findRelevantPage(Date.valueOf(date), userId, pageable);
    }

    public Page<Event> getPublicEvents(int page, int pageSize, String date) {
        var pageable = PageRequest.of(page, pageSize);

        return scheduleRepository.findAllByDateAndVisibility(Date.valueOf(date), EventVisibility.PUBLIC, pageable);
    }

    public BasicResultSet createEvent(EventDto eventDto, int ownerId) {
        var user = userRepository.findById(ownerId)
            .orElseThrow(() -> new UsernameNotFoundException("Event owner not found"));
        
        var event = eventDto.toEvent(user);

        user.getEvents().add(event);

        scheduleRepository.save(event);
        userRepository.save(user);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Event created successfully.")
            .build();
    }

    public BasicResultSet updateEvent(int eventId, EventDto newEventDetails) {
        var event = scheduleRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        event.update(newEventDetails);

        scheduleRepository.save(event);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Event updated successfully.")
            .build();
    }

    public BasicResultSet deleteEvent(int eventId) {
        var event = scheduleRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Event not found"));
 
        event.getOwner().getEvents().removeIf((e) -> e.getId() == eventId);
        userRepository.save(event.getOwner());
            
        scheduleRepository.delete(event);

        return BasicResultSet.builder()
            .resultCode(200)
            .message("Event deleted successfully.")
            .build();
    }
}
