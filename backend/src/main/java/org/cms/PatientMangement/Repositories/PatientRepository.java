package org.cms.PatientMangement.Repositories;

import org.cms.PatientMangement.Models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query(
        value = "SELECT CASE WHEN (SELECT MAX(id) FROM patient) IS NULL THEN 'PAT_0' ELSE CONCAT('PAT_', (SELECT MAX(id) FROM patient)) END AS ref_id;",
        nativeQuery = true
    )
    String generateReferenceId();
}
