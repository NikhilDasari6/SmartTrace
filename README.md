# 🧵 SmartTrace – The Digital Red Thread of Fate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-enabled-blue.svg)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7.svg)](https://render.com/)

**SmartTrace** is a high-performance supply-chain traceability and anti-counterfeit system. It generates secure, cryptographically verifiable serial numbers and manages complex hierarchical aggregations (Unit → Carton → Pallet), ensuring full transparency from production to the end consumer.

---

## 🚀 Key Features

- **🔐 Secure Serial Generation**: 
  - **Primary (Unit)**: Prefix + Timestamp + Sequence + Check Digit.
  - **Secondary (Carton)**: Hybrid secure format with added randomness.
  - **Tertiary (Pallet)**: GS1-compliant 18-digit SSCC.
- **🏗️ Hierarchical Aggregation**: Seamlessly link products through parents (Unit → Carton → Pallet) with configurable rules.
- **🛡️ Anti-Counterfeit Protection**: SHA-256 cryptographic hashing with secret salt rotation for immediate verification.
- **📍 Red Thread Traceability**: Instantly trace any unit back to its batch, production date, and parent containers.
- **⚡ Performance Optimized**: Designed for high-concurrency environments with database queries consistently under 100ms.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL / MariaDB (Supports Aiven/Cloud MySQL)
- **Security**: SHA-256 Hashing via Node.js `crypto`
- **Frontend**: Vanila HTML5, CSS3, JavaScript (ES6+)
- **DevOps**: Docker, Docker Compose, Render

---

## 📂 Project Structure

```text
SmartTrace/
├── SmartTrace-backend/       # Express API & Business Logic
│   ├── src/
│   │   ├── config/           # DB Configuration
│   │   ├── controllers/      # Route Handlers
│   │   ├── routes/           # API Endpoints
│   │   ├── services/         # Serial & Hierarchy Logic
│   │   └── utils/            # Hashing & Check Digits
│   ├── Dockerfile
│   └── migrate.js            # DB Migration Script
├── SmartTrace-frontend/      # Modern Web Interface
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── Dockerfile
├── docker-compose.yml        # Orchestration for local dev
└── render.yaml               # Infrastructure as Code for Render
```

---

## ⚙️ Getting Started

### 🐳 Option 1: Docker (Recommended)
The fastest way to get SmartTrace running locally.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/NikhilDasari6/SmartTrace.git
    cd SmartTrace
    ```
2.  **Configure environment**:
    Update `SmartTrace-backend/.env` (see [Configuration](#-configuration)).
3.  **Spin up the containers**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the app**:
    - Frontend: `http://localhost:8080`
    - Backend: `http://localhost:3000`

### 💻 Option 2: Manual Local Setup

1.  **Install Dependencies**:
    ```bash
    cd SmartTrace-backend && npm install
    ```
2.  **Database Setup**:
    - Ensure MariaDB/MySQL is running.
    - Create a database `smarttrace`.
    - Run the schema found in the project documentation or use `migrate.js`.
3.  **Start Services**:
    ```bash
    npm run dev  # In backend directory
    ```
    Open `SmartTrace-frontend/index.html` in your browser.

---

## 🔑 Configuration

Create a `.env` file in `SmartTrace-backend/`:

```env
DB_HOST=localhost
DB_USER=smarttrace
DB_PASSWORD=your_password
DB_NAME=smarttrace
DB_PORT=3306

HASH_SECRET_SALT=YourSuperSecretSaltHere
HASH_SALT_VERSION=1
```

---

## 🛣️ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/labels/generate` | Generate secure serial numbers for Unit/Carton/Pallet |
| `POST` | `/api/hierarchy/aggregate` | Link a child serial to a parent container |
| `GET` | `/api/hierarchy/trace/:serial` | Get the full "Red Thread" lineage of a serial |
| `GET` | `/api/labels/verify/:serial` | (Planned) Verify authenticity via crypto-hash |

---

## 🔒 Security Design

- **Salted Hashing**: Verification hashes use a secret salt stored only in environment variables.
- **Isolation**: Business logic for serial generation is decoupled from the database layer.
- **Principle of Least Privilege**: DB users are restricted to specific operations on the `smarttrace` schema.

---

## 🚢 Deployment

SmartTrace is optimized for **Render**.
- The `render.yaml` file defines the standard Blueprint for deployment.
- Supports Docker-based runtimes for both frontend and backend.
- Connects to managed MySQL instances (like Aiven) via SSL.

---

## 🔮 Future Roadmap

- [ ] **Verification API**: End-consumer facing verification portal.
- [ ] **Anomaly Detection**: Flagging suspicious verification attempts.
- [ ] **QR Code Integration**: Dynamic generation of QR codes for physical labels.
- [ ] **Mobile App**: Swift/Flutter app for scanning and tracing in the field.

---

## 👥 Authors

- **Nikhil Dasari** - *Lead Developer* - [NikhilDasari6](https://github.com/NikhilDasari6)

---

Developed with ❤️ for secure and transparent supply chains.
