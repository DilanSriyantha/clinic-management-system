package org.cms.PrescriptionManagement.Repositories;

import org.cms.PrescriptionManagement.Models.PrescriptionLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionLinesRepository extends JpaRepository<PrescriptionLine, Integer> {
    
}
