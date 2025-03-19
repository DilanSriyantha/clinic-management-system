package org.cms.ScheduleManagement.DTOs;

import java.sql.Date;
import java.sql.Time;

import org.cms.Enums.EventVisibility;
import org.cms.ScheduleManagement.Models.Event;
import org.cms.Users.Models.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDto {
    private String title;
    
    private String description;

    private String date;

    private String time;

    private int ownerId;

    private EventVisibility visibility;

    public Event toEvent(User owner) {
        return Event.builder()
            .title(title)
            .description(description)
            .date(Date.valueOf(date))
            .time(Time.valueOf(time))
            .visibility(visibility)
            .owner(owner)
            .build();
    }
}
