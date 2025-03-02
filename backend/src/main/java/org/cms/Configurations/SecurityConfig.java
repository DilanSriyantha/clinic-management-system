package org.cms.Configurations;

import lombok.RequiredArgsConstructor;
import org.cms.Enums.Role;
import org.cms.Users.Services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;

    private final JwtAuthFilter jwtAuthFilter;

    private final CorsConfigurationSource corsConfigurationSource;

    private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    if(userService.hasAtLeastOneAdmin()) {
                        System.out.println("Admins count > 0");
                        auth.requestMatchers("/api/v1/auth/register").hasAuthority(Role.ADMIN.name());
                    }else {
                        System.out.println("Admins count = 0");
                        auth.requestMatchers("/api/v1/auth/register").permitAll();
                    }

                    auth.requestMatchers("/api/v1/auth/refresh").permitAll();
                    auth.requestMatchers("/api/v1/auth/authenticate").permitAll();
                    auth.requestMatchers("/api/v1/users/byRole").permitAll();
                    auth.requestMatchers("/api/v1/dashboard/report").permitAll();

                    auth.requestMatchers("/api/v1/users/all").hasAuthority(Role.ADMIN.name());
                    auth.requestMatchers("/api/v1/users/page").hasAuthority(Role.ADMIN.name());
                    auth.requestMatchers("/api/v1/users/create").hasAuthority(Role.ADMIN.name());
                    auth.requestMatchers("/api/v1/users/update").hasAuthority(Role.ADMIN.name());
                    auth.requestMatchers("/api/v1/users/delete").hasAuthority(Role.ADMIN.name());
                    auth.requestMatchers("/api/v1/users/hardResetPassword").hasAuthority(Role.ADMIN.name());

//                    auth.anyRequest().authenticated();
                    auth.anyRequest().permitAll();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
