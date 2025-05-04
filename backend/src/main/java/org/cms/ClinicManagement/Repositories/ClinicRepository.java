package org.cms.ClinicManagement.Repositories;

import java.util.List;

import org.cms.ClinicManagement.DTOs.ClinicAppointmentDistributionDto;
import org.cms.ClinicManagement.DTOs.ClinicPatientRegTrendDto;
import org.cms.ClinicManagement.DTOs.ClinicSummaryDto;
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

    @Query(value = """
        SELECT 
            c.id AS clinicId,
            c.caption AS clinicName,
            COUNT(a.id) AS appointmentCount,
            ROUND(100.0 * COUNT(a.id) / (
                SELECT COUNT(*) 
                FROM appointment 
                WHERE created_at BETWEEN :startDate AND :endDate
            ), 2) AS appointmentPercentage
        FROM appointment a
        JOIN clinic c ON a.clinic_id = c.id
        WHERE a.created_at BETWEEN :startDate AND :endDate
        GROUP BY c.id;
    """, nativeQuery = true)
    List<ClinicAppointmentDistributionDto> getClinicAppointmentDistribution(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT 
            c.id AS clinicId,
            c.caption AS clinicName,
            COUNT(p.id) AS patientCount
        FROM clinic_patients cp
        JOIN clinic c ON cp.clinics_id = c.id
        JOIN patient p ON cp.patients_id = p.id
        WHERE p.created_at BETWEEN :startDate AND :endDate
        GROUP BY c.id, c.caption
    """, nativeQuery = true)
    List<ClinicPatientRegTrendDto> getClinicPatientRegTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT
            (SELECT COUNT(*) 
            FROM clinic 
            WHERE created_at BETWEEN :startDate AND :endDate) AS totalClinics,

            (SELECT c.caption
            FROM clinic c
            JOIN clinic_patients cp ON cp.clinics_id = c.id
            JOIN patient p ON p.id = cp.patients_id
            WHERE p.created_at BETWEEN :startDate AND :endDate
            AND c.created_at <= :endDate
            GROUP BY c.id
            ORDER BY ROUND(COUNT(p.id) * 1.0 / (SELECT COUNT(*) FROM patient WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2) DESC
            LIMIT 1) AS clinicWithHighestAvgPatients,

            (SELECT ROUND(COUNT(p.id) * 1.0 / (SELECT COUNT(*) FROM patient WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2)
            FROM clinic c
            JOIN clinic_patients cp ON cp.clinics_id = c.id
            JOIN patient p ON p.id = cp.patients_id
            WHERE p.created_at BETWEEN :startDate AND :endDate
            AND c.created_at <= :endDate
            GROUP BY c.id
            ORDER BY ROUND(COUNT(p.id) * 1.0 / (SELECT COUNT(*) FROM patient WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2) DESC
            LIMIT 1) AS highestAvgPatientsPercentage,

            (SELECT c.caption
            FROM clinic c
            JOIN appointment a ON a.clinic_id = c.id
            WHERE a.created_at BETWEEN :startDate AND :endDate
            AND c.created_at <= :endDate
            GROUP BY c.id
            ORDER BY ROUND(COUNT(a.id) * 1.0 / (SELECT COUNT(*) FROM appointment WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2) DESC
            LIMIT 1) AS clinicWithHighestAvgAppointments,

            (SELECT ROUND(COUNT(a.id) * 1.0 / (SELECT COUNT(*) FROM appointment WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2)
            FROM clinic c
            JOIN appointment a ON a.clinic_id = c.id
            WHERE a.created_at BETWEEN :startDate AND :endDate
            AND c.created_at <= :endDate
            GROUP BY c.id
            ORDER BY ROUND(COUNT(a.id) * 1.0 / (SELECT COUNT(*) FROM appointment WHERE created_at BETWEEN :startDate AND :endDate) * 100, 2) DESC
            LIMIT 1) AS highestAvgAppointmentsPercentage,

            (SELECT day_of_week
            FROM (
                SELECT day_of_week, COUNT(*) AS clinicCount
                FROM clinic
                WHERE created_at BETWEEN :startDate AND :endDate
                GROUP BY day_of_week
                ORDER BY clinicCount DESC
                LIMIT 1
            ) AS dayStats) AS busiestDayOfWeek
    """, nativeQuery = true)
    ClinicSummaryDto getClinicSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
