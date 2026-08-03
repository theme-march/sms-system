CREATE TABLE `website_settings` (
  `id` VARCHAR(191) NOT NULL,
  `school_id` VARCHAR(191) NOT NULL,
  `content` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `website_settings_school_id_key`(`school_id`),
  PRIMARY KEY (`id`),
  CONSTRAINT `website_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
