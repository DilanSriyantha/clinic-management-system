package org.cms.PrescriptionManagement.Repositories;

import org.cms.PrescriptionManagement.Models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    
}
