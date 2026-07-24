# CelebrateVerse — Fedora Linux Setup Guide

This guide provides step-by-step instructions to set up the development and production runtime environment for **CelebrateVerse** on **Fedora Linux** (Fedora 38/39/40+).

---

## Prerequisites

Ensure your system is updated before installing packages:
```bash
sudo dnf update -y
```

### 1. Install Java 21 (OpenJDK Development Kit)
CelebrateVerse backend is built using Java 21 and Spring Boot 3.x.

```bash
sudo dnf install java-21-openjdk-devel -y
```

Verify installation:
```bash
java -version
javac -version
```
*Expected output: `openjdk version "21.x.x"`*

### 2. Install Maven 3.9+
Maven is required to compile, test, and package the Java backend application.

```bash
sudo dnf install maven -y
```

Verify installation:
```bash
mvn -version
```
*Expected output: `Apache Maven 3.9.x`*

### 3. Install Node.js 20 (via Node Version Manager - NVM)
We recommend managing Node.js via `nvm` to easily switch versions and isolate global npm packages.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Reload bash environment:
```bash
source ~/.bashrc
```

Install and set Node.js 20:
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

Verify installation:
```bash
node --version
npm --version
```
*Expected output: `v20.x.x` for Node and `10.x.x` for npm.*

### 4. Install & Configure MySQL 8 Server
MySQL 8 hosts relational data for celebrations, cards, memories, and users.

```bash
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

Verify MySQL status:
```bash
sudo systemctl status mysqld
```

Run secure installation script (optional for dev, mandatory for production):
```bash
sudo mysql_secure_installation
```

Create the application database and user:
```bash
sudo mysql -u root -p
```
Inside the MySQL shell, execute:
```sql
CREATE DATABASE celebrateverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cvuser'@'localhost' IDENTIFIED BY 'cvpassword';
GRANT ALL PRIVILEGES ON celebrateverse.* TO 'cvuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Test database connection:
```bash
mysql -u cvuser -pcvpassword -D celebrateverse -e "SELECT 1;"
```

### 5. Install Docker Engine & Docker Compose
Docker isolates containers for MySQL, Backend, Frontend, and Nginx.

```bash
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```
*(Note: If `docker-ce` is not in standard Fedora repositories, enable Docker CE repo first:)*
```bash
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```

Start and enable Docker service:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Add your current user to the `docker` usergroup (eliminates needing `sudo` for `docker` commands):
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Verify Docker installation:
```bash
docker --version
docker compose version
```

---

## Project Setup

### 1. Clone & Environment Configuration
```bash
git clone https://github.com/yourusername/celebrateverse.git
cd celebrateverse
```

Create local environment configurations from templates:
```bash
cp infra/docker/.env.example infra/docker/.env
```
Edit `infra/docker/.env` using your preferred editor (`nano`, `vim`, or VS Code):
```bash
nano infra/docker/.env
```

### 2. Backend Environment Setup
```bash
cd backend
cp src/main/resources/application.yml src/main/resources/application-local.yml
```
Ensure database credentials, JWT secret key, and Cloudinary/AI keys match your target local instance.

### 3. Frontend Environment Setup
```bash
cd ../frontend
cp .env.local.example .env.local
```
Set `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`.

---

## Running in Development Mode

### Running Backend (Spring Boot)
From the repository root:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- **Backend API Base**: `http://localhost:8080/api/v1`
- **Swagger UI API Docs**: `http://localhost:8080/swagger-ui.html` or `http://localhost:8080/swagger-ui/index.html`

### Running Frontend (Next.js)
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- **Frontend App**: `http://localhost:3000`

---

## Running with Docker Compose

To spin up the complete containerized stack (MySQL, Backend, Frontend, and Nginx reverse proxy):

```bash
cd infra/docker
cp .env.example .env
# Update .env variables if needed
docker compose up -d --build
```

To monitor container status and logs:
```bash
docker compose ps
docker compose logs -f
```

To stop the entire stack:
```bash
docker compose down
```

### Service Map
| Service | Internal Container Port | Host Port | External Access URL |
| :--- | :--- | :--- | :--- |
| **Nginx Proxy** | 80 / 443 | 80 / 443 | `http://localhost` / `https://localhost` |
| **Frontend** | 3000 | 3000 | `http://localhost:3000` |
| **Backend API** | 8080 | 8080 | `http://localhost:8080` |
| **MySQL DB** | 3306 | 3306 | `localhost:3306` |

---

## Fedora Specific Considerations

### 1. Firewall (firewalld) Configuration
Fedora enables `firewalld` by default. If accessing services from another machine on your local network, allow ports 80, 443, 3000, and 8080:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### 2. SELinux Adjustments
Fedora uses SELinux in Enforcing mode. If Docker container volumes face permission issues:
- Add `:z` or `:Z` flags to bind mounts in `docker-compose.yml` if necessary.
- Allow Docker to connect to network sockets:
```bash
sudo setsebool -P container_manage_dns 1
```

---

## Troubleshooting Guide

### Issue 1: MySQL Port 3306 Conflict
**Symptom**: `docker compose up` fails with `port is already allocated`.
**Solution**: Local `mysqld` service is running on port 3306. Either stop local MySQL or change `MYSQL_PORT` in `.env` to `3307`:
```bash
sudo systemctl stop mysqld
# OR edit .env -> MYSQL_PORT=3307
```

### Issue 2: Permission Denied on `docker.sock`
**Symptom**: `Got permission denied while trying to connect to the Docker daemon socket`.
**Solution**: Ensure your user is in the `docker` group and apply membership:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Issue 3: Node `node-gyp` or Native Build Errors during `npm install`
**Symptom**: Compilation failure on native C++ npm dependencies.
**Solution**: Install GNU C++ compiler and development headers:
```bash
sudo dnf groupinstall "Development Tools" -y
sudo dnf install gcc-c++ make -y
```

### Issue 4: Java Version Mismatch
**Symptom**: `UnsupportedClassVersionError` when running `mvn spring-boot:run`.
**Solution**: Verify active Java version with `java -version` and set `JAVA_HOME`:
```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

---

## Systemd Service (Optional Production Setup)

To auto-start CelebrateVerse on system boot using Docker Compose:

Create `/etc/systemd/system/celebrateverse.service`:
```ini
[Unit]
Description=CelebrateVerse Docker Compose Application
Requires=docker.service
After=docker.service network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/sahil-khajuria/birthday/infra/docker
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start systemd service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable celebrateverse
sudo systemctl start celebrateverse
```
