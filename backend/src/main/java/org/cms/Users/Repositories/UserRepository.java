package org.cms.Users.Repositories;

import org.cms.Enums.Role;
import org.cms.Users.Models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// this will be auto implemented by Spring into a Bean called userRepository
// crud refers create, read, update, delete
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findFirstByRoleOrderByCreatedAtDesc(Role role);
    Optional<User> findByRoleAndReferenceId(Role role, String referenceId);
    Optional<User> findByReferenceId(String refId);
    Optional<User> findByEmail(String email);
    Iterable<User> findAllByRole(Role role);
    Page<User> findAllByRole(Role role, Pageable pageable);
}
