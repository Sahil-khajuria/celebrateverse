package com.celebrateverse.service;

import com.celebrateverse.dto.request.ReorderMediaRequest;
import com.celebrateverse.dto.response.MediaAssetResponse;
import com.celebrateverse.entity.BirthdayPage;
import com.celebrateverse.entity.MediaAsset;
import com.celebrateverse.exception.FileValidationException;
import com.celebrateverse.exception.ResourceNotFoundException;
import com.celebrateverse.exception.UnauthorizedException;
import com.celebrateverse.mapper.MediaAssetMapper;
import com.celebrateverse.repository.BirthdayPageRepository;
import com.celebrateverse.repository.MediaAssetRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaAssetRepository mediaRepository;
    private final BirthdayPageRepository pageRepository;
    private final MediaAssetMapper mediaMapper;
    private final Cloudinary cloudinary;

    @Value("${media.upload-dir:/home/sahil-khajuria/birthday/frontend/public/uploads}")
    private String uploadDir;

    @Value("${media.url-prefix:/uploads}")
    private String urlPrefix;

    @Transactional
    public MediaAssetResponse uploadMedia(Long pageId, MultipartFile file, MediaAsset.MediaType type, String userEmail) {
        BirthdayPage page = getPageAndVerifyOwner(pageId, userEmail);

        if (file.isEmpty()) {
            throw new FileValidationException("File is empty");
        }

        // Validate file type
        validateFileType(file, type);

        String url;
        String cloudinaryPublicId = null;

        // Try Cloudinary first
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            url = uploadResult.get("secure_url").toString();
            cloudinaryPublicId = uploadResult.get("public_id").toString();
            log.info("Uploaded to Cloudinary: {}", url);
        } catch (Exception e) {
            log.warn("Cloudinary upload failed ({}), falling back to local storage", e.getMessage());
            url = saveToLocalDisk(file);
        }

        List<MediaAsset> existingMedia = mediaRepository.findByPageIdOrderBySortOrder(pageId);
        int sortOrder = existingMedia.size();

        MediaAsset asset = MediaAsset.builder()
                .page(page)
                .type(type)
                .url(url)
                .cloudinaryPublicId(cloudinaryPublicId)
                .sortOrder(sortOrder)
                .build();

        asset = mediaRepository.save(asset);
        return mediaMapper.toResponse(asset);
    }

    private String saveToLocalDisk(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("Saved file locally: {}", filePath);
            return urlPrefix + "/" + uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file locally: " + e.getMessage(), e);
        }
    }

    private void validateFileType(MultipartFile file, MediaAsset.MediaType type) {
        String contentType = file.getContentType();
        if (contentType == null) return;

        switch (type) {
            case PHOTO, BALLOON_PHOTO -> {
                if (!contentType.startsWith("image/")) {
                    throw new FileValidationException("File must be an image for type: " + type);
                }
            }
            case VIDEO -> {
                if (!contentType.startsWith("video/")) {
                    throw new FileValidationException("File must be a video");
                }
            }
            case MUSIC, VOICE_NOTE -> {
                if (!contentType.startsWith("audio/")) {
                    throw new FileValidationException("File must be an audio file");
                }
            }
        }

        // Size validation (500MB max)
        long maxSize = 500L * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new FileValidationException("File too large. Maximum size is 500MB");
        }
    }

    @Transactional
    public void deleteMedia(Long pageId, Long mediaId, String userEmail) {
        getPageAndVerifyOwner(pageId, userEmail);

        MediaAsset media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        if (!media.getPage().getId().equals(pageId)) {
            throw new ResourceNotFoundException("Media not found on this page");
        }

        // Delete from local disk if it's a local file
        if (media.getUrl() != null && media.getUrl().startsWith(urlPrefix)) {
            String filename = media.getUrl().substring(urlPrefix.length() + 1);
            Path filePath = Paths.get(uploadDir, filename);
            try {
                Files.deleteIfExists(filePath);
                log.info("Deleted local file: {}", filePath);
            } catch (IOException e) {
                log.warn("Could not delete local file: {}", filePath);
            }
        }

        mediaRepository.delete(media);
    }

    @Transactional
    public void reorderMedia(Long pageId, ReorderMediaRequest request, String userEmail) {
        getPageAndVerifyOwner(pageId, userEmail);
        
        List<MediaAsset> assets = mediaRepository.findByPageIdOrderBySortOrder(pageId);
        Map<Long, MediaAsset> assetMap = assets.stream().collect(Collectors.toMap(MediaAsset::getId, a -> a));
        
        int order = 0;
        for (Long id : request.getAssetIds()) {
            MediaAsset asset = assetMap.get(id);
            if (asset != null) {
                asset.setSortOrder(order++);
                mediaRepository.save(asset);
            }
        }
    }

    private BirthdayPage getPageAndVerifyOwner(Long pageId, String userEmail) {
        BirthdayPage page = pageRepository.findById(pageId)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        if (page.getOwnerUser() == null || !page.getOwnerUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You do not own this page.");
        }
        return page;
    }
}
