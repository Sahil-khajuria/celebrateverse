```
  ____ _____ _     _____ ____  ____    _  _____ _____     _____ ____  ____  _____ 
 / ___| ____| |   | ____| __ )|  _ \  / \|_   _| ____|   |  ___/ ___|/ ___|| ____|
| |   |  _| | |   |  _| |  _ \| |_) |/ _ \ | | |  _|     | |_  \___ \\___ \|  _|  
| |___| |___| |___| |___| |_) |  _ <| ___ \| | | |___    |  _|  ___) |___) | |___ 
 \____|_____|_____|_____|____/|_| \_\_/   \_\_| |_____|  |_|   |____/|____/|_____|
```

# CelebrateVerse 🎂🎉

> **Create, Personalize, Schedule & Share Unforgettable Digital Celebrations**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/celebrateverse/actions)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-green.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**CelebrateVerse** is a modern, full-stack digital celebration platform designed to craft immersive, personalized milestone experiences—from birthdays and anniversaries to graduations and farewells. It features collaborative memory walls, interactive greeting cards, AI-generated custom wishes, countdown surprise reveals, and virtual gift unwrapping.

---

## 🌟 Features

- 🎨 **Interactive Card Builder**: Craft customizable digital greeting cards with dynamic typography, animated stickers, and sound effects.
- 📸 **Collaborative Memory Wall**: Invite friends and family to upload high-resolution photos, videos, and voice messages.
- 🤖 **AI Wish Engine**: Generate personalized, creative, or humorous messages powered by Google Gemini AI.
- ⏳ **Countdown Reveal Timer**: Keep media walls and gift boxes locked until the exact birthday or anniversary date.
- 🎁 **3D Virtual Gift Box**: Recipient can interactively unwrap digital gift cards, vouchers, and secret messages.
- 💌 **RSVP & Guestbook Tracking**: Track guest attendance, dietary preferences, and real-time celebratory wishes.
- 🔐 **Privacy Controls**: Secure celebration spaces with passcodes, unlisted links, or public visibility.
- ⚡ **Cloudinary CDN Integration**: High-speed, optimized media storage for photos and video memories.
- 🛡️ **Production Ready**: Fully containerized stack with Nginx SSL termination, rate limiting, and security headers.

---

## 🏗️ Architecture Overview

```
                                +-----------------------------------+
                                |            User Browser           |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |            Nginx Proxy            |
                                |       (Ports 80 / 443 HTTPS)      |
                                +--------+----------------+---------+
                                         |                |
                       (Frontend Assets) |                | (REST API)
                                         v                v
              +----------------------------------+  +----------------------------------+
              |   Next.js Frontend (Port 3000)   |  |   Spring Boot Backend (Port 8080)|
              |   - React 18 / Tailwind CSS      |  |   - Java 21 / Spring Security    |
              |   - Framer Motion / Lucide Icons |  |   - Spring Data JPA / REST       |
              +----------------------------------+  +-----------------+----------------+
                                                                      |
                                                     +----------------+----------------+
                                                     |                |                |
                                                     v                v                v
                                             +---------------+ +------------+ +---------------+
                                             | MySQL 8 DB    | | Cloudinary | |  Gemini AI    |
                                             | (Port 3306)   | | Media CDN  | | Wish Generator|
                                             +---------------+ +------------+ +---------------+
```

---

## 📸 Screenshots

*(Add screenshots of your application here)*

| Celebration Dashboard | Interactive Memory Wall |
| :---: | :---: |
| ![Dashboard Placeholder](docs/images/dashboard.png) | ![Memory Wall Placeholder](docs/images/memory-wall.png) |

| AI Wish Generator | Virtual Gift Unwrap |
| :---: | :---: |
| ![AI Generator Placeholder](docs/images/ai-generator.png) | ![Gift Unwrap Placeholder](docs/images/gift-unwrap.png) |

---

## ⚡ Quick Start with Docker Compose

Ensure Docker and Docker Compose are installed on your system.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/celebrateverse.git
cd celebrateverse

# 2. Configure environment variables
cp infra/docker/.env.example infra/docker/.env

# 3. Spin up the full stack
cd infra/docker
docker compose up -d --build
```

Access the application services:
- **Frontend App**: `http://localhost:3000` (or `http://localhost` via Nginx)
- **Backend REST API**: `http://localhost:8080/api/v1`
- **Swagger API Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 🛠️ Development Setup

For local step-by-step installation on Fedora Linux, see [docs/setup-fedora.md](docs/setup-fedora.md).

### Prerequisites
- **Java**: OpenJDK 21+
- **Maven**: 3.9+
- **Node.js**: v20+
- **Database**: MySQL 8.0+

### 1. Run Database Initialization
```bash
sudo systemctl start mysqld
mysql -u root -p < infra/docker/init.sql
```

### 2. Start Backend Service
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Start Frontend Service
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

| Variable Key | Description | Default / Example Value |
| :--- | :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | MySQL root database password | `rootpassword` |
| `MYSQL_USER` | Application database username | `cvuser` |
| `MYSQL_PASSWORD` | Application database password | `cvpassword` |
| `MYSQL_PORT` | Host exposed port for MySQL | `3306` |
| `JWT_SECRET` | Base64-encoded secret key for signing JWTs | `your-256-bit-jwt-secret-key-change-this` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret_api_key` |
| `AI_API_KEY` | Google Gemini AI Studio API key | `AIzaSy...` |
| `DOMAIN` | Application production domain name | `localhost` |
| `APP_BASE_URL` | Base URL of web application | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Frontend API client base URL | `http://localhost:8080/api/v1` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins for API | `http://localhost:3000` |

---

## 📚 API Documentation

When the backend application is running, open interactive OpenAPI / Swagger UI in your browser:
- `http://localhost:8080/swagger-ui.html`

Comprehensive functional and system requirements are documented in [docs/srs.md](docs/srs.md).

---

## 🤝 Contributing

We welcome contributions to CelebrateVerse! Please follow these steps:
1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
