INSERT IGNORE INTO `permissions` (`id`, `code`, `name`, `module`, `created_at`) VALUES
(UUID(), 'guardians.view', 'View Guardians', 'Guardians', CURRENT_TIMESTAMP(3)),
(UUID(), 'guardians.manage', 'Manage Guardians', 'Guardians', CURRENT_TIMESTAMP(3)),
(UUID(), 'employees.view', 'View Employees', 'Employees', CURRENT_TIMESTAMP(3)),
(UUID(), 'employees.manage', 'Manage Employees', 'Employees', CURRENT_TIMESTAMP(3)),
(UUID(), 'departments.view', 'View Departments', 'HR', CURRENT_TIMESTAMP(3)),
(UUID(), 'departments.manage', 'Manage Departments', 'HR', CURRENT_TIMESTAMP(3)),
(UUID(), 'designations.view', 'View Designations', 'HR', CURRENT_TIMESTAMP(3)),
(UUID(), 'designations.manage', 'Manage Designations', 'HR', CURRENT_TIMESTAMP(3)),
(UUID(), 'teacher-assignments.view', 'View Teacher Assignments', 'Teachers', CURRENT_TIMESTAMP(3)),
(UUID(), 'teacher-assignments.manage', 'Manage Teacher Assignments', 'Teachers', CURRENT_TIMESTAMP(3)),
(UUID(), 'homework.view', 'View Homework', 'Homework', CURRENT_TIMESTAMP(3)),
(UUID(), 'homework.manage', 'Manage Homework', 'Homework', CURRENT_TIMESTAMP(3)),
(UUID(), 'leave.view', 'View Leave', 'Leave', CURRENT_TIMESTAMP(3)),
(UUID(), 'leave.manage', 'Manage Leave', 'Leave', CURRENT_TIMESTAMP(3)),
(UUID(), 'portal.teacher.view', 'Access Teacher Portal', 'Portals', CURRENT_TIMESTAMP(3)),
(UUID(), 'portal.student.view', 'Access Student Portal', 'Portals', CURRENT_TIMESTAMP(3)),
(UUID(), 'portal.guardian.view', 'Access Guardian Portal', 'Portals', CURRENT_TIMESTAMP(3)),
(UUID(), 'portal.employee.view', 'Access Employee Self Service', 'Portals', CURRENT_TIMESTAMP(3));

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT r.`id`, p.`id`, CURRENT_TIMESTAMP(3)
FROM `roles` r CROSS JOIN `permissions` p
WHERE r.`name` = 'Super Admin'
   OR (r.`name` = 'School Admin' AND p.`code` <> 'legacy.migrate')
   OR (r.`name` = 'Academic Admin' AND p.`code` IN ('guardians.view','teacher-assignments.view','homework.view','homework.manage'))
   OR (r.`name` = 'Admission Officer' AND p.`code` IN ('guardians.view','guardians.manage'))
   OR (r.`name` = 'HR Manager' AND p.`code` IN ('employees.view','employees.manage','departments.view','departments.manage','designations.view','designations.manage','leave.view','leave.manage'))
   OR (r.`name` = 'Teacher' AND p.`code` IN ('homework.view','homework.manage','portal.teacher.view'))
   OR (r.`name` = 'Employee' AND p.`code` IN ('portal.employee.view','leave.view'))
   OR (r.`name` = 'Student' AND p.`code` = 'portal.student.view')
   OR (r.`name` = 'Parent/Guardian' AND p.`code` = 'portal.guardian.view');
