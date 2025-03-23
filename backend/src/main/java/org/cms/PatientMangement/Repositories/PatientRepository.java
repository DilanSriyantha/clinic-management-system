package org.cms.PatientMangement.Repositories;

import org.cms.PatientMangement.Models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    
}
