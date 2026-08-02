CREATE TABLE `import_histories` (
    `id` VARCHAR(191) NOT NULL, `school_id` VARCHAR(191) NOT NULL, `user_id` VARCHAR(191) NOT NULL,
    `import_type` VARCHAR(191) NOT NULL, `file_name` VARCHAR(191) NOT NULL, `file_size` INTEGER NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL, `status` VARCHAR(191) NOT NULL DEFAULT 'VALIDATED',
    `total_rows` INTEGER NOT NULL DEFAULT 0, `valid_rows` INTEGER NOT NULL DEFAULT 0,
    `invalid_rows` INTEGER NOT NULL DEFAULT 0, `processed_rows` INTEGER NOT NULL DEFAULT 0,
    `success_rows` INTEGER NOT NULL DEFAULT 0, `failed_rows` INTEGER NOT NULL DEFAULT 0,
    `column_mapping` JSON NULL, `payload` JSON NULL, `success_report` JSON NULL, `error_report` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `completed_at` DATETIME(3) NULL,
    INDEX `import_histories_school_id_import_type_created_at_idx`(`school_id`, `import_type`, `created_at`),
    INDEX `import_histories_user_id_created_at_idx`(`user_id`, `created_at`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `export_histories` (
    `id` VARCHAR(191) NOT NULL, `school_id` VARCHAR(191) NOT NULL, `user_id` VARCHAR(191) NOT NULL,
    `report_type` VARCHAR(191) NOT NULL, `format` VARCHAR(191) NOT NULL, `filters` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'COMPLETED', `row_count` INTEGER NOT NULL DEFAULT 0,
    `file_name` VARCHAR(191) NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,
    INDEX `export_histories_school_id_report_type_created_at_idx`(`school_id`, `report_type`, `created_at`),
    INDEX `export_histories_user_id_created_at_idx`(`user_id`, `created_at`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `legacy_installment_imports` (
    `id` VARCHAR(191) NOT NULL, `import_history_id` VARCHAR(191) NOT NULL, `school_id` VARCHAR(191) NOT NULL,
    `imported_by_id` VARCHAR(191) NOT NULL, `source_name` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ISOLATED', `record_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `legacy_installment_imports_import_history_id_key`(`import_history_id`),
    INDEX `legacy_installment_imports_school_id_created_at_idx`(`school_id`, `created_at`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `legacy_installments` (
    `id` VARCHAR(191) NOT NULL, `legacy_import_id` VARCHAR(191) NOT NULL, `school_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NULL, `legacy_student_ref` VARCHAR(191) NOT NULL,
    `academic_year_label` VARCHAR(191) NULL, `installment_name` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL, `due_date` DATETIME(3) NULL, `status` VARCHAR(191) NOT NULL DEFAULT 'UNPAID',
    `source_row` INTEGER NOT NULL, `migration_status` VARCHAR(191) NOT NULL DEFAULT 'ISOLATED',
    `migrated_invoice_id` VARCHAR(191) NULL, `authorized_by_id` VARCHAR(191) NULL,
    `migrated_at` DATETIME(3) NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `legacy_installments_school_id_legacy_student_ref_idx`(`school_id`, `legacy_student_ref`),
    INDEX `legacy_installments_school_id_migration_status_idx`(`school_id`, `migration_status`),
    INDEX `legacy_installments_student_id_idx`(`student_id`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `legacy_installment_payments` (
    `id` VARCHAR(191) NOT NULL, `legacy_installment_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL, `payment_date` DATETIME(3) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL, `reference` VARCHAR(191) NULL,
    `source_row` INTEGER NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `legacy_installment_payments_legacy_installment_id_payment_da_idx`(`legacy_installment_id`, `payment_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `admission_applications_school_id_status_created_at_idx` ON `admission_applications`(`school_id`, `status`, `created_at`);
CREATE INDEX `admission_applications_school_id_class_id_created_at_idx` ON `admission_applications`(`school_id`, `class_id`, `created_at`);
CREATE INDEX `audit_logs_school_id_created_at_idx` ON `audit_logs`(`school_id`, `created_at`);
CREATE INDEX `audit_logs_user_id_created_at_idx` ON `audit_logs`(`user_id`, `created_at`);
CREATE INDEX `audit_logs_module_action_created_at_idx` ON `audit_logs`(`module`, `action`, `created_at`);
CREATE INDEX `exam_routines_school_id_academic_year_id_exam_date_idx` ON `exam_routines`(`school_id`, `academic_year_id`, `exam_date`);
CREATE INDEX `exam_routines_class_id_section_id_subject_id_idx` ON `exam_routines`(`class_id`, `section_id`, `subject_id`);
CREATE INDEX `financial_transactions_school_id_transaction_date_transactio_idx` ON `financial_transactions`(`school_id`, `transaction_date`, `transaction_type`);
CREATE INDEX `financial_transactions_school_id_category_transaction_date_idx` ON `financial_transactions`(`school_id`, `category`, `transaction_date`);
CREATE INDEX `leave_applications_school_id_status_applied_at_idx` ON `leave_applications`(`school_id`, `status`, `applied_at`);
CREATE INDEX `leave_applications_user_id_start_date_end_date_idx` ON `leave_applications`(`user_id`, `start_date`, `end_date`);
CREATE INDEX `payrolls_school_id_status_created_at_idx` ON `payrolls`(`school_id`, `status`, `created_at`);
CREATE INDEX `payrolls_user_id_created_at_idx` ON `payrolls`(`user_id`, `created_at`);
CREATE INDEX `salary_payments_payroll_id_payment_date_idx` ON `salary_payments`(`payroll_id`, `payment_date`);
CREATE INDEX `student_attendance_records_school_id_date_status_idx` ON `student_attendance_records`(`school_id`, `date`, `status`);
CREATE INDEX `student_attendance_records_student_id_date_idx` ON `student_attendance_records`(`student_id`, `date`);
CREATE INDEX `student_attendance_records_class_id_section_id_date_idx` ON `student_attendance_records`(`class_id`, `section_id`, `date`);
CREATE INDEX `student_invoices_school_id_billing_year_billing_month_paymen_idx` ON `student_invoices`(`school_id`, `billing_year`, `billing_month`, `payment_status`);
CREATE INDEX `student_invoices_student_id_due_date_idx` ON `student_invoices`(`student_id`, `due_date`);
CREATE INDEX `student_invoices_academic_year_id_fee_type_id_idx` ON `student_invoices`(`academic_year_id`, `fee_type_id`);

ALTER TABLE `legacy_installments` ADD CONSTRAINT `legacy_installments_legacy_import_id_fkey`
  FOREIGN KEY (`legacy_import_id`) REFERENCES `legacy_installment_imports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `legacy_installment_payments` ADD CONSTRAINT `legacy_installment_payments_legacy_installment_id_fkey`
  FOREIGN KEY (`legacy_installment_id`) REFERENCES `legacy_installments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
