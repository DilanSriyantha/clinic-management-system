package org.cms.Authentication;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.cms.Configurations.JwtService;
import org.cms.Enums.Role;
import org.cms.Enums.Status;
import org.cms.Users.Models.User;
import org.cms.Users.Repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

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
                .specialization(request.getSpecialization())
                .build();
        userRepository.save(user);

        var jwtAccessToken = jwtService.generateAccessToken(user);
        var jwtRefreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .user(user)
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        System.out.println(request.getEmail() + " " + request.getPassword());

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        System.out.println(user.getName());

        Authentication authentication;
        try{
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        }catch (BadCredentialsException e) {
            e.printStackTrace();
            System.out.println(passwordEncoder.matches(request.getPassword(), user.getPassword()));
            throw new BadCredentialsException("Invalid Email or Password");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        var jwtAccessToken = jwtService.generateAccessToken(user);
        var jwtRefreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .user(user)
                .build();
    }

    public AuthResponse refresh(String authHeader) throws BadRequestException, UsernameNotFoundException {
        if(!authHeader.startsWith("Bearer "))
            throw new BadRequestException("Invalid token format");

        var refreshToken = authHeader.substring(7);
        String username = jwtService.extractEmail(refreshToken);
        System.out.println(username);

        if(username == null)
            throw new BadRequestException("Invalid refresh token");

        var userDetails = userDetailsService.loadUserByUsername(username);

        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if(!jwtService.isTokenValid(refreshToken, userDetails))
            throw new BadRequestException("Invalid refresh token");

        var accessToken = jwtService.generateAccessToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .build();
    }

    private String generateReferenceId(Role role) {
        var lastUser = userRepository.findFirstByRoleOrderByCreatedAtDesc(role);

        int lastId = lastUser.isPresent() ? lastUser.get().getId() : 0;

        return role.name() + "_" + (lastId + 1);
    }
}
