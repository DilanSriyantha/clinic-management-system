package org.cms.Authentication;

import lombok.RequiredArgsConstructor;
import org.cms.Configurations.JwtService;
import org.cms.Enums.Role;
import org.cms.Enums.Status;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .referenceId(generateReferenceId(request.getRole()))
                .imagePath(request.getImagePath())
                .birthday(request.getBirthday())
                .email(request.getEmail())
                .address(request.getAddress())
                .telephone(request.getTelephone())
                .percentage(request.getPercentage())
                .status(Status.ACTIVE)
                .role(request.getRole())
                .build();
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        request.getReferenceId(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByReferenceId(request.getReferenceId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    private String generateReferenceId(Role role) {
        var lastUser = userRepository.findFirstByRoleOrderByCreatedAtDesc(role)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        int lastId = lastUser != null ? lastUser.getId() : 0;

        return role.name() + "_" + (lastId + 1);
    }
}
