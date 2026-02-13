
CREATE DATABASE IF NOT EXISTS smarttrace;
USE smarttrace;

-- PRODUCTS TABLE
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255),
    units_per_carton INT DEFAULT 10,
    cartons_per_pallet INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LABELS TABLE
CREATE TABLE labels (
    label_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    packaging_level ENUM('PRIMARY','SECONDARY','TERTIARY') NOT NULL,
    product_id INT NOT NULL,
    production_date DATE NOT NULL,
    full_hash CHAR(64) NOT NULL,
    short_hash CHAR(8) NOT NULL,
    salt_version INT DEFAULT 1,
    status ENUM('ACTIVE','DECOMMISSIONED','SUSPECT') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(product_id),
    INDEX idx_serial (serial_number),
    INDEX idx_product (product_id)
);

-- AGGREGATION TABLE
CREATE TABLE aggregation (
    aggregation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_label_id BIGINT NOT NULL,
    child_label_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_label_id) REFERENCES labels(label_id),
    FOREIGN KEY (child_label_id) REFERENCES labels(label_id),

    INDEX idx_parent (parent_label_id),
    INDEX idx_child (child_label_id)
);

-- ANOMALY DETECTIONS TABLE
CREATE TABLE anomaly_detections (
    anomaly_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    label_id BIGINT NOT NULL,
    anomaly_type ENUM(
        'CHECK_DIGIT_MISMATCH',
        'HASH_MISMATCH',
        'HIERARCHY_MISMATCH',
        'DUPLICATE_SCAN',
        'IMPOSSIBLE_TRAVEL'
    ),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (label_id) REFERENCES labels(label_id),
    INDEX idx_anomaly_label (label_id)
);

-- SERIAL SEQUENCE TABLE
CREATE TABLE serial_sequence (
    id BIGINT PRIMARY KEY AUTO_INCREMENT
);

-- VERIFICATION LOGS TABLE
CREATE TABLE verification_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    label_id BIGINT NOT NULL,
    scan_latitude DECIMAL(10,8),
    scan_longitude DECIMAL(11,8),
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_result ENUM('VALID','INVALID','SUSPECT','WARNING') NOT NULL,
    reason VARCHAR(100),

    FOREIGN KEY (label_id) REFERENCES labels(label_id),
    INDEX idx_logs_label (label_id),
    INDEX idx_logs_time (scan_time)
);
