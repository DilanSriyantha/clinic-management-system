package org.cms.Users.Services;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.Enums.Role;
import org.cms.Users.DTOs.UserDto;
import org.cms.Users.Models.HardPasswordResetRequest;
import org.cms.Users.Models.SoftPasswordResetRequest;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Utils.BasicResultSet;
import org.cms.Utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.CredentialException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final Function<User, UserDto> rowMapper = (user) -> ModelMapper.getInstance().map(user, UserDto.class);

    public List<UserDto> getAll() {
        return userRepository.findAll().stream().map(rowMapper).collect(Collectors.toList());
    }

    public Page<UserDto> getPage(String role, int page, int pageSize, HttpServletResponse response) {
        Pageable pageable = PageRequest.of(page, pageSize);

        return userRepository.findAllByRole(Role.valueOf(role), pageable).map(rowMapper);
    }

    public List<UserDto> getByRole(String role) {
        return userRepository.findAllByRole(Role.valueOf(role)).stream().map(rowMapper).collect(Collectors.toList());
    }

    public Page<UserDto> searchByEmail(String role, int page, int pageSize, String email) {
        var pageable = PageRequest.of(page, pageSize);

        return userRepository.searchByEmail(pageable, role, "%" + email + "%").map(rowMapper);
    }

    public Page<UserDto> searchByName(String role, int page, int pageSize, String name) {
        var pageable = PageRequest.of(page, pageSize);

        return userRepository.searchByName(pageable, role, "%" + name + "%").map(rowMapper);
    }

    public Page<UserDto> searchByReferenceId(String role, int page, int pageSize, String refId) {
        var pageable = PageRequest.of(page, pageSize);

        return userRepository.searchByRefId(pageable, role, "%" + refId + "%").map(rowMapper);
    }

    public Page<UserDto> searchByTelephone(String role, int page, int pageSize, String phoneNumber) {
        var pageable = PageRequest.of(page, pageSize);

        return userRepository.searchByTelephone(pageable, role, "%" + phoneNumber + "%").map(rowMapper);
    }

    public User create(User user) {
        User lastUser = userRepository.findFirstByRoleOrderByCreatedAtDesc(user.getRole())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        int lastId = lastUser != null ? lastUser.getId() : 0;

        user.setReferenceId(generateReferenceId(lastId, user.getRole()));

        return userRepository.save(user);
    }

    public BasicResultSet update(User newUserDetails, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try{
            Field[] fields = newUserDetails.getClass().getDeclaredFields();
            for(Field field : fields){
                field.setAccessible(true);

                Field userField = user.getClass().getDeclaredField(field.getName());
                userField.setAccessible(true);

                if(field.get(newUserDetails) == null){
                    userField.set(user, userField.get(user));
                    continue;
                }

                userField.set(user, field.get(newUserDetails));
            }

            userRepository.save(user);

            return BasicResultSet.builder()
                    .resultCode(200)
                    .message("User updated successfully.")
                    .build();
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    public BasicResultSet delete(Iterable<Integer> ids) {
        userRepository.deleteAllById(ids);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Users deleted successfully.")
                .build();
    }

    public BasicResultSet resetPassword(int id, SoftPasswordResetRequest request) throws CredentialException {
        var user = userRepository.findById(id)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new CredentialException("Password does not match");

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Password updated successfully")
                .build();
    }

    public BasicResultSet hardPasswordReset(int id, HardPasswordResetRequest request) {
        System.out.println("HardResetRequest PW: " + request.getNewPassword());
        var user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return BasicResultSet.builder()
                .resultCode(200)
                .message("Password reset successful")
                .build();
    }

    public boolean hasAtLeastOneAdmin() {
        Iterable<User> admins = userRepository.findAllByRole(Role.ADMIN);

        return admins.iterator().hasNext();
    }

    private String generateReferenceId(int lastId, Role role) {
        return role.name() + "_" + (lastId + 1);
    }
}
