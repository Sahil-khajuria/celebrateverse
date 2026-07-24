package com.celebrateverse.service;

import com.celebrateverse.dto.request.CreatePageRequest;
import com.celebrateverse.dto.request.UpdatePageRequest;
import com.celebrateverse.dto.response.PageResponse;
import com.celebrateverse.dto.response.PageSummaryResponse;
import com.celebrateverse.dto.response.PublicPageResponse;
import com.celebrateverse.entity.BirthdayPage;
import com.celebrateverse.entity.User;
import com.celebrateverse.exception.ResourceNotFoundException;
import com.celebrateverse.exception.UnauthorizedException;
import com.celebrateverse.mapper.PageMapper;
import com.celebrateverse.repository.BirthdayPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PageService {

    private final BirthdayPageRepository pageRepository;
    private final UserService userService;
    private final SlugService slugService;
    private final PageMapper pageMapper;
    private final PasswordEncoder passwordEncoder;
    private final QrService qrService;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Transactional
    public PageResponse createPage(CreatePageRequest request, String userEmail) {
        User owner = userService.loadByEmail(userEmail);
        String slug = slugService.generateUniqueSlug();

        BirthdayPage page = BirthdayPage.builder()
                .slug(slug)
                .ownerUser(owner)
                .recipientName(request.getRecipientName())
                .recipientNickname(request.getRecipientNickname())
                .recipientAge(request.getRecipientAge())
                .recipientBirthday(request.getRecipientBirthday())
                .favoriteColor(request.getFavoriteColor())
                .favoriteMusicGenre(request.getFavoriteMusicGenre())
                .senderName(request.getSenderName())
                .senderRelationship(request.getSenderRelationship())
                .personalMessage(request.getPersonalMessage())
                .theme(request.getTheme() != null ? request.getTheme() : "classic_gold")
                .cakeTheme(request.getCakeTheme() != null ? request.getCakeTheme() : "default")
                .mode(request.getMode() != null ? request.getMode() : "QUICK")
                .isPasswordProtected(request.getIsPasswordProtected() != null ? request.getIsPasswordProtected() : false)
                .pagePasswordHash(request.getPagePassword() != null && !request.getPagePassword().isEmpty() ? passwordEncoder.encode(request.getPagePassword()) : null)
                .revealAt(request.getRevealAt())
                .isCalmModeDefault(request.getIsCalmModeDefault() != null ? request.getIsCalmModeDefault() : false)
                .viewCount(0)
                .isPublished(false)
                .build();

        page = pageRepository.save(page);
        
        PageResponse response = pageMapper.toResponse(page);
        response.setShareUrl(appBaseUrl + "/p/" + slug);
        return response;
    }

    @Transactional
    public PublicPageResponse getBySlug(String slug) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));
        
        pageRepository.incrementViewCount(page.getId());
        
        PublicPageResponse response = pageMapper.toPublicResponse(page);
        response.setShareUrl(appBaseUrl + "/p/" + slug);
        return response;
    }

    @Transactional
    public PageResponse updatePage(String slug, UpdatePageRequest request, String userEmail) {
        BirthdayPage page = getPageBySlugAndOwner(slug, userEmail);

        page.setRecipientName(request.getRecipientName());
        page.setRecipientNickname(request.getRecipientNickname());
        page.setRecipientAge(request.getRecipientAge());
        page.setRecipientBirthday(request.getRecipientBirthday());
        page.setFavoriteColor(request.getFavoriteColor());
        page.setFavoriteMusicGenre(request.getFavoriteMusicGenre());
        page.setSenderName(request.getSenderName());
        page.setSenderRelationship(request.getSenderRelationship());
        page.setPersonalMessage(request.getPersonalMessage());
        if (request.getTheme() != null) page.setTheme(request.getTheme());
        if (request.getCakeTheme() != null) page.setCakeTheme(request.getCakeTheme());
        if (request.getMode() != null) page.setMode(request.getMode());
        if (request.getRevealAt() != null) page.setRevealAt(request.getRevealAt());
        if (request.getIsCalmModeDefault() != null) page.setIsCalmModeDefault(request.getIsCalmModeDefault());
        if (request.getIsPasswordProtected() != null) {
            page.setIsPasswordProtected(request.getIsPasswordProtected());
            if (request.getIsPasswordProtected() && request.getPagePassword() != null && !request.getPagePassword().isEmpty()) {
                page.setPagePasswordHash(passwordEncoder.encode(request.getPagePassword()));
            }
        }

        page = pageRepository.save(page);
        PageResponse response = pageMapper.toResponse(page);
        response.setShareUrl(appBaseUrl + "/p/" + slug);
        return response;
    }

    @Transactional
    public void deletePage(String slug, String userEmail) {
        BirthdayPage page = getPageBySlugAndOwner(slug, userEmail);
        pageRepository.delete(page);
    }

    @Transactional
    public PageResponse publishPage(String slug, String userEmail) {
        BirthdayPage page = getPageBySlugAndOwner(slug, userEmail);
        page.setIsPublished(true);
        page = pageRepository.save(page);
        
        PageResponse response = pageMapper.toResponse(page);
        response.setShareUrl(appBaseUrl + "/p/" + slug);
        return response;
    }

    public byte[] getQrCode(String slug) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));
        return qrService.generateQrCode(appBaseUrl + "/p/" + page.getSlug());
    }

    @Transactional
    public void setPassword(String slug, String password, String userEmail) {
        BirthdayPage page = getPageBySlugAndOwner(slug, userEmail);
        page.setIsPasswordProtected(true);
        page.setPagePasswordHash(passwordEncoder.encode(password));
        pageRepository.save(page);
    }

    public boolean verifyPassword(String slug, String password) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));
                
        if (!page.getIsPasswordProtected()) {
            return true;
        }
        
        return passwordEncoder.matches(password, page.getPagePasswordHash());
    }

    public List<PageSummaryResponse> getDashboardPages(String userEmail) {
        User owner = userService.loadByEmail(userEmail);
        return pageRepository.findByOwnerUserId(owner.getId()).stream()
                .map(page -> {
                    PageSummaryResponse summary = new PageSummaryResponse();
                    summary.setId(page.getId());
                    summary.setSlug(page.getSlug());
                    summary.setRecipientName(page.getRecipientName());
                    summary.setTheme(page.getTheme());
                    summary.setViewCount(page.getViewCount());
                    summary.setCreatedAt(page.getCreatedAt());
                    summary.setShareUrl(appBaseUrl + "/p/" + page.getSlug());
                    // Wish count not directly loaded here, ideally loaded via a specific query for performance
                    summary.setWishCount(0L); 
                    return summary;
                })
                .collect(Collectors.toList());
    }
    
    private BirthdayPage getPageBySlugAndOwner(String slug, String userEmail) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));
                
        if (!page.getOwnerUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You do not own this page.");
        }
        return page;
    }
}
