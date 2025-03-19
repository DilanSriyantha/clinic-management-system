package org.cms.ScheduleManagement.Controllers;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.cms.ScheduleManagement.DTOs.EventDto;
import org.cms.ScheduleManagement.Models.Event;
import org.cms.ScheduleManagement.Services.ScheduleService;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/v1/schedule-management")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/getAllEvents")
    public @ResponseBody ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(scheduleService.getAllEvents());
    }

    @GetMapping("/getEventsByOwnerId")
    public @ResponseBody ResponseEntity<List<Event>> getEventsByOwnerId(@RequestParam int ownerId) {
        return ResponseEntity.ok(scheduleService.getEventsByOwnerId(ownerId));
    }

    @GetMapping("/getEventsPageByOwnerId")
    public @ResponseBody ResponseEntity<Page<Event>> getEventsPageByOwnerId(@RequestParam int page, @RequestParam int pageSize, @RequestParam String date, @RequestParam int ownerId) {
        return ResponseEntity.ok(scheduleService.getEventsPageByOwnerIdAndDate(page, pageSize, ownerId, date));
    }

    @GetMapping("/getRelevantEvents")
    public @ResponseBody ResponseEntity<Page<Event>> getRelevantEvents(@RequestParam int userId, @RequestParam int page, @RequestParam int pageSize, @RequestParam String date) {
        return ResponseEntity.ok(scheduleService.getRelevantEvents(userId, page, pageSize, date));
    }

    @GetMapping("/getPublicEvents")
    public @ResponseBody ResponseEntity<Page<Event>> getPublicEvents(@RequestParam int page, @RequestParam int pageSize, @RequestParam String date) {
        return ResponseEntity.ok(scheduleService.getPublicEvents(page, pageSize, date));
    }

    @PostMapping("/createEvent")
    public @ResponseBody ResponseEntity<BasicResultSet> createEvent(@RequestBody EventDto event, @RequestParam int ownerId) {
        return ResponseEntity.ok(scheduleService.createEvent(event, ownerId));
    }

    @PutMapping("/updateEvent")
    public @ResponseBody ResponseEntity<BasicResultSet> updateEvent(@RequestParam int eventId, @RequestBody EventDto newEventDetails) {
        return ResponseEntity.ok(scheduleService.updateEvent(eventId, newEventDetails));
    }

    @DeleteMapping("/deleteEvent")
    public @ResponseBody ResponseEntity<BasicResultSet> deleteEvent(@RequestParam int eventId) {
        return ResponseEntity.ok(scheduleService.deleteEvent(eventId));
    }
}
