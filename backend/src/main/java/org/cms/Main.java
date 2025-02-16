package org.cms;

import org.cms.System.System;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        System.getInstance().start(Main.class, args);
    }

    @Bean
    public WebMvcConfigurer configCors() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedOrigins("*")
                        .allowedHeaders("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}