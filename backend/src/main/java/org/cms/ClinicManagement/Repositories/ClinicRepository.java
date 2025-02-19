package org.cms.ClinicManagement.Repositories;

import org.cms.ClinicManagement.Models.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
}
