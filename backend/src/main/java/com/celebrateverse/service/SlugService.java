package com.celebrateverse.service;

import com.celebrateverse.repository.BirthdayPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class SlugService {
    
    private final BirthdayPageRepository pageRepository;
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int SLUG_LENGTH = 8;
    private final SecureRandom random = new SecureRandom();

    public String generateUniqueSlug() {
        for (int i = 0; i < 5; i++) {
            String slug = generateRandomSlug();
            if (pageRepository.findBySlug(slug).isEmpty()) {
                return slug;
            }
        }
        throw new RuntimeException("Could not generate a unique slug after 5 attempts");
    }
    
    private String generateRandomSlug() {
        StringBuilder sb = new StringBuilder(SLUG_LENGTH);
        for (int i = 0; i < SLUG_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}
