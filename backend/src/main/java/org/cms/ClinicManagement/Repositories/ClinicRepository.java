package org.cms.ClinicManagement.Repositories;

import org.cms.ClinicManagement.Models.Clinic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {

    @Query(value = "SELECT * FROM clinic c WHERE c.caption LIKE :caption", nativeQuery = true)
    Page<Clinic> searchByCaption(Pageable pageable, @Param("caption") String caption);

    @Query(value = "SELECT * FROM clinic c WHERE c.day_of_week LIKE :dow", nativeQuery = true)
    Page<Clinic> searchByDOW(Pageable pageable, @Param("dow") String dow);

    @Query(value = "SELECT * FROM clinic c WHERE c.time LIKE :time", nativeQuery = true)
    Page<Clinic> searchByTime(Pageable pageable, @Param("time") String time);

    @Query(value = "SELECT * FROM (SELECT name AS doctor_name FROM clinic_doctor cd INNER JOIN doctor d ON cd.doctor_id = d.id) AS t WHERE t.doctor_name LIKE :doctorName", nativeQuery = true)
    Page<Clinic> searchByDoctorName(Pageable pageable, @Param("doctorName") String doctorName);
}
