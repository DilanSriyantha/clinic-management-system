package org.cms.Users.Controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.cms.Users.Models.User;
import org.cms.Users.DTOs.UserAccountCreateTrendDto;
import org.cms.Users.DTOs.UserAccountsSummaryDto;
import org.cms.Users.DTOs.UserDistributionDto;
import org.cms.Users.DTOs.UserDto;
import org.cms.Users.Models.HardPasswordResetRequest;
import org.cms.Users.Models.SoftPasswordResetRequest;
import org.cms.Users.Services.UserService;
import org.cms.Utils.BasicResultSet;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.security.auth.login.CredentialException;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public @ResponseBody User createUser(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping("/all")
    public @ResponseBody ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @CrossOrigin(exposedHeaders = "X-Total-Pages")
    @GetMapping("/page")
    public @ResponseBody ResponseEntity<Page<UserDto>> getPage(
            @RequestParam(defaultValue = "ADMIN") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        System.out.println(request.getHeader("Authorization"));
        return ResponseEntity.ok(userService.getPage(role, page, pageSize, response));
    }
    
    @GetMapping("/searchByEmail")
    public @ResponseBody ResponseEntity<Page<UserDto>> handleSearchByEmail(@RequestParam(defaultValue = "ADMIN") String role, @RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(userService.searchByEmail(role, page, pageSize, searchKey));
    }

    @GetMapping("/searchByName")
    public @ResponseBody ResponseEntity<Page<UserDto>> handleSearchByName(@RequestParam(defaultValue = "ADMIN") String role, @RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(userService.searchByName(role, page, pageSize, searchKey));
    }

    @GetMapping("/searchByRefId")
    public @ResponseBody ResponseEntity<Page<UserDto>> handleSearchByRefId(@RequestParam(defaultValue = "ADMIN") String role, @RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(userService.searchByReferenceId(role, page, pageSize, searchKey));
    }

    @GetMapping("/searchByTelephone")
    public @ResponseBody ResponseEntity<Page<UserDto>> handleSearchByTelephone(@RequestParam(defaultValue = "ADMIN") String role, @RequestParam int page, @RequestParam int pageSize, @RequestParam String searchKey) {
        return ResponseEntity.ok(userService.searchByTelephone(role, page, pageSize, searchKey));
    }

    @GetMapping("/byRole")
    public @ResponseBody Iterable<UserDto> getUsersByRole(@RequestParam String role) {
        return userService.getByRole(role);
    }

    @DeleteMapping("/delete")
    public @ResponseBody ResponseEntity<BasicResultSet> deleteUser(@RequestBody Iterable<Integer> ids) {
        return ResponseEntity.ok(userService.delete(ids));
    }

    @PutMapping("/update")
    public @ResponseBody ResponseEntity<BasicResultSet> updateUser(@RequestBody User user, @RequestParam int userId) {
        return ResponseEntity.ok(userService.update(user, userId));
    }

    @PutMapping("/resetPassword")
    public @ResponseBody ResponseEntity<BasicResultSet> resetPassword(@RequestBody SoftPasswordResetRequest request, @RequestParam int userId) throws CredentialException {
        return ResponseEntity.ok(userService.resetPassword(userId, request));
    }

    @PutMapping("/hardResetPassword")
    public @ResponseBody ResponseEntity<BasicResultSet> hardResetPassword(@RequestBody HardPasswordResetRequest request, @RequestParam int userId) {
        return ResponseEntity.ok(userService.hardPasswordReset(userId, request));
    }

    @GetMapping("/getUserDistributionByRole")
    public @ResponseBody ResponseEntity<List<UserDistributionDto>> handleGetUserDistributionByRole() {
        return ResponseEntity.ok(userService.getUserDistributionByRole());
    }

    @GetMapping("/getUserAccountCreateTrend")
    public @ResponseBody ResponseEntity<List<UserAccountCreateTrendDto>> handleGetUserAccountCreateTrend(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(userService.getUserAccountCreateTrend(startDate, endDate));
    }

    @GetMapping("/getUserAccountsSummary")
    public @ResponseBody ResponseEntity<UserAccountsSummaryDto> handleGetUserAccountsSummary() {
        return ResponseEntity.ok(userService.getUserAccountsSummary());
    }
}
