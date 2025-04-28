package org.cms.AppointmentManagement.Repositories;

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
                WHERE clinic_id = 1
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
}
