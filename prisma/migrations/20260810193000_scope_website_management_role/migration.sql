-- Website Management is a dedicated least-privilege role. It can manage every
-- public website section but cannot change school identity, users, academics,
-- finance or any other management-console data.
DELETE rp
FROM `role_permissions` rp
JOIN `roles` r ON r.id = rp.role_id
WHERE r.name = 'Website Management';

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT r.id, p.id, NOW()
FROM `roles` r
JOIN `permissions` p ON p.code LIKE 'website.%.manage'
WHERE r.name = 'Website Management';
