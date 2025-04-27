package org.cms.PatientMangement.Repositories;

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
            SELECT * FROM patient AS p WHERE p.name LIKE :name
            """, nativeQuery = true)
    Page<Patient> searchByName(Pageable pageable, @Param("name") String name);

    @Query(value = """
            SELECT * FROM patient AS p WHERE p.reference_id LIKE :refId
            """, nativeQuery = true)
    Page<Patient> searchByRefId(Pageable pageable, @Param("refId") String refId);

    @Query(value = """
            SELECT * FROM patient AS p WHERE p.email LIKE :email
            """, nativeQuery = true)
    Page<Patient> searchByEmail(Pageable pageable, @Param("email") String email);

    @Query(value = """
            SELECT * FROM patient AS p WHERE p.telephone LIKE :telephone
            """, nativeQuery = true)
    Page<Patient> searchByTelephone(Pageable pageable, @Param("telephone") String telephone);
}
