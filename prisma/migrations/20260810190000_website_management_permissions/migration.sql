INSERT INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `created_at`) VALUES
  (UUID(), 'website.overview.manage', 'Manage Website Overview & Global Settings', 'Website Management', 'Update global website theme, navigation and footer.', NOW()),
  (UUID(), 'website.custom-pages.manage', 'Manage Website Custom Pages', 'Website Management', 'Create, edit and delete public custom pages.', NOW()),
  (UUID(), 'website.banners.manage', 'Manage Website Banner Slider', 'Website Management', 'Update homepage banners, images and links.', NOW()),
  (UUID(), 'website.home.manage', 'Manage Website Home Page', 'Website Management', 'Update homepage content, notices and featured sections.', NOW()),
  (UUID(), 'website.about.manage', 'Manage Website About Page', 'Website Management', 'Update school introduction and about sections.', NOW()),
  (UUID(), 'website.academics.manage', 'Manage Website Academics Page', 'Website Management', 'Update public academic activities and curriculum content.', NOW()),
  (UUID(), 'website.programs.manage', 'Manage Website Programs Page', 'Website Management', 'Update programs, clubs and co-curricular content.', NOW()),
  (UUID(), 'website.gallery.manage', 'Manage Website Gallery Page', 'Website Management', 'Update public gallery images and content.', NOW()),
  (UUID(), 'website.events.manage', 'Manage Website Events Page', 'Website Management', 'Update events, calendar and public notices.', NOW()),
  (UUID(), 'website.admission.manage', 'Manage Website Admission Page', 'Website Management', 'Update public admission information and requirements.', NOW()),
  (UUID(), 'website.teachers.manage', 'Manage Website Teachers Page', 'Website Management', 'Select and update teachers shown on the public website.', NOW()),
  (UUID(), 'website.facilities.manage', 'Manage Website Facilities Page', 'Website Management', 'Update campus facilities and services.', NOW()),
  (UUID(), 'website.achievements.manage', 'Manage Website Achievements Page', 'Website Management', 'Update public awards, results and achievements.', NOW()),
  (UUID(), 'website.downloads.manage', 'Manage Website Downloads Page', 'Website Management', 'Upload and manage forms, syllabus and publications.', NOW()),
  (UUID(), 'website.contact.manage', 'Manage Website Contact Page', 'Website Management', 'Update public contact and office information.', NOW())
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `module` = VALUES(`module`),
  `description` = VALUES(`description`);

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT r.id, p.id, NOW()
FROM `roles` r
JOIN `permissions` p ON p.code LIKE 'website.%.manage'
WHERE r.name IN ('Super Admin', 'School Admin', 'Website Management');
