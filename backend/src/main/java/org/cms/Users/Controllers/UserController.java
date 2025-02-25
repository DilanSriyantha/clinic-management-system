package org.cms.Users.Controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.Enums.Role;
import org.cms.Users.Models.HardPasswordResetRequest;
import org.cms.Users.Models.SoftPasswordResetRequest;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Users.Services.UserService;
import org.cms.Utils.BasicResultSet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.CredentialException;

@RestController // means the class is a controller
@RequestMapping("/api/v1/users") // means URL's start with /api/v1/users (after application path)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(path = "/create")
    public @ResponseBody User createUser(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping(path = "/all")
    public @ResponseBody ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping(path = "/page")
    public @ResponseBody ResponseEntity<Iterable<User>> getPage(
            @RequestParam(defaultValue = "ADMIN") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        System.out.println(request.getHeader("Authorization"));
        return ResponseEntity.ok(userService.getPage(role, page, pageSize, response));
    }

    @GetMapping(path = "/byRole")
    public @ResponseBody Iterable<User> getUsersByRole(@RequestParam String role) {
        return userService.getByRole(role);
    }

    @DeleteMapping(path = "/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> deleteUser(@RequestBody Iterable<Integer> ids) {
        return ResponseEntity.ok(userService.delete(ids));
    }

    @PutMapping(path = "/update")
    public @ResponseBody ResponseEntity<BasicResultSet> updateUser(@RequestBody User user, @RequestParam int userId) {
        return ResponseEntity.ok(userService.update(user, userId));
    }

    @PutMapping(path = "/resetPassword")
    public @ResponseBody ResponseEntity<BasicResultSet> resetPassword(@RequestBody SoftPasswordResetRequest request, @RequestParam int userId) throws CredentialException {
        return ResponseEntity.ok(userService.resetPassword(userId, request));
    }

    @PutMapping(path = "/hardResetPassword")
    public @ResponseBody ResponseEntity<BasicResultSet> hardResetPassword(@RequestBody HardPasswordResetRequest request, @RequestParam int userId) {
        return ResponseEntity.ok(userService.hardPasswordReset(userId, request));
    }
}
