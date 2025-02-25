package org.cms.Users.Controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.Enums.Role;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.cms.Users.Services.UserService;
import org.cms.Utils.BasicResultSet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // means the class is a controller
@RequestMapping("/api/v1/users") // means URL's start with /api/v1/users (after application path)
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private final UserService userService;

    @PostMapping(path = "/create")
    public @ResponseBody User createUser(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping(path = "/all")
    public @ResponseBody ResponseEntity<Iterable<User>> getAllUsers() {
        return userService.getAll();
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
        return userService.getPage(role, page, pageSize, response);
    }

    @GetMapping(path = "/byRole")
    public @ResponseBody Iterable<User> getUsersByRole(@RequestParam String role) {
        return userRepository.findAllByRole(Role.valueOf(role));
    }

    @DeleteMapping(path = "/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> deleteUser(@RequestBody Iterable<Integer> ids) {
        return ResponseEntity.ok(userService.delete(ids));
    }

    @PutMapping(path = "/update")
    public @ResponseBody User updateUser(@RequestBody User user, @RequestParam int userId) {
        return userService.update(user, userId);
    }
}
