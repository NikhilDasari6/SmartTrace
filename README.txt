SMARTTRACE – THE DIGITAL RED THREAD OF FATE

SmartTrace is a supply-chain traceability and anti-counterfeit system that generates secure serial numbers for products, manages hierarchical aggregation (unit → carton → pallet), and enables verification using cryptographic hashing.

The system is designed for live demos, hackathons, and scalable backend deployments while following GS1-style principles and secure backend practices.

FEATURES

SERIAL NUMBER GENERATION

Primary Level (Unit):

Format: Prefix + Timestamp + Sequence + Check Digit

Fixed length

Uniquely identifies each individual item

Secondary Level (Carton – Hybrid Secure):

Format: Prefix + Date + Sequence + Random + Check Digit

Fixed length

Adds unpredictability for anti-counterfeit protection

Tertiary Level (Pallet – SSCC):

GS1-compliant 18-digit SSCC

Identifies one physical pallet uniquely

HIERARCHY MANAGEMENT (AGGREGATION)

Links Unit → Carton → Pallet

Parent–child relationships stored separately from serial numbers

Configurable aggregation rules (units per carton, cartons per pallet)

Supports repacking and re-aggregation

Enables full traceability without encoding hierarchy in serials

ANTI-COUNTERFEIT PROTECTION

SHA-256 cryptographic hashing

Hash input includes:
serial number
production date
product code
secret salt

Secret salt stored securely in environment variables

Short verification hash printed on label

Supports salt rotation without code changes

RED THREAD TRACEABILITY

Trace any unit to its carton and pallet

Enables audits, recalls, and verification

Efficient queries using indexed database tables

PROJECT STRUCTURE

SmartTrace/
│
├── SmartTrace-backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── server.js
│ │ ├── config/
│ │ │ └── db.js
│ │ ├── controllers/
│ │ │ ├── labelController.js
│ │ │ └── hierarchyController.js
│ │ ├── routes/
│ │ │ ├── labelRoutes.js
│ │ │ └── hierarchyRoutes.js
│ │ ├── services/
│ │ │ ├── labelService.js
│ │ │ └── hierarchyService.js
│ │ ├── utils/
│ │ │ ├── checkDigitUtil.js
│ │ │ └── hashUtil.js
│ │ └── testdb.js
│ ├── package.json
│ └── .env
│
└── SmartTrace-frontend/
├── index.html
├── api.js
└── style.css

TECH STACK

Backend:

Node.js

Express.js

MariaDB / MySQL

mysql2

dotenv

crypto (SHA-256)

Frontend:

HTML

CSS

JavaScript

SETUP INSTRUCTIONS (LINUX)

INSTALL DEPENDENCIES

cd SmartTrace-backend
npm install

INSTALL MARIADB

sudo apt update
sudo apt install mariadb-server mariadb-client

Start service:
sudo systemctl start mariadb

CREATE DATABASE AND USER

sudo mysql

CREATE DATABASE smarttrace;
CREATE USER 'smarttrace'@'localhost' IDENTIFIED BY 'smarttrace123';
GRANT ALL PRIVILEGES ON smarttrace.* TO 'smarttrace'@'localhost';
FLUSH PRIVILEGES;
EXIT;

RUN DATABASE SCHEMA

Run all provided CREATE TABLE queries using:

MySQL Workbench
OR

mysql CLI

CONFIGURE ENVIRONMENT VARIABLES

Create a file named .env inside SmartTrace-backend:

DB_HOST=localhost
DB_USER=smarttrace
DB_PASSWORD=smarttrace123
DB_NAME=smarttrace

HASH_SECRET_SALT=SmartTrace@2026#Demo
HASH_SALT_VERSION=1

Add .env to .gitignore.

START BACKEND SERVER

node src/server.js

TEST DATABASE CONNECTION

node src/testdb.js

Expected output:
[ { time: 'YYYY-MM-DDTHH:MM:SS.000Z' } ]

API ENDPOINTS

Generate Serial Number:
POST /api/labels/generate

Request Body:
{
"level": "PRIMARY",
"productId": 1,
"batchId": "BATCH001",
"productionDate": "2026-01-24"
}

Create Hierarchy (Aggregation):
POST /api/hierarchy/aggregate

Request Body:
{
"childSerial": "PRIMARY_SERIAL",
"parentSerial": "SECONDARY_OR_TERTIARY_SERIAL"
}

Trace Red Thread:
GET /api/hierarchy/trace/{serial}

SECURITY DESIGN

Secret salts are never hard-coded

Stored securely using environment variables

Hashing logic isolated in utility layer

Database does not store secret salts

Application does not use root DB user

PROBLEM STATEMENT ALIGNMENT

Unique serial generation: YES
GS1 SSCC support: YES
Hierarchy management: YES
Anti-counterfeit hashing: YES
Red thread traceability: YES
Batch handling: YES
Optimized DB queries (<100ms): YES

ONE-LINE SUMMARY

SmartTrace securely links physical products to digital identities using serial generation, cryptographic hashing, and hierarchy management to enable full supply-chain traceability.

FUTURE ENHANCEMENTS

Verification API

Anomaly detection scoring

Location-based fraud detection

QR / Barcode scanning

Analytics dashboard

AUTHORS

Nikhil Dasari
SmartTrace Team