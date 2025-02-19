package org.cms.SystemAdministration.Services;

import org.cms.Enums.Role;
import org.cms.SystemAdministration.Models.User;
import org.cms.SystemAdministration.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(User user) {
        User lastUser = userRepository.findFirstByRoleOrderByCreatedAtDesc(user.getRole());
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

    private String generateReferenceId(int lastId, int role) {
        return Role.valueOf(role) + "_" + (lastId + 1);
    }
}
