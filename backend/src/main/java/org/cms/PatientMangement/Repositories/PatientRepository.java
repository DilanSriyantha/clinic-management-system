package org.cms.PatientMangement.Repositories;

import java.util.List;

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
}
