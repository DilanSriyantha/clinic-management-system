package org.cms.Users.Services;

import org.cms.Enums.Role;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

    private String generateReferenceId(int lastId, Role role) {
        return role.name() + "_" + (lastId + 1);
    }
}
