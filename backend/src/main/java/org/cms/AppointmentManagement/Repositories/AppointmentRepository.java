package org.cms.AppointmentManagement.Repositories;

import java.util.List;

import org.cms.AppointmentManagement.DTOs.AppointmentSummaryDto;
import org.cms.AppointmentManagement.DTOs.AppointmentTrendDto;
import org.cms.AppointmentManagement.Models.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query(value = """
                SELECT COALESCE(MAX(queue_position), 0) + 1
                FROM appointment
                WHERE clinic_id = :clinicId
                AND DATE(created_at) = CURRENT_DATE
            """, nativeQuery = true)
    Integer findMaxQueuePosition(@Param("clinicId") int clinicId);

    @Query(value = """
                SELECT CONCAT("AP_", COALESCE(MAX(id), 0) + 1)
                FROM appointment
            """, nativeQuery = true)
    String generateReferenceId();

    @Query(value = """
            SELECT * FROM (
                SELECT
                    a.id,
                    a.reference_id,
                    a.queue_position,
                    a.created_at,
                    a.updated_at,
                    u.id AS doctor_id,
                    u.name AS doctor_name,
                    u.reference_id AS doctor_ref_id,
                    c.id AS clinic_id,
                    c.caption AS clinic_name,
                    p.id AS patient_id,
                    p.name AS patient_name,
                    p.reference_id AS patient_reference_id,
                    p.email AS patient_email,
                    p.telephone AS patient_telephone
                FROM appointment a
                INNER JOIN user u ON u.id = a.doctor_id
                INNER JOIN clinic c ON c.id = a.clinic_id
                INNER JOIN patient p ON p.id = a.patient_id
            ) AS t WHERE t.reference_id LIKE :refId

            """, nativeQuery = true)
    Page<Appointment> searchByRefId(PageRequest pageable, @Param("refId") String refId);

    @Query(value = """
            SELECT * FROM (
                SELECT
                    a.id,
                    a.reference_id,
                    a.queue_position,
                    a.created_at,
                    a.updated_at,
                    u.id AS doctor_id,
                    u.name AS doctor_name,
                    u.reference_id AS doctor_ref_id,
                    c.id AS clinic_id,
                    c.caption AS clinic_name,
                    p.id AS patient_id,
                    p.name AS patient_name,
                    p.reference_id AS patient_reference_id,
                    p.email AS patient_email,
                    p.telephone AS patient_telephone
                FROM appointment a
                INNER JOIN user u ON u.id = a.doctor_id
                INNER JOIN clinic c ON c.id = a.clinic_id
                INNER JOIN patient p ON p.id = a.patient_id
            ) AS t WHERE t.clinic_name LIKE :clinicName

            """, nativeQuery = true)
    Page<Appointment> searchByClinic(PageRequest pageable, @Param("clinicName") String clinicName);

    @Query(value = """
            SELECT * FROM (
                    SELECT
                        a.id,
                        a.reference_id,
                        a.queue_position,
                        a.created_at,
                        a.updated_at,
                        u.id AS doctor_id,
                        u.name AS doctor_name,
                        u.reference_id AS doctor_ref_id,
                        c.id AS clinic_id,
                        c.caption AS clinic_name,
                        p.id AS patient_id,
                        p.name AS patient_name,
                        p.reference_id AS patient_reference_id,
                        p.email AS patient_email,
                        p.telephone AS patient_telephone
                    FROM appointment a
                INNER JOIN user u ON u.id = a.doctor_id
                INNER JOIN clinic c ON c.id = a.clinic_id
                INNER JOIN patient p ON p.id = a.patient_id
            ) AS t WHERE t.doctor_name LIKE :doctorName

            """, nativeQuery = true)
    Page<Appointment> searchByDoctor(PageRequest pageable, @Param("doctorName") String doctorName);

    @Query(value = """
            SELECT * FROM (
                    SELECT
                        a.id,
                        a.reference_id,
                        a.queue_position,
                        a.created_at,
                        a.updated_at,
                        u.id AS doctor_id,
                        u.name AS doctor_name,
                        u.reference_id AS doctor_ref_id,
                        c.id AS clinic_id,
                        c.caption AS clinic_name,
                        p.id AS patient_id,
                        p.name AS patient_name,
                        p.reference_id AS patient_reference_id,
                        p.email AS patient_email,
                        p.telephone AS patient_telephone
                    FROM appointment a
                INNER JOIN user u ON u.id = a.doctor_id
                INNER JOIN clinic c ON c.id = a.clinic_id
                INNER JOIN patient p ON p.id = a.patient_id
            ) AS t WHERE t.patient_name LIKE :patientName

            """, nativeQuery = true)
    Page<Appointment> searchByPatientName(PageRequest pageable, @Param("patientName") String patientName);

    @Query(value = """
            SELECT * FROM (
                    SELECT
                        a.id,
                        a.reference_id,
                        a.queue_position,
                        a.created_at,
                        a.updated_at,
                        u.id AS doctor_id,
                        u.name AS doctor_name,
                        u.reference_id AS doctor_ref_id,
                        c.id AS clinic_id,
                        c.caption AS clinic_name,
                        p.id AS patient_id,
                        p.name AS patient_name,
                        p.reference_id AS patient_reference_id,
                        p.email AS patient_email,
                        p.telephone AS patient_telephone
                    FROM appointment a
                INNER JOIN user u ON u.id = a.doctor_id
                INNER JOIN clinic c ON c.id = a.clinic_id
                INNER JOIN patient p ON p.id = a.patient_id
            ) AS t WHERE t.patient_telephone LIKE :telephone

            """, nativeQuery = true)
    Page<Appointment> searchByPatientTelephone(PageRequest pageable, @Param("telephone") String patientTelephone);

    @Query(value = """
        SELECT * FROM (
                SELECT
                    a.id,
                    a.reference_id,
                    a.queue_position,
                    a.created_at,
                    a.updated_at,
                    u.id AS doctor_id,
                    u.name AS doctor_name,
                    u.reference_id AS doctor_ref_id,
                    c.id AS clinic_id,
                    c.caption AS clinic_name,
                    p.id AS patient_id,
                    p.name AS patient_name,
                    p.reference_id AS patient_reference_id,
                    p.email AS patient_email,
                    p.telephone AS patient_telephone
                FROM appointment a
            INNER JOIN user u ON u.id = a.doctor_id
            INNER JOIN clinic c ON c.id = a.clinic_id
            INNER JOIN patient p ON p.id = a.patient_id
        ) AS t WHERE t.patient_ref_id LIKE :patientRefId

        """, nativeQuery = true)
    Page<Appointment> searchByPatientRefId(PageRequest pageable, @Param("patientRefId") String patientRefId);

    @Query(value = """
        SELECT * FROM (
                SELECT
                    a.id,
                    a.reference_id,
                    a.queue_position,
                    a.created_at,
                    a.updated_at,
                    u.id AS doctor_id,
                    u.name AS doctor_name,
                    u.reference_id AS doctor_ref_id,
                    c.id AS clinic_id,
                    c.caption AS clinic_name,
                    p.id AS patient_id,
                    p.name AS patient_name,
                    p.reference_id AS patient_reference_id,
                    p.email AS patient_email,
                    p.telephone AS patient_telephone
                FROM appointment a
            INNER JOIN user u ON u.id = a.doctor_id
            INNER JOIN clinic c ON c.id = a.clinic_id
            INNER JOIN patient p ON p.id = a.patient_id
        ) AS t WHERE t.created_at LIKE :date

        """, nativeQuery = true)
    Page<Appointment> searchByDate(PageRequest pageable, @Param("date") String date);

    @Query(value = """
        SELECT 
            DATE(created_at) AS appointmentDate,
            COUNT(*) AS appointmentCount
        FROM 
            appointment
        WHERE 
            created_at BETWEEN :startDate AND :endDate
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            appointmentDate
    """, nativeQuery = true)
    List<AppointmentTrendDto> getAppointmentTrend(@Param("startDate") String appointmentDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT
            COUNT(*) AS totalAppointments,

            (SELECT AVG(daily_count)
            FROM (
                SELECT DATE(created_at) AS day, COUNT(*) AS daily_count
                FROM appointment
                WHERE created_at BETWEEN :startDate AND :endDate
                GROUP BY DATE(created_at)
            ) AS dailyStats) AS averageAppointmentsPerDay,

            (SELECT DATE(created_at)
            FROM appointment
            WHERE created_at BETWEEN :startDate AND :endDate
            GROUP BY DATE(created_at)
            ORDER BY COUNT(*) DESC
            LIMIT 1) AS dateWithHighestAppointments,

            (SELECT p.name
            FROM appointment a
            JOIN patient p ON a.patient_id = p.id
            WHERE a.created_at BETWEEN :startDate AND :endDate
            GROUP BY p.id, p.name
            ORDER BY COUNT(*) DESC
            LIMIT 1) AS topPatientName,

            (SELECT COUNT(*)
            FROM appointment
            WHERE patient_id = (
                SELECT p.id
                FROM appointment a
                JOIN patient p ON a.patient_id = p.id
                WHERE a.created_at BETWEEN :startDate AND :endDate
                GROUP BY p.id
                ORDER BY COUNT(*) DESC
                LIMIT 1
            )
            AND created_at BETWEEN :startDate AND :endDate) AS totalAppointmentsForTopPatient
        FROM appointment
        WHERE created_at BETWEEN :startDate AND :endDate   
    """, nativeQuery = true)
    AppointmentSummaryDto getAppointmentSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
