package org.cms.ClinicManagement.Repositories;

import jakarta.transaction.Transactional;
import org.cms.ClinicManagement.Models.Clinic;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
}
