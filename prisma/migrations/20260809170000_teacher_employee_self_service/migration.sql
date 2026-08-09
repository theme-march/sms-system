INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT `roles`.`id`, `permissions`.`id`, CURRENT_TIMESTAMP(3)
FROM `roles`
JOIN `permissions`
  ON `permissions`.`code` IN ('portal.employee.view', 'leave.view')
WHERE `roles`.`name` = 'Teacher';
