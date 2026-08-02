-- CreateTable
CREATE TABLE `schools` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `eiin` VARCHAR(191) NULL,
    `principalName` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `schools_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_settings` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'BDT',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Dhaka',
    `date_format` VARCHAR(191) NOT NULL DEFAULT 'DD/MM/YYYY',
    `default_language` VARCHAR(191) NOT NULL DEFAULT 'bn',
    `academic_year` VARCHAR(191) NOT NULL DEFAULT '2026',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `school_settings_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branding_settings` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `favicon_url` VARCHAR(191) NULL,
    `primary_color` VARCHAR(191) NOT NULL DEFAULT '#0d9488',
    `accent_color` VARCHAR(191) NOT NULL DEFAULT '#0f766e',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branding_settings_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `avatar_url` VARCHAR(191) NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `permissions_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `role_id` VARCHAR(191) NOT NULL,
    `permission_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_sessions_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_histories` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `login_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_login_attempts` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `attempt_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `record_id` VARCHAR(191) NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `metadata` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_years` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `numeric_level` INTEGER NOT NULL DEFAULT 0,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `classes_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NULL,
    `class_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL DEFAULT 'SEC',
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `capacity` INTEGER NOT NULL DEFAULT 40,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `subject_type` VARCHAR(191) NOT NULL DEFAULT 'compulsory',
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_sections` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 40,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `class_sections_academic_year_id_class_id_section_id_key`(`academic_year_id`, `class_id`, `section_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_groups` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `class_groups_academic_year_id_class_id_group_id_key`(`academic_year_id`, `class_id`, `group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `subject_type` VARCHAR(191) NOT NULL DEFAULT 'compulsory',
    `full_marks` INTEGER NOT NULL DEFAULT 100,
    `pass_marks` INTEGER NOT NULL DEFAULT 33,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `teacher_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 40,
    `location` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periods` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `is_break` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holidays` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departments_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `designations` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `designations_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `employee_code` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `date_of_birth` DATETIME(3) NULL,
    `joining_date` DATETIME(3) NOT NULL,
    `qualification` VARCHAR(191) NULL,
    `specialization` VARCHAR(191) NULL,
    `profile_photo` VARCHAR(191) NULL,
    `department_id` VARCHAR(191) NULL,
    `designation_id` VARCHAR(191) NULL,
    `employment_status` VARCHAR(191) NOT NULL DEFAULT 'PERMANENT',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teachers_user_id_key`(`user_id`),
    UNIQUE INDEX `teachers_school_id_employee_code_key`(`school_id`, `employee_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `employee_code` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `department_id` VARCHAR(191) NULL,
    `designation_id` VARCHAR(191) NULL,
    `joining_date` DATETIME(3) NOT NULL,
    `employment_type` VARCHAR(191) NOT NULL DEFAULT 'FULL_TIME',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_user_id_key`(`user_id`),
    UNIQUE INDEX `employees_school_id_employee_code_key`(`school_id`, `employee_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_documents` (
    `id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NULL,
    `employee_id` VARCHAR(191) NULL,
    `document_type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employment_histories` (
    `id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NULL,
    `employee_id` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `responsibilities` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NULL,
    `teacher_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `is_class_teacher` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teacher_assignments_school_id_academic_year_id_class_id_sect_key`(`school_id`, `academic_year_id`, `class_id`, `section_id`, `subject_id`, `teacher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guardians` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NOT NULL DEFAULT 'PARENT',
    `phone` VARCHAR(191) NOT NULL,
    `alternate_phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `portal_access_enabled` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `guardians_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `admission_number` VARCHAR(191) NOT NULL,
    `student_code` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_bn` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `date_of_birth` DATETIME(3) NOT NULL,
    `blood_group` VARCHAR(191) NULL,
    `birth_registration_number` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `present_address` TEXT NULL,
    `permanent_address` TEXT NULL,
    `profile_photo` VARCHAR(191) NULL,
    `previous_school` VARCHAR(191) NULL,
    `admission_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `class_id` VARCHAR(191) NULL,
    `section_id` VARCHAR(191) NULL,
    `roll_number` INTEGER NULL,
    `father_name` VARCHAR(191) NULL,
    `mother_name` VARCHAR(191) NULL,
    `emergency_phone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `students_user_id_key`(`user_id`),
    UNIQUE INDEX `students_school_id_admission_number_key`(`school_id`, `admission_number`),
    UNIQUE INDEX `students_school_id_student_code_key`(`school_id`, `student_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_guardians` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `guardian_id` VARCHAR(191) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT true,
    `is_financial_contact` BOOLEAN NOT NULL DEFAULT true,
    `is_emergency_contact` BOOLEAN NOT NULL DEFAULT true,
    `relationship` VARCHAR(191) NOT NULL DEFAULT 'PARENT',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_guardians_student_id_guardian_id_key`(`student_id`, `guardian_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_enrollments` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NULL,
    `roll_number` INTEGER NOT NULL,
    `registration_number` VARCHAR(191) NULL,
    `enrollment_type` VARCHAR(191) NOT NULL DEFAULT 'REGULAR',
    `enrollment_status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_enrollments_academic_year_id_class_id_section_id_rol_key`(`academic_year_id`, `class_id`, `section_id`, `roll_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_documents` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_medical_information` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `height` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `blood_group` VARCHAR(191) NULL,
    `allergies` TEXT NULL,
    `medical_conditions` TEXT NULL,
    `medications` TEXT NULL,
    `emergency_notes` TEXT NULL,

    UNIQUE INDEX `student_medical_information_student_id_key`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_previous_education` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `institute_name` VARCHAR(191) NOT NULL,
    `board` VARCHAR(191) NULL,
    `passed_year` INTEGER NULL,
    `gpa_marks` VARCHAR(191) NULL,
    `roll_number` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_status_histories` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `previous_status` VARCHAR(191) NOT NULL,
    `new_status` VARCHAR(191) NOT NULL,
    `change_reason` TEXT NULL,
    `changed_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 100,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_applications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `campaign_id` VARCHAR(191) NULL,
    `application_number` VARCHAR(191) NOT NULL,
    `tracking_code` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NULL,
    `student_name_en` VARCHAR(191) NOT NULL,
    `student_name_bn` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `date_of_birth` DATETIME(3) NOT NULL,
    `blood_group` VARCHAR(191) NULL,
    `birth_registration_number` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `present_address` TEXT NULL,
    `permanent_address` TEXT NULL,
    `previous_school` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'submitted',
    `payment_status` ENUM('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `rejection_reason` TEXT NULL,
    `correction_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admission_applications_application_number_key`(`application_number`),
    UNIQUE INDEX `admission_applications_tracking_code_key`(`tracking_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_application_guardians` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `alternate_phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT true,
    `is_financial_contact` BOOLEAN NOT NULL DEFAULT true,
    `is_emergency_contact` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_documents` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_reviews` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `reviewer_id` VARCHAR(191) NULL,
    `decision` VARCHAR(191) NOT NULL,
    `comments` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_tests` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `test_date` DATETIME(3) NULL,
    `venue` VARCHAR(191) NULL,
    `total_marks` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    `marks_obtained` DECIMAL(5, 2) NULL,
    `passed` BOOLEAN NULL,
    `comments` TEXT NULL,

    UNIQUE INDEX `admission_tests_application_id_key`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_interviews` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `interview_date` DATETIME(3) NULL,
    `interviewer_name` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SCHEDULED',
    `comments` TEXT NULL,

    UNIQUE INDEX `admission_interviews_application_id_key`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'INFO',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendances` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HALF_DAY') NOT NULL DEFAULT 'PRESENT',
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `attendances_student_id_date_key`(`student_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_structures` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL DEFAULT 'MONTHLY',
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_invoices` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `fee_structure_id` VARCHAR(191) NOT NULL,
    `invoice_number` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `paid_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fee_invoices_invoice_number_key`(`invoice_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `receipt_number` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `payment_method` ENUM('CASH', 'BANK_TRANSFER', 'BKASH', 'NAGAD', 'CHEQUE', 'CARD') NOT NULL DEFAULT 'CASH',
    `transaction_id` VARCHAR(191) NULL,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payments_receipt_number_key`(`receipt_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL DEFAULT 2026,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marks` (
    `id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `marks_obtained` DECIMAL(5, 2) NOT NULL,
    `max_marks` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    `grade` VARCHAR(191) NULL,
    `comments` VARCHAR(191) NULL,
    `is_locked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `marks_exam_id_student_id_subject_id_key`(`exam_id`, `student_id`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routines` (
    `id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NOT NULL,
    `day_of_week` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `room_no` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_routines` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NULL,
    `weekday` VARCHAR(191) NOT NULL,
    `period_id` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `effective_from` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `effective_to` DATETIME(3) NULL,
    `version_number` INTEGER NOT NULL DEFAULT 1,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PUBLISHED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routine_versions` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `version_number` INTEGER NOT NULL,
    `change_summary` VARCHAR(191) NULL,
    `routine_snapshot` TEXT NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_routines` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `exam_date` DATETIME(3) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `duration_minutes` INTEGER NOT NULL,
    `room_id` VARCHAR(191) NULL,
    `total_marks` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    `pass_marks` DECIMAL(5, 2) NOT NULL DEFAULT 33.00,
    `instructions` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NULL,
    `period_id` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `session_type` VARCHAR(191) NOT NULL DEFAULT 'DAILY',
    `taken_by_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUBMITTED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_attendance_records` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NULL,
    `section_id` VARCHAR(191) NULL,
    `subject_id` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_attendances` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `in_time` VARCHAR(191) NULL,
    `out_time` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_attendances` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `in_time` VARCHAR(191) NULL,
    `out_time` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_corrections` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `attendance_type` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `current_status` VARCHAR(191) NOT NULL,
    `requested_status` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `requested_by_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `approved_by_id` VARCHAR(191) NULL,
    `approved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_notifications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `guardian_id` VARCHAR(191) NULL,
    `attendance_date` DATETIME(3) NOT NULL,
    `channel` VARCHAR(191) NOT NULL DEFAULT 'PORTAL',
    `delivery_status` VARCHAR(191) NOT NULL DEFAULT 'DELIVERED',
    `message` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homeworks` (
    `id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `teacher_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_types` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_recurring` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fee_types_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_structure_items` (
    `id` VARCHAR(191) NOT NULL,
    `fee_structure_id` VARCHAR(191) NOT NULL,
    `fee_type_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `is_optional` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_fee_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `fee_type_id` VARCHAR(191) NOT NULL,
    `custom_amount` DECIMAL(12, 2) NULL,
    `effective_from` DATETIME(3) NOT NULL,
    `effective_to` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing_periods` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `billing_periods_school_id_academic_year_id_year_month_key`(`school_id`, `academic_year_id`, `year`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_fee_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NULL,
    `student_id` VARCHAR(191) NULL,
    `fee_type_id` VARCHAR(191) NOT NULL,
    `monthly_amount` DECIMAL(12, 2) NOT NULL,
    `billing_day` INTEGER NOT NULL DEFAULT 1,
    `due_day` INTEGER NOT NULL DEFAULT 10,
    `late_fee_type` VARCHAR(191) NOT NULL DEFAULT 'FIXED',
    `late_fee_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `effective_from` DATETIME(3) NOT NULL,
    `effective_to` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_fee_structures` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NULL,
    `fee_type_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `late_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_fee_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `exam_fee_structure_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `waiver_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `netAmount` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_invoices` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `enrollment_id` VARCHAR(191) NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `invoice_number` VARCHAR(191) NOT NULL,
    `billing_year` INTEGER NOT NULL,
    `billing_month` INTEGER NOT NULL,
    `fee_type_id` VARCHAR(191) NULL,
    `issue_date` DATETIME(3) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `scholarship_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `waiver_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `fine_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `previous_due` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `totalAmount` DECIMAL(12, 2) NOT NULL,
    `paid_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `dueAmount` DECIMAL(12, 2) NOT NULL,
    `payment_status` VARCHAR(191) NOT NULL DEFAULT 'unpaid',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_invoices_invoice_number_key`(`invoice_number`),
    UNIQUE INDEX `student_invoices_school_id_student_id_enrollment_id_fee_type_key`(`school_id`, `student_id`, `enrollment_id`, `fee_type_id`, `billing_year`, `billing_month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_items` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `fee_type_id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `net_amount` DECIMAL(12, 2) NOT NULL,
    `paid_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_allocations` (
    `id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `invoice_item_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipts` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `receipt_number` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `total_paid` DECIMAL(12, 2) NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` VARCHAR(191) NULL,

    UNIQUE INDEX `receipts_receipt_number_key`(`receipt_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_waivers` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `fee_type_id` VARCHAR(191) NULL,
    `waiver_type` VARCHAR(191) NOT NULL,
    `waiver_value` DECIMAL(12, 2) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `approved_by` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scholarships` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `scholarship_type` VARCHAR(191) NOT NULL,
    `percentage_or_amount` DECIMAL(12, 2) NOT NULL,
    `is_percentage` BOOLEAN NOT NULL DEFAULT true,
    `effective_from` DATETIME(3) NOT NULL,
    `effective_to` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fines` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `fine_amount` DECIMAL(12, 2) NOT NULL,
    `waived_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `net_fine` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `refund_number` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `approved_by` VARCHAR(191) NULL,
    `refund_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refunds_refund_number_key`(`refund_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_reversals` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `reversal_number` VARCHAR(191) NOT NULL,
    `reversed_by_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `reversal_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payment_reversals_reversal_number_key`(`reversal_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `account_name` VARCHAR(191) NOT NULL,
    `account_type` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NULL,
    `balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `transaction_number` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `transaction_type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `reference_id` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `financial_transactions_transaction_number_key`(`transaction_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_types` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `weightage` DECIMAL(5, 2) NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `exam_types_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_classes` (
    `id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `full_marks` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    `pass_marks` DECIMAL(5, 2) NOT NULL DEFAULT 33.00,
    `is_optional` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_mark_distributions` (
    `id` VARCHAR(191) NOT NULL,
    `exam_subject_id` VARCHAR(191) NOT NULL,
    `component` VARCHAR(191) NOT NULL,
    `full_marks` DECIMAL(5, 2) NOT NULL,
    `pass_marks` DECIMAL(5, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grade_scales` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grading_rules` (
    `id` VARCHAR(191) NOT NULL,
    `grade_scale_id` VARCHAR(191) NOT NULL,
    `letter_grade` VARCHAR(191) NOT NULL,
    `grade_point` DECIMAL(4, 2) NOT NULL,
    `mark_min` DECIMAL(5, 2) NOT NULL,
    `mark_max` DECIMAL(5, 2) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_marks` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `written` DECIMAL(5, 2) NULL,
    `mcq` DECIMAL(5, 2) NULL,
    `practical` DECIMAL(5, 2) NULL,
    `assignment` DECIMAL(5, 2) NULL,
    `attendance` DECIMAL(5, 2) NULL,
    `class_test` DECIMAL(5, 2) NULL,
    `other` DECIMAL(5, 2) NULL,
    `grace_marks` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `total_marks` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `is_absent` BOOLEAN NOT NULL DEFAULT false,
    `is_passed` BOOLEAN NOT NULL DEFAULT true,
    `letter_grade` VARCHAR(191) NULL,
    `grade_point` DECIMAL(4, 2) NULL,
    `is_locked` BOOLEAN NOT NULL DEFAULT false,
    `locked_at` DATETIME(3) NULL,
    `locked_by_id` VARCHAR(191) NULL,
    `unlock_reason` VARCHAR(191) NULL,
    `entered_by_id` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_marks_exam_id_student_id_subject_id_key`(`exam_id`, `student_id`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marks_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'VERIFIED',
    `verified_by_id` VARCHAR(191) NOT NULL,
    `verified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_results` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `academic_year_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `total_marks` DECIMAL(7, 2) NOT NULL DEFAULT 0.00,
    `average` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `gpa` DECIMAL(4, 2) NOT NULL DEFAULT 0.00,
    `letter_grade` VARCHAR(191) NOT NULL DEFAULT 'F',
    `failed_subject_count` INTEGER NOT NULL DEFAULT 0,
    `class_position` INTEGER NULL,
    `optional_class_position` INTEGER NULL,
    `is_passed` BOOLEAN NOT NULL DEFAULT true,
    `remarks` VARCHAR(191) NULL,
    `calculated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_results_exam_id_student_id_key`(`exam_id`, `student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `result_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `result_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,
    `fullMarks` DECIMAL(5, 2) NOT NULL,
    `passMarks` DECIMAL(5, 2) NOT NULL,
    `obtainedMarks` DECIMAL(5, 2) NOT NULL,
    `letter_grade` VARCHAR(191) NOT NULL,
    `gradePoint` DECIMAL(4, 2) NOT NULL,
    `is_optional` BOOLEAN NOT NULL DEFAULT false,
    `is_passed` BOOLEAN NOT NULL DEFAULT true,
    `is_absent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `result_publications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PUBLISHED',
    `published_by_id` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unpublish_reason` VARCHAR(191) NULL,
    `unpublished_by_id` VARCHAR(191) NULL,
    `unpublished_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_templates` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `template_body` TEXT NOT NULL,
    `header_bangla` VARCHAR(191) NULL,
    `header_english` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generated_documents` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(191) NOT NULL,
    `target_type` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NOT NULL,
    `qr_code_data` VARCHAR(191) NOT NULL,
    `issue_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issued_by_id` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'VALID',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `generated_documents_verification_code_key`(`verification_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admit_cards` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `roll_number` VARCHAR(191) NOT NULL,
    `admit_card_number` VARCHAR(191) NOT NULL,
    `fee_cleared` BOOLEAN NOT NULL DEFAULT true,
    `verification_code` VARCHAR(191) NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admit_cards_admit_card_number_key`(`admit_card_number`),
    UNIQUE INDEX `admit_cards_verification_code_key`(`verification_code`),
    UNIQUE INDEX `admit_cards_exam_id_student_id_key`(`exam_id`, `student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_cards` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `report_card_number` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `report_cards_report_card_number_key`(`report_card_number`),
    UNIQUE INDEX `report_cards_verification_code_key`(`verification_code`),
    UNIQUE INDEX `report_cards_exam_id_student_id_key`(`exam_id`, `student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transcripts` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `transcript_number` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NOT NULL,
    `cumulative_gpa` DECIMAL(4, 2) NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transcripts_transcript_number_key`(`transcript_number`),
    UNIQUE INDEX `transcripts_verification_code_key`(`verification_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_types` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `certificate_types_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `certificate_type_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `certificate_number` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NOT NULL,
    `issue_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issued_by_id` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ISSUED',

    UNIQUE INDEX `certificates_certificate_number_key`(`certificate_number`),
    UNIQUE INDEX `certificates_verification_code_key`(`verification_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'VERIFIED',
    `verified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifier_ip` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_types` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `days_allowed` INTEGER NOT NULL,
    `is_carry_forward` BOOLEAN NOT NULL DEFAULT false,
    `is_paid` BOOLEAN NOT NULL DEFAULT true,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `leave_types_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_applications` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `leave_type_id` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `total_days` INTEGER NOT NULL,
    `reason` TEXT NOT NULL,
    `attachment_url` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_approvals` (
    `id` VARCHAR(191) NOT NULL,
    `leave_application_id` VARCHAR(191) NOT NULL,
    `approved_by_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `remarks` TEXT NULL,
    `action_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_structures` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `salary_structures_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_components` (
    `id` VARCHAR(191) NOT NULL,
    `salary_structure_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `component_type` VARCHAR(191) NOT NULL,
    `amount_type` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `percentage_base` VARCHAR(191) NULL,
    `is_taxable` BOOLEAN NOT NULL DEFAULT true,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_salary_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `salary_structure_id` VARCHAR(191) NOT NULL,
    `effective_date` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_periods` (
    `id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `payroll_year` INTEGER NOT NULL,
    `payroll_month` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `working_days` INTEGER NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payroll_periods_school_id_payroll_year_payroll_month_key`(`school_id`, `payroll_year`, `payroll_month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payrolls` (
    `id` VARCHAR(191) NOT NULL,
    `payroll_period_id` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `basic_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_allowances` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_deductions` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `overtime` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `bonus` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `loan_deduction` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `absence_deduction` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `gross_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `net_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `paid_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `teacherId` VARCHAR(191) NULL,

    UNIQUE INDEX `payrolls_payroll_period_id_user_id_key`(`payroll_period_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_items` (
    `id` VARCHAR(191) NOT NULL,
    `payroll_id` VARCHAR(191) NOT NULL,
    `component_name` VARCHAR(191) NOT NULL,
    `component_type` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_adjustments` (
    `id` VARCHAR(191) NOT NULL,
    `payroll_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_payments` (
    `id` VARCHAR(191) NOT NULL,
    `payroll_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `transaction_ref` VARCHAR(191) NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_by_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payslips` (
    `id` VARCHAR(191) NOT NULL,
    `payroll_id` VARCHAR(191) NOT NULL,
    `payslip_number` VARCHAR(191) NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payslips_payroll_id_key`(`payroll_id`),
    UNIQUE INDEX `payslips_payslip_number_key`(`payslip_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `school_settings` ADD CONSTRAINT `school_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branding_settings` ADD CONSTRAINT `branding_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `login_histories` ADD CONSTRAINT `login_histories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `failed_login_attempts` ADD CONSTRAINT `failed_login_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_sessions` ADD CONSTRAINT `academic_sessions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_sessions` ADD CONSTRAINT `academic_sessions_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `groups` ADD CONSTRAINT `groups_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_sections` ADD CONSTRAINT `class_sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_sections` ADD CONSTRAINT `class_sections_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_sections` ADD CONSTRAINT `class_sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_sections` ADD CONSTRAINT `class_sections_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_groups` ADD CONSTRAINT `class_groups_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_groups` ADD CONSTRAINT `class_groups_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_groups` ADD CONSTRAINT `class_groups_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_groups` ADD CONSTRAINT `class_groups_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `designations` ADD CONSTRAINT `designations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_documents` ADD CONSTRAINT `employee_documents_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_documents` ADD CONSTRAINT `employee_documents_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employment_histories` ADD CONSTRAINT `employment_histories_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employment_histories` ADD CONSTRAINT `employment_histories_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_assignments` ADD CONSTRAINT `teacher_assignments_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guardians` ADD CONSTRAINT `guardians_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guardians` ADD CONSTRAINT `guardians_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_guardians` ADD CONSTRAINT `student_guardians_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_guardians` ADD CONSTRAINT `student_guardians_guardian_id_fkey` FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_documents` ADD CONSTRAINT `student_documents_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_medical_information` ADD CONSTRAINT `student_medical_information_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_previous_education` ADD CONSTRAINT `student_previous_education_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_status_histories` ADD CONSTRAINT `student_status_histories_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_campaigns` ADD CONSTRAINT `admission_campaigns_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_campaigns` ADD CONSTRAINT `admission_campaigns_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_applications` ADD CONSTRAINT `admission_applications_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_applications` ADD CONSTRAINT `admission_applications_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `admission_campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_applications` ADD CONSTRAINT `admission_applications_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_applications` ADD CONSTRAINT `admission_applications_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_application_guardians` ADD CONSTRAINT `admission_application_guardians_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_documents` ADD CONSTRAINT `admission_documents_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_reviews` ADD CONSTRAINT `admission_reviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_tests` ADD CONSTRAINT `admission_tests_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission_interviews` ADD CONSTRAINT `admission_interviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_structures` ADD CONSTRAINT `fee_structures_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_invoices` ADD CONSTRAINT `fee_invoices_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_invoices` ADD CONSTRAINT `fee_invoices_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_invoices` ADD CONSTRAINT `fee_invoices_fee_structure_id_fkey` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `fee_invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routines` ADD CONSTRAINT `routines_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routines` ADD CONSTRAINT `routines_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routines` ADD CONSTRAINT `routines_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routines` ADD CONSTRAINT `routines_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeworks` ADD CONSTRAINT `homeworks_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeworks` ADD CONSTRAINT `homeworks_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeworks` ADD CONSTRAINT `homeworks_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeworks` ADD CONSTRAINT `homeworks_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_structure_items` ADD CONSTRAINT `fee_structure_items_fee_structure_id_fkey` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_items` ADD CONSTRAINT `invoice_items_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `student_invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_allocations` ADD CONSTRAINT `payment_allocations_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payrolls` ADD CONSTRAINT `payrolls_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payrolls` ADD CONSTRAINT `payrolls_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
