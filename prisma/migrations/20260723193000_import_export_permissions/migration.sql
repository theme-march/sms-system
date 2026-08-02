INSERT INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `created_at`)
VALUES
  (UUID(), 'imports.view', 'View Import History', 'Imports', 'View bulk import and export history.', CURRENT_TIMESTAMP(3)),
  (UUID(), 'imports.manage', 'Manage Bulk Imports', 'Imports', 'Preview, validate, and confirm bulk imports.', CURRENT_TIMESTAMP(3)),
  (UUID(), 'legacy.migrate', 'Migrate Legacy Installments', 'Imports', 'Explicitly migrate isolated legacy installments into current billing.', CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `module` = VALUES(`module`),
  `description` = VALUES(`description`);

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT `roles`.`id`, `permissions`.`id`, CURRENT_TIMESTAMP(3)
FROM `roles`
JOIN `permissions`
  ON `permissions`.`code` IN ('imports.view', 'imports.manage', 'legacy.migrate')
WHERE `roles`.`name` = 'Super Admin';

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT `roles`.`id`, `permissions`.`id`, CURRENT_TIMESTAMP(3)
FROM `roles`
JOIN `permissions`
  ON `permissions`.`code` IN ('imports.view', 'imports.manage')
WHERE `roles`.`name` = 'School Admin';
