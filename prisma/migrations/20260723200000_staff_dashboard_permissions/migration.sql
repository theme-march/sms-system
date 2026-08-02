INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT `roles`.`id`, `permissions`.`id`, CURRENT_TIMESTAMP(3)
FROM `roles`
JOIN `permissions` ON `permissions`.`code` = 'dashboard.view'
WHERE `roles`.`name` IN (
  'School Admin',
  'Academic Admin',
  'Admission Officer',
  'Accountant',
  'HR Manager'
);
