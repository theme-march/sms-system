import { PrismaClient, UserStatus, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding...');

  const required = (name: string) => {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`${name} is required for production bootstrap`);
    return value;
  };
  const seedSchoolName = required('SEED_SCHOOL_NAME');
  const seedSchoolCode = required('SEED_SCHOOL_CODE');
  const seedAdminName = required('SEED_ADMIN_NAME');
  const seedAdminEmail = required('SEED_ADMIN_EMAIL');
  const seedAdminPassword = required('SEED_ADMIN_PASSWORD');
  const forcePasswordUpdate = process.env.FORCE_SEED_PASSWORD_UPDATE === 'true';

  const passwordHash = await bcrypt.hash(seedAdminPassword, 10);

  // 1. Create or Update Default School
  const school = await prisma.school.upsert({
    where: { code: seedSchoolCode },
    update: {
      name: seedSchoolName,
    },
    create: {
      code: seedSchoolCode,
      name: seedSchoolName,
      status: UserStatus.ACTIVE,
      settings: {
        create: {
          currency: 'BDT',
          timezone: 'Asia/Dhaka',
          dateFormat: 'DD/MM/YYYY',
          defaultLanguage: 'bn',
          academicYear: new Date().getFullYear().toString(),
        },
      },
      branding: {
        create: {
          primaryColor: '#0d9488',
          accentColor: '#0f766e',
        },
      },
    },
  });

  console.log(`✅ School created/updated: ${school.name}`);

  // 2. Define Granular Permissions
  const permissionCodes = [
    { code: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard' },
    { code: 'users.view', name: 'View Users', module: 'Users' },
    { code: 'users.manage', name: 'Manage Users', module: 'Users' },
    { code: 'roles.view', name: 'View Roles', module: 'Roles' },
    { code: 'roles.manage', name: 'Manage Roles', module: 'Roles' },
    { code: 'school.settings.manage', name: 'Manage School Settings', module: 'Settings' },
    { code: 'website.overview.manage', name: 'Manage Website Overview & Global Settings', module: 'Website Settings' },
    { code: 'website.custom-pages.manage', name: 'Manage Website Custom Pages', module: 'Website Settings' },
    { code: 'website.banners.manage', name: 'Manage Website Banner Slider', module: 'Website Settings' },
    { code: 'website.home.manage', name: 'Manage Website Home Page', module: 'Website Settings' },
    { code: 'website.about.manage', name: 'Manage Website About Page', module: 'Website Settings' },
    { code: 'website.academics.manage', name: 'Manage Website Academics Page', module: 'Website Settings' },
    { code: 'website.programs.manage', name: 'Manage Website Programs Page', module: 'Website Settings' },
    { code: 'website.gallery.manage', name: 'Manage Website Gallery Page', module: 'Website Settings' },
    { code: 'website.events.manage', name: 'Manage Website Events Page', module: 'Website Settings' },
    { code: 'website.admission.manage', name: 'Manage Website Admission Page', module: 'Website Settings' },
    { code: 'website.teachers.manage', name: 'Manage Website Teachers Page', module: 'Website Settings' },
    { code: 'website.facilities.manage', name: 'Manage Website Facilities Page', module: 'Website Settings' },
    { code: 'website.achievements.manage', name: 'Manage Website Achievements Page', module: 'Website Settings' },
    { code: 'website.downloads.manage', name: 'Manage Website Downloads Page', module: 'Website Settings' },
    { code: 'website.contact.manage', name: 'Manage Website Contact Page', module: 'Website Settings' },
    { code: 'academic.view', name: 'View Academic Records', module: 'Academics' },
    { code: 'academic.manage', name: 'Manage Academic Records', module: 'Academics' },
    { code: 'students.view', name: 'View Students', module: 'Students' },
    { code: 'students.manage', name: 'Manage Students', module: 'Students' },
    { code: 'guardians.view', name: 'View Guardians', module: 'Guardians' },
    { code: 'guardians.manage', name: 'Manage Guardians', module: 'Guardians' },
    { code: 'admissions.view', name: 'View Admissions', module: 'Admissions' },
    { code: 'admissions.manage', name: 'Manage Admissions', module: 'Admissions' },
    { code: 'teachers.view', name: 'View Teachers', module: 'Teachers' },
    { code: 'teachers.manage', name: 'Manage Teachers', module: 'Teachers' },
    { code: 'employees.view', name: 'View Employees', module: 'Employees' },
    { code: 'employees.manage', name: 'Manage Employees', module: 'Employees' },
    { code: 'departments.view', name: 'View Departments', module: 'HR' },
    { code: 'departments.manage', name: 'Manage Departments', module: 'HR' },
    { code: 'designations.view', name: 'View Designations', module: 'HR' },
    { code: 'designations.manage', name: 'Manage Designations', module: 'HR' },
    { code: 'teacher-assignments.view', name: 'View Teacher Assignments', module: 'Teachers' },
    { code: 'teacher-assignments.manage', name: 'Manage Teacher Assignments', module: 'Teachers' },
    { code: 'routines.view', name: 'View Routines', module: 'Routines' },
    { code: 'routines.manage', name: 'Manage Routines', module: 'Routines' },
    { code: 'attendance.view', name: 'View Attendance', module: 'Attendance' },
    { code: 'attendance.manage', name: 'Manage Attendance', module: 'Attendance' },
    { code: 'homework.view', name: 'View Homework', module: 'Homework' },
    { code: 'homework.manage', name: 'Manage Homework', module: 'Homework' },
    { code: 'exams.view', name: 'View Exams', module: 'Exams' },
    { code: 'exams.manage', name: 'Manage Exams', module: 'Exams' },
    { code: 'marks.enter', name: 'Enter Marks', module: 'Marks' },
    { code: 'marks.verify', name: 'Verify Marks', module: 'Marks' },
    { code: 'marks.lock', name: 'Lock Marks', module: 'Marks' },
    { code: 'results.calculate', name: 'Calculate Results', module: 'Results' },
    { code: 'results.publish', name: 'Publish Results', module: 'Results' },
    { code: 'fees.view', name: 'View Fees', module: 'Fees' },
    { code: 'fees.manage', name: 'Manage Fees', module: 'Fees' },
    { code: 'payments.collect', name: 'Collect Payments', module: 'Payments' },
    { code: 'payments.reverse', name: 'Reverse Payments', module: 'Payments' },
    { code: 'payroll.view', name: 'View Payroll', module: 'Payroll' },
    { code: 'payroll.generate', name: 'Generate Payroll', module: 'Payroll' },
    { code: 'payroll.approve', name: 'Approve Payroll', module: 'Payroll' },
    { code: 'leave.view', name: 'View Leave', module: 'Leave' },
    { code: 'leave.manage', name: 'Manage Leave', module: 'Leave' },
    { code: 'reports.view', name: 'View Reports', module: 'Reports' },
    { code: 'reports.export', name: 'Export Reports', module: 'Reports' },
    { code: 'imports.view', name: 'View Import History', module: 'Imports' },
    { code: 'imports.manage', name: 'Manage Bulk Imports', module: 'Imports' },
    { code: 'legacy.migrate', name: 'Migrate Legacy Installments', module: 'Imports' },
    { code: 'portal.teacher.view', name: 'Access Teacher Portal', module: 'Portals' },
    { code: 'portal.student.view', name: 'Access Student Portal', module: 'Portals' },
    { code: 'portal.guardian.view', name: 'Access Guardian Portal', module: 'Portals' },
    { code: 'portal.employee.view', name: 'Access Employee Self Service', module: 'Portals' },
    { code: 'audit.view', name: 'View Audit Logs', module: 'Audit' },
    { code: 'backup.manage', name: 'Manage Backups', module: 'Backup' },
  ];

  const dbPermissions = [];
  for (const perm of permissionCodes) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: { name: perm.name, module: perm.module },
      create: perm,
    });
    dbPermissions.push(p);
  }

  console.log(`✅ ${dbPermissions.length} Permissions synced`);

  // 3. Create System Roles
  const rolesData = [
    { name: 'Super Admin', displayName: 'Super Administrator', isSystem: true },
    { name: 'School Admin', displayName: 'School Administrator', isSystem: true },
    { name: 'Academic Admin', displayName: 'Academic Administrator', isSystem: true },
    { name: 'Admission Officer', displayName: 'Admission Officer', isSystem: true },
    { name: 'Accountant', displayName: 'Accountant', isSystem: true },
    { name: 'HR Manager', displayName: 'HR Manager', isSystem: true },
    { name: 'Teacher', displayName: 'Teacher', isSystem: true },
    { name: 'Employee', displayName: 'Employee', isSystem: true },
    { name: 'Student', displayName: 'Student', isSystem: true },
    { name: 'Parent/Guardian', displayName: 'Parent/Guardian', isSystem: true },
  ];

  const rolesMap: Record<string, string> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { displayName: r.displayName },
      create: r,
    });
    rolesMap[r.name] = role.id;
  }

  console.log(`✅ ${rolesData.length} Roles synced`);

  // Assign ALL permissions to Super Admin
  const superAdminRoleId = rolesMap['Super Admin'];
  for (const perm of dbPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRoleId,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRoleId,
        permissionId: perm.id,
      },
    });
  }

  console.log(`✅ Super Admin permissions assigned`);

  // Assign management-console permissions to staff roles. Portal-only users are
  // redirected to their own portal and do not receive school-wide analytics.
  const staffRolePermissions: Record<string, string[]> = {
    'School Admin': permissionCodes.map((permission) => permission.code).filter((code) => code !== 'legacy.migrate'),
    'Academic Admin': [
      'dashboard.view', 'academic.view', 'academic.manage', 'students.view',
      'students.manage', 'guardians.view', 'admissions.view', 'teachers.view', 'teacher-assignments.view', 'routines.view',
      'routines.manage', 'attendance.view', 'attendance.manage', 'exams.view',
      'exams.manage', 'homework.view', 'homework.manage', 'marks.enter', 'marks.verify', 'results.calculate',
      'results.publish', 'reports.view', 'reports.export', 'imports.view',
    ],
    'Admission Officer': [
      'dashboard.view', 'students.view', 'students.manage', 'guardians.view', 'guardians.manage', 'admissions.view',
      'admissions.manage', 'reports.view', 'reports.export', 'imports.view',
      'imports.manage',
    ],
    Accountant: [
      'dashboard.view', 'students.view', 'fees.view', 'fees.manage',
      'payments.collect', 'payments.reverse', 'payroll.view', 'reports.view',
      'reports.export', 'imports.view', 'imports.manage',
    ],
    'HR Manager': [
      'dashboard.view', 'teachers.view', 'teachers.manage', 'employees.view', 'employees.manage',
      'departments.view', 'departments.manage', 'designations.view', 'designations.manage', 'leave.view', 'leave.manage', 'payroll.view',
      'payroll.generate', 'payroll.approve', 'reports.view', 'reports.export',
      'imports.view', 'imports.manage',
    ],
    Teacher: [
      'dashboard.view', 'academic.view', 'students.view', 'routines.view',
      'attendance.view', 'attendance.manage', 'exams.view', 'homework.view', 'homework.manage',
      'marks.enter', 'portal.teacher.view', 'portal.employee.view', 'leave.view',
    ],
    Employee: ['portal.employee.view', 'leave.view'],
    Student: ['portal.student.view'],
    'Parent/Guardian': ['portal.guardian.view'],
  };

  for (const [roleName, codes] of Object.entries(staffRolePermissions)) {
    const roleId = rolesMap[roleName];
    const existingAssignments = await prisma.rolePermission.count({ where: { roleId } });
    if (existingAssignments > 0) {
      console.log(`â„¹ï¸ Existing custom permissions preserved for ${roleName}`);
      continue;
    }
    for (const permission of dbPermissions.filter((item) => codes.includes(item.code))) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: permission.id } },
        update: {},
        create: { roleId, permissionId: permission.id },
      });
    }
  }

  console.log(`✅ Staff role permissions assigned`);

  // 4. Seed or Update Super Admin User (idempotent)
  let adminUser = await prisma.user.findUnique({
    where: { email: seedAdminEmail },
  });

  if (adminUser) {
    // Always keep the bootstrap admin attached to the configured school. An
    // older tenant association makes every tenant-scoped screen appear empty.
    adminUser = await prisma.user.update({
      where: { email: seedAdminEmail },
      data: {
        name: seedAdminName,
        schoolId: school.id,
        status: UserStatus.ACTIVE,
        ...(forcePasswordUpdate ? { passwordHash } : {}),
      },
    });
    if (forcePasswordUpdate) {
      console.log(`🔑 Super Admin password updated`);
    } else {
      console.log(`🔑 Super Admin school synchronized (password not updated)`);
    }
  } else {
    adminUser = await prisma.user.create({
      data: {
        name: seedAdminName,
        email: seedAdminEmail,
        passwordHash,
        schoolId: school.id,
        phone: '+8801700000000',
        status: UserStatus.ACTIVE,
        language: 'en',
      },
    });
    console.log(`🔑 Super Admin user created: ${seedAdminEmail}`);
  }

  // Assign Super Admin Role (if not already assigned)
  const existingRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRoleId,
      },
    },
  });

  if (!existingRole) {
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: superAdminRoleId,
      },
    });
    console.log(`✅ Super Admin role assigned`);
  }

  // Test accounts are opt-in for local QA and are never created by default.
  if (process.env.SEED_TEST_ACCOUNTS === 'true') {
    const roleUserHash = await bcrypt.hash(seedAdminPassword, 10);

    for (const [roleName, roleId] of Object.entries(rolesMap)) {
      if (roleName === 'Super Admin') continue;

      const localPart = roleName.toLowerCase().replace(/[^a-z0-9]+/g, '.');
      const email = `${localPart}@school.test`;
      const displayName = `${roleName} Test`;
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: displayName,
            email,
            passwordHash: roleUserHash,
            schoolId: school.id,
            phone: '+8801700000000',
            status: UserStatus.ACTIVE,
            language: 'en',
          },
        });
      }

      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId } },
        update: {},
        create: { userId: user.id, roleId },
      });
    }
  }

  console.log('✨ Seed completed successfully!');
  console.log(`\n📝 Default Login Credentials:`);
  console.log(`   Email: ${seedAdminEmail}`);
  console.log(`   Password: ${seedAdminPassword}`);

  if (process.env.SEED_TEST_ACCOUNTS === 'true') {
    console.log('\nTest accounts were enabled with SEED_TEST_ACCOUNTS=true.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
