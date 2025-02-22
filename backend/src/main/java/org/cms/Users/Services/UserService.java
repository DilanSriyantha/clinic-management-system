package org.cms.Users.Services;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.Enums.Role;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public ResponseEntity<Iterable<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    public ResponseEntity<Iterable<User>> getPage(String role, int page, int pageSize, HttpServletResponse response) {
        Pageable pageable = PageRequest.of(page, pageSize);

        final int totalPages = (int)Math.ceil((double)userRepository.count() / pageSize);
        response.setIntHeader("X-Total-Pages", totalPages);

        return ResponseEntity.ok(userRepository.findAllByRole(Role.valueOf(role), pageable));
    }

    public User create(User user) {
        User lastUser = userRepository.findFirstByRoleOrderByCreatedAtDesc(user.getRole())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        int lastId = lastUser != null ? lastUser.getId() : 0;

        user.setReferenceId(generateReferenceId(lastId, user.getRole()));

        return userRepository.save(user);
    }

    public User update(User newUserDetails, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try{
            Field[] fields = newUserDetails.getClass().getDeclaredFields();
            for(Field field : fields){
                field.setAccessible(true);
                if(field.get(newUserDetails) != null) {
                    Field userField = user.getClass().getDeclaredField(field.getName());
                    userField.setAccessible(true);
                    userField.set(user, field.get(newUserDetails));
                }
            }
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }

        return user;
    }

    public User delete(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return user;
    }

    public boolean hasAtLeastOneAdmin() {
        Iterable<User> admins = userRepository.findAllByRole(Role.ADMIN);

        return admins.iterator().hasNext();
    }

    private String generateReferenceId(int lastId, Role role) {
        return role.name() + "_" + (lastId + 1);
    }
}
