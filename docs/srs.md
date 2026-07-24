# Software Requirements Specification (SRS) for CelebrateVerse

**Document Version:** 1.0.0  
**Date:** July 23, 2026  
**Status:** Approved  
**Author:** Infrastructure & Backend Architecture Team  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional, non-functional, behavioral, and architectural requirements for **CelebrateVerse**, a comprehensive web platform for creating, personalizing, scheduling, and sharing digital celebration experiences (birthdays, anniversaries, graduations, farewells, and milestones).

### 1.2 Scope
CelebrateVerse enables users to build rich digital celebration spaces featuring customizable greeting cards, multimedia memory walls, AI-generated personalized wishes, scheduled surprise reveals, interactive virtual gift openings, and RSVP tracking. The platform delivers real-time engagement, media storage via Cloudinary, secure authentication via JWT, and responsive UI across web devices.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **JWT**: JSON Web Token
- **REST**: Representational State Transfer
- **RSVP**: Respondez S'il Vous Plait (Event Attendance Confirmation)
- **RBAC**: Role-Based Access Control (Admin, Creator, Contributor, Guest)
- **CDN**: Content Delivery Network (Cloudinary)
- **CSP**: Content Security Policy

---

## 2. Overall Description

### 2.1 Product Perspective
CelebrateVerse operates as a multi-tier web application architecture:
1. **Frontend**: Next.js 14+ / React SPA with server-side rendering (SSR) and dynamic client-side interactions.
2. **Backend API**: Java 21 / Spring Boot RESTful application managing business logic, security, and scheduling.
3. **Database**: MySQL 8.0 relational database storing users, celebrations, cards, memories, and access permissions.
4. **Media Service**: Cloudinary API for secure photo, audio, and video storage and transformation.
5. **AI Integration**: Google AI Studio (Gemini API) for automated wish generation and poetry crafting.
6. **Reverse Proxy**: Nginx handling SSL termination, rate limiting, and request routing.

```
+-----------------------------------------------------------------------+
|                              Nginx Proxy                              |
|                          (Ports 80 / 443 SSL)                         |
+-----------------------------------+-----------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|   Next.js Frontend    |                       |  Spring Boot Backend  |
|     (Port 3000)       |                       |      (Port 8080)      |
+-----------------------+                       +-----------+-----------+
                                                            |
                                        +-------------------+-------------------+
                                        |                   |                   |
                                        v                   v                   v
                                +---------------+   +---------------+   +---------------+
                                |   MySQL DB    |   |  Cloudinary   |   |   Gemini AI   |
                                |  (Port 3306)  |   |   Media Storage|   |  Wishes Engine|
                                +---------------+   +---------------+   +---------------+
```

### 2.2 User Classes and Characteristics
- **Guest / Recipient**: Unauthenticated or authenticated users viewing a celebration page, opening digital cards, and interacting with unlocked memories.
- **Contributor**: Authenticated or link-authorized users uploading photos, videos, written wishes, and audio messages to a shared celebration space.
- **Creator / Host**: Authenticated user who creates, configures, customizes, schedules, and manages celebration events and privacy settings.
- **System Administrator**: Platform operator with system-wide user management, content moderation, and analytics access.

### 2.3 Operating Environment
- Server: Linux (Fedora / Ubuntu / Debian), Docker 24+, Docker Compose 2.20+.
- Client Browsers: Chrome 100+, Firefox 100+, Safari 16+, Edge 100+ (Desktop & Mobile).

---

## 3. Functional Requirements

### 3.1 User Authentication & Authorization
- **FR-1.1 Password Authentication**: The system shall allow users to register and authenticate using email and password with BCrypt password hashing.
- **FR-1.2 Token Session Management**: The system shall issue signed JWT access tokens (expiration: 24h) upon successful authentication.
- **FR-1.3 Role-Based Access Control**: The system shall enforce role permissions across endpoints (`ROLE_ADMIN`, `ROLE_CREATOR`, `ROLE_CONTRIBUTOR`).
- **FR-1.4 Profile Management**: Users shall be able to update their user profile details, avatar, and password.

### 3.2 Celebration Space Management
- **FR-2.1 Celebration Creation**: Hosts shall be able to create a new celebration space with title, event date, target recipient name, theme choice, and custom slug URL.
- **FR-2.2 Privacy Controls**: Hosts shall configure visibility options: Public (searchable), Password-Protected, or Link-Only (Unlisted).
- **FR-2.3 Countdown & Reveal Scheduler**: The system shall enforce countdown locks that conceal surprise content until a designated date/time in the recipient's timezone.
- **FR-2.4 Theme Customization**: Hosts shall select visual themes (Neon Party, Classic Elegant, Retro Confetti, Minimalist Sunset) with custom colors and ambient music track support.

### 3.3 Digital Greeting Cards & Media Walls
- **FR-3.1 Interactive Card Builder**: Hosts and contributors shall create interactive digital cards with custom typography, sticker overlays, and animations.
- **FR-3.2 Collaborative Memory Wall**: Authorized contributors shall upload photos, videos (up to 50MB), audio voice notes, and text messages.
- **FR-3.3 Cloudinary Direct Upload**: Media uploads shall process through Cloudinary with automatic format optimization and thumbnail generation.
- **FR-3.4 Content Moderation**: Hosts shall have full moderation rights to approve, hide, or delete contributed posts on their celebration space.

### 3.4 AI Wish & Message Generation Engine
- **FR-4.1 Gemini AI Prompting**: The system shall integrate with Google AI Studio API to generate personalized birthday/anniversary wishes based on recipient name, relationship, tone (humorous, heartfelt, poetic), and shared memories.
- **FR-4.2 Multi-Language Generation**: The AI engine shall support message generation in English, Spanish, French, German, Hindi, and Japanese.

### 3.5 Interactive Features & RSVPs
- **FR-5.1 Virtual Gift Box**: The system shall support interactive 3D/animated gift boxes that recipients click to unwrap and reveal messages or digital gift cards.
- **FR-5.2 RSVP Form**: Guests shall submit event attendance status, dietary preferences, and plus-one counts for hosted physical/virtual events.
- **FR-5.3 Guestbook Comments**: Guests shall leave real-time messages and emoji reactions on celebration walls.

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **NFR-1 Page Response Time**: Initial page load time for celebration spaces shall not exceed 1.5 seconds under 3G/4G network conditions.
- **NFR-2 API Throughput**: The backend shall handle at least 500 requests/second with average response latencies below 100ms.
- **NFR-3 Static Asset Caching**: Static frontend assets and images shall be cached at client/CDN edge with `Cache-Control` header `max-age=31536000`.

### 4.2 Security Requirements
- **NFR-4 Encryption in Transit**: All external HTTP communication shall enforce HTTPS via TLS 1.2/1.3.
- **NFR-5 Rate Limiting**: The Nginx reverse proxy shall limit API requests to 10 req/sec per IP with burst capacity of 20.
- **NFR-6 Security Headers**: Responses shall mandate `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, and strict `Content-Security-Policy`.
- **NFR-7 SQL Injection & XSS Shielding**: Backend shall use JPA parameterized queries and sanitize HTML input to prevent XSS.

### 4.3 Reliability & Availability
- **NFR-8 Uptime Target**: The system shall maintain 99.9% uptime SLA.
- **NFR-9 Data Resilience**: Automated daily database dumps of MySQL shall be retained for 30 days.

### 4.4 Maintainability & Scalability
- **NFR-10 Containerization**: All components shall execute in isolated Docker containers with health check monitoring.
- **NFR-11 Code Coverage**: Unit and integration tests shall maintain a minimum of 75% line coverage in backend codebase.

---

## 5. System Architecture

```
                  +----------------------------------+
                  |           Client Browser         |
                  +-----------------+----------------+
                                    |
                                    v
                  +----------------------------------+
                  |         Nginx (Port 80/443)      |
                  +--------+----------------+--------+
                           |                |
             (Static/SSR)  |                | (API Requests)
                           v                v
+----------------------------------+  +----------------------------------+
|   Next.js Frontend (Port 3000)   |  |   Spring Boot Backend (Port 8080)|
|   - Tailwind CSS                 |  |   - Spring Security + JWT        |
|   - Framer Motion / Canvas       |  |   - Spring Data JPA              |
+----------------------------------+  |   - AI Integration Controller    |
                                      +-----------------+----------------+
                                                        |
                                       +----------------+----------------+
                                       |                |                |
                                       v                v                v
                             +------------------+ +-----------+ +---------------+
                             | MySQL 8 (Port    | |Cloudinary | | Gemini AI API |
                             | 3306)            | | CDN API   | | Endpoint      |
                             +------------------+ +-----------+ +---------------+
```

---

## 6. Use Cases

### 6.1 Use Case UC-1: Create and Schedule Celebration Space
- **Primary Actor**: Host User
- **Preconditions**: User is registered and authenticated.
- **Main Success Scenario**:
  1. Host navigates to "Create Celebration".
  2. Host fills event details (Recipient Name: "Sophia", Date: "2026-08-15 00:00:00", Theme: "Neon Party").
  3. Host sets password protection and schedules reveal timer.
  4. System validates input, persists celebration in MySQL, generates unique shareable URL (`/c/sophia-2026`).
  5. System presents host dashboard with contributor invite link.

### 6.2 Use Case UC-2: Contributor Adds Photo & Message
- **Primary Actor**: Friend / Contributor
- **Preconditions**: Contributor visits shareable celebration link.
- **Main Success Scenario**:
  1. Contributor clicks "Add Wish & Photo".
  2. Contributor enters name, message, and attaches a photo.
  3. System uploads photo directly to Cloudinary and obtains secure HTTPS URL.
  4. System saves wish record in backend connected to the celebration ID.
  5. Photo and message appear on the celebration memory wall (pending host approval if moderation enabled).

### 6.3 Use Case UC-3: Recipient Unlocks & Experiences Celebration
- **Primary Actor**: Celebration Recipient
- **Preconditions**: Scheduled date/time has passed or recipient enters valid access passcode.
- **Main Success Scenario**:
  1. Recipient opens celebration link.
  2. System verifies timer expiry, plays confetti animation, and unlocks digital cards.
  3. Recipient views memory wall, plays audio messages, and clicks virtual gift box to unwrap gift.

---

## 7. User Stories (BDD Given / When / Then Format)

### US-01: AI Wish Generation
```gherkin
Feature: AI-powered wish generation
  As a contributor struggling to write a birthday wish
  I want the system to generate a personalized message using AI
  So that I can send a meaningful, creative message quickly.

  Scenario: Successfully generating a heartwarming birthday wish
    Given I am on the wish creation form for "Alex"
    And I select tone "Heartfelt" and relationship "Best Friend"
    When I click "Generate AI Wish"
    Then the system calls Gemini AI API
    And populates the text area with a custom 3-paragraph birthday wish for Alex
    And displays an option to regenerate or edit the generated text.
```

### US-02: Countdown Lock Protection
```gherkin
Feature: Celebration countdown lock
  As a host creating a surprise birthday page
  I want secret cards to stay locked until the recipient's actual birthday
  So that the surprise is preserved until the exact day.

  Scenario: Recipient visits page before scheduled date
    Given a celebration space scheduled for "2026-12-25"
    When a user visits the celebration page on "2026-12-20"
    Then the system displays an interactive animated countdown clock
    And keeps media cards, gift boxes, and memory wall blurred and locked.

  Scenario: Recipient visits page on or after scheduled date
    Given a celebration space scheduled for "2026-12-25"
    When a user visits the celebration page on "2026-12-25"
    Then the system triggers a confetti explosion
    And presents full unlocked access to cards, photos, and messages.
```

### US-03: Media Upload to Cloudinary
```gherkin
Feature: Cloudinary media uploads
  As a contributor
  I want to upload high-resolution photos and videos
  So that they render quickly without degrading platform speed.

  Scenario: Contributor uploads a photo memory
    Given I am adding a post to "Sophia's Celebration Wall"
    When I attach a 5MB PNG file "birthday_memory.png" and click submit
    Then the backend delegates upload to Cloudinary CDN
    And receives an optimized WebP image URL
    And saves the URL to MySQL database
    And displays the image on the memory wall within 1 second.
```
