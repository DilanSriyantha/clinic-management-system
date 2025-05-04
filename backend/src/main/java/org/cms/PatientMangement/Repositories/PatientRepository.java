package org.cms.PatientMangement.Repositories;

import java.util.List;

import org.cms.PatientMangement.DTOs.PatientAgeDistributionTrendDto;
import org.cms.PatientMangement.DTOs.PatientRegistrationSummaryDto;
import org.cms.PatientMangement.DTOs.PatientRegistrationTrendDto;
import org.cms.PatientMangement.Models.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query(
        value = "SELECT CASE WHEN (SELECT MAX(id) FROM patient) IS NULL THEN 'PAT_0' ELSE CONCAT('PAT_', (SELECT MAX(id) FROM patient)) END AS ref_id;",
        nativeQuery = true
    )
    String generateReferenceId();

    @Query(value = """
        SELECT *, (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age FROM (SELECT * FROM clinic_patient cp INNER JOIN patient p ON cp.patient_id = p.id) as t WHERE t.clinic_id = :clinicId
        """, nativeQuery = true)
    List<Patient> findAllByClinicId(@Param("clinicId") int clinicId);    

    @Query(value = """
            SELECT *, (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age FROM patient AS p WHERE p.name LIKE :name
            """, nativeQuery = true)
    Page<Patient> searchByName(Pageable pageable, @Param("name") String name);

    @Query(value = """
            SELECT *, (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age FROM patient AS p WHERE p.reference_id LIKE :refId
            """, nativeQuery = true)
    Page<Patient> searchByRefId(Pageable pageable, @Param("refId") String refId);

    @Query(value = """
            SELECT *, (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age FROM patient AS p WHERE p.email LIKE :email
            """, nativeQuery = true)
    Page<Patient> searchByEmail(Pageable pageable, @Param("email") String email);

    @Query(value = """
            SELECT *, (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age FROM patient AS p WHERE p.telephone LIKE :telephone
            """, nativeQuery = true)
    Page<Patient> searchByTelephone(Pageable pageable, @Param("telephone") String telephone);

    @Query(value = "SELECT DATE(created_at) AS creationDate, COUNT(*) AS accountsCreated FROM patient WHERE created_at BETWEEN :startDate AND :endDate GROUP BY DATE(created_at) ORDER BY creationDate ASC", nativeQuery = true)
    List<PatientRegistrationTrendDto> getPatientRegistrationTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT ageGroup, COUNT(*) AS totalPatients
        FROM (
        SELECT 
                CASE 
                WHEN age >= 50 THEN '50+'
                WHEN age >= 25 THEN '25+'
                WHEN age >= 18 THEN '18+'
                WHEN age >= 10 THEN '10+'
                ELSE '<10'
                END AS ageGroup
        FROM (
                SELECT 
                (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - 
                (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age
                FROM patient
        ) AS age_subquery
        ) AS grouped
        GROUP BY ageGroup
        ORDER BY 
        CASE ageGroup
                WHEN '<10' THEN 1
                WHEN '10+' THEN 2
                WHEN '18+' THEN 3
                WHEN '25+' THEN 4
                WHEN '50+' THEN 5
        END
        """, nativeQuery = true)
    List<PatientAgeDistributionTrendDto> getPatientAgeDistributionTrend();

    @Query(value = """
                SELECT 
                COUNT(*) AS totalPatients,

                SUM(CASE 
                        WHEN created_at BETWEEN :startDate AND :endDate 
                        THEN 1 
                        ELSE 0 
                        END) AS newPatientsInPeriod,

                SUM(CASE 
                        WHEN age >= 50 THEN 1 
                        ELSE 0 
                        END) AS age50Plus,

                SUM(CASE 
                        WHEN age >= 25 AND age < 50 THEN 1 
                        ELSE 0 
                        END) AS age25To49,

                SUM(CASE 
                        WHEN age >= 18 AND age < 25 THEN 1 
                        ELSE 0 
                        END) AS age18To24,

                SUM(CASE 
                        WHEN age >= 10 AND age < 18 THEN 1 
                        ELSE 0 
                        END) AS age10To17,

                SUM(CASE 
                        WHEN age < 10 THEN 1 
                        ELSE 0 
                        END) AS ageBelow10

                FROM (
                SELECT 
                        *,
                        (YEAR(CURDATE()) - YEAR(STR_TO_DATE(birthday, '%Y-%m-%d')) - 
                        (DATE_FORMAT(CURDATE(), '%m-%d') < DATE_FORMAT(STR_TO_DATE(birthday, '%Y-%m-%d'), '%m-%d'))) AS age
                FROM patient
                ) AS sub;

                    """, nativeQuery = true)
    PatientRegistrationSummaryDto getPatientRegistrationSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
