package com.celebrateverse.service;

import com.celebrateverse.dto.request.CreateWishRequest;
import com.celebrateverse.dto.response.WishResponse;
import com.celebrateverse.entity.BirthdayPage;
import com.celebrateverse.entity.Wish;
import com.celebrateverse.exception.ResourceNotFoundException;
import com.celebrateverse.exception.UnauthorizedException;
import com.celebrateverse.mapper.WishMapper;
import com.celebrateverse.repository.BirthdayPageRepository;
import com.celebrateverse.repository.WishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishService {

    private final WishRepository wishRepository;
    private final BirthdayPageRepository pageRepository;
    private final WishMapper wishMapper;

    public List<WishResponse> getApprovedWishes(String slug) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));
                
        return wishRepository.findByPageIdAndIsApprovedTrue(page.getId())
                .stream()
                .map(wishMapper::toResponse)
                .collect(Collectors.toList());
    }

    public WishResponse createWish(String slug, CreateWishRequest request) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        Wish wish = Wish.builder()
                .page(page)
                .authorName(request.getAuthorName() != null ? request.getAuthorName() : "Anonymous")
                .message(request.getMessage())
                .reactionEmoji(request.getReactionEmoji())
                .isApproved(true)
                .build();

        wish = wishRepository.save(wish);
        return wishMapper.toResponse(wish);
    }

    public void deleteWish(Long id) {
        Wish wish = wishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wish not found"));

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String currentUserEmail = ((UserDetails) principal).getUsername();
            if (!wish.getPage().getOwnerUser().getEmail().equals(currentUserEmail)) {
                throw new UnauthorizedException("You do not own this page.");
            }
            wishRepository.delete(wish);
        } else {
            throw new UnauthorizedException("User not authenticated.");
        }
    }
}
