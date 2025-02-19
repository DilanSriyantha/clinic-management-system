package org.cms.SystemAdministration.Repositories;

import org.cms.SystemAdministration.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// this will be auto implemented by Spring into a Bean called userRepository
// crud refers create, read, update, delete
public interface UserRepository extends JpaRepository<User, Integer> {
    User findFirstByRoleOrderByCreatedAtDesc(int role);
    Optional<User> findByReferenceId(String refId);
}
