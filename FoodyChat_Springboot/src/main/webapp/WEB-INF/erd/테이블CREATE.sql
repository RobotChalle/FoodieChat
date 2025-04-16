CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 고유 아이디 (PK)
    email VARCHAR(100) UNIQUE NOT NULL,  -- 이메일 (Unique)
    google_id VARCHAR(100) UNIQUE NULL,  -- 구글 아이디 (Unique, 선택적)
    user_password VARCHAR(200) NULL,  -- 비밀번호 (구글 로그인 시 NULL 가능)
    user_name VARCHAR(50) NOT NULL,  -- 이름
    phone VARCHAR(20) UNIQUE NOT NULL,  -- 전화번호 (Unique)
    membership_level ENUM('regular', 'business', 'admin') DEFAULT 'regular',  -- 회원 등급
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 수정 시간 (자동 업데이트)
);

CREATE TABLE user_details (
    user_id BIGINT PRIMARY KEY,  -- FK + PK (회원 ID)
    gender INT UNSIGNED,  -- 성별
    age INT UNSIGNED,  -- 나이 (0 이상)
    user_weight DECIMAL(5,2) UNSIGNED,  -- 체중 (소수점 2자리까지 허용, 양수)
    height DECIMAL(5,2) UNSIGNED,  -- 키 (소수점 2자리까지 허용, 양수)
    user_address TEXT NULL,  -- 주소 (선택적)
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    health_goal INT UNSIGNED,  -- 건강목표
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- users 테이블과 연결
);

CREATE TABLE user_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 로그 ID (PK)
    user_id BIGINT NULL,  -- 회원 ID (FK)
    login_time DATETIME NULL,  -- 로그인 시간
    logout_time DATETIME NULL,  -- 로그아웃 시간 (NULL 가능)
    ip_address VARCHAR(50) NOT NULL,  -- 접속한 IP 주소 (IPv4/IPv6 지원)
    user_agent TEXT NOT NULL,  -- 브라우저 정보 (User-Agent)
    login_status ENUM('1', '0') NOT NULL,  -- 로그인 성공 여부
    failure_reason TEXT NULL,  -- 로그인 실패 사유 (성공 시 NULL)
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP  -- 등록 시간 (자동 생성)
);

CREATE TABLE common_codes (
    code_id VARCHAR(10) PRIMARY KEY,  -- 기초코드 ID (CM001, CT001 등)
    code_name VARCHAR(100) NOT NULL,  -- 기초코드 명칭
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE common_code_details (
    code_id VARCHAR(10) NOT NULL,  -- 기초코드 ID (CM001, CT001 등)
    detail_code INT NOT NULL,  -- 코드 세부값 (1, 2, 3...)
    detail_name VARCHAR(100) NOT NULL,  -- 코드명 (예: 아침, 점심, 저녁, 한식 등)
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (code_id, detail_code),  -- 복합 PK
    FOREIGN KEY (code_id) REFERENCES common_codes(code_id) ON DELETE CASCADE  -- 마스터 테이블과 연결
);

CREATE TABLE foods (
    food_id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 음식 코드 (PK)
    food_name VARCHAR(50) NOT NULL,  -- 음식 명칭
    calories DECIMAL(6,2) NOT NULL CHECK (calories >= 0),  -- 칼로리 (소수점 2자리, 0 이상)
    category_code INT NOT NULL,  -- 음식 카테고리 코드 (기초 코드 참조)
    file_name VARCHAR(255) NULL,  -- 이미지 파일명 (선택 사항)
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE food_details (
    food_id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 음식 코드 (PK)
    calories DECIMAL(6,2) NOT NULL CHECK (calories >= 0),  -- 칼로리 (소수점 2자리, 0 이상)
    nut_carb DECIMAL(6,2) NOT NULL CHECK (nut_carb >= 0),  -- 칼로리 (소수점 2자리, 0 이상)
    nut_pro DECIMAL(6,2) NOT NULL CHECK (nut_pro >= 0),  -- 칼로리 (소수점 2자리, 0 이상)
    nut_fat DECIMAL(6,2) NOT NULL CHECK (nut_fat >= 0),  -- 칼로리 (소수점 2자리, 0 이상)
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE user_meals (
    user_id BIGINT NOT NULL,  -- 회원 고유 ID (FK)
    meal_date DATE NOT NULL,  -- 식단 날짜 (PK)
    meal_type ENUM('1', '2', '3') NOT NULL,  -- 식사 구분 (1:아침, 2:점심, 3:저녁) (PK)
    meal_text TEXT NULL, -- 식단 TEXT
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, meal_date, meal_type),  -- 복합 PK
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- 회원 삭제 시 식단도 삭제
);

CREATE TABLE bmi_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 음식 코드 (PK)
    user_id BIGINT NOT NULL,  -- 회원 고유 ID (FK)
    bmi_score DECIMAL(6,2) NULL,  -- 칼로리 (소수점 2자리, 0 이상)
    gender INT UNSIGNED,  -- 성별
    user_weight DECIMAL(5,2) UNSIGNED,  -- 체중 (소수점 2자리까지 허용, 양수)
    height DECIMAL(5,2) UNSIGNED,  -- 키 (소수점 2자리까지 허용, 양수)
    reg_id BIGINT,
    reg_ip VARCHAR(50),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 등록 시간 (자동 생성)
    upd_id BIGINT,
    upd_ip VARCHAR(50),
    upd_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE password_reset_token
ADD COLUMN email VARCHAR(255) NOT NULL;


INSERT INTO users(email , user_name, membership_level, phone)
values('admin@gmail.com', '관리자', 'admin', '000-0000-0000');
INSERT INTO common_codes(code_id , code_name, reg_id, reg_ip)
values('CT001','카테고리',1,'127.0.0.1');
INSERT INTO common_codes(code_id , code_name, reg_id, reg_ip)
values('CM001','식단구분',1,'127.0.0.1');

SELECT * FROM users;
SELECT * FROM common_codes;

INSERT INTO common_codes(code_id , code_name, reg_id, reg_ip)
values('CM002','성별구분',1,'127.0.0.1');

INSERT INTO common_code_details(code_id , detail_code, detail_name, reg_id, reg_ip)
values('CM002',1,'남',1,'127.0.0.1');

INSERT INTO common_code_details(code_id , detail_code, detail_name, reg_id, reg_ip)
values('CM002',2,'여',1,'127.0.0.1');

INSERT INTO common_codes(code_id , code_name, reg_id, reg_ip)
values('CM003','건강목표',1,'127.0.0.1');

INSERT INTO common_code_details(code_id , detail_code, detail_name, reg_id, reg_ip)
values('CM003',1,'체중 감량',1,'127.0.0.1');

INSERT INTO common_code_details(code_id , detail_code, detail_name, reg_id, reg_ip)
values('CM003',2,'근육 강화',1,'127.0.0.1');

INSERT INTO common_code_details(code_id , detail_code, detail_name, reg_id, reg_ip)
values('CM003',3,'건강한 생활 유지',1,'127.0.0.1');

SELECT * FROM common_codes;
SELECT * FROM common_code_details;

ALTER TABLE users DROP INDEX phone;
