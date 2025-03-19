package org.cms.ScheduleManagement.Models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.cms.Enums.EventVisibility;
import org.cms.ScheduleManagement.DTOs.EventDto;
import org.cms.Users.Models.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    private Date date;

    private Time time;

    @Enumerated(EnumType.STRING)
    private EventVisibility visibility;

    @ManyToOne
    private User owner;

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;

    public void update(EventDto newEventDetails) {
        this.title = newEventDetails.getTitle();
        this.description = newEventDetails.getDescription();
        this.date = Date.valueOf(newEventDetails.getDate());
        this.time = Time.valueOf(newEventDetails.getTime());
        this.visibility = newEventDetails.getVisibility();
    }

    public void update(Event newEventDetails) {
        this.title = newEventDetails.getTitle();
        this.description = newEventDetails.getDescription();
        this.date = newEventDetails.getDate();
        this.time = newEventDetails.getTime();
        this.visibility = newEventDetails.getVisibility();
    }
}
