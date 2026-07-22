import { PrismaClient, UserStatus, Gender, AttendanceStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding...');

  const seedAdminName = process.env.SEED_ADMIN_NAME || 'Super Admin';
  const seedAdminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@school.com';
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword123!';

  const passwordHash = await bcrypt.hash(seedAdminPassword, 10);

  // 1. Create Default School
  const school = await prisma.school.upsert({
    where: { code: 'SCH-001' },
    update: {},
    create: {
      code: 'SCH-001',
      name: 'Dhaka Ideal Model High School & College',
      eiin: '108234',
      principalName: 'Prof. Dr. Mohammad Rahman',
      address: 'Plot 12, Road 4, Sector 7, Uttara, Dhaka-1230, Bangladesh',
      phone: '+880 2 8951234',
      email: 'info@dhakaideal.edu.bd',
      website: 'https://dhakaideal.edu.bd',
      status: UserStatus.ACTIVE,
      settings: {
        create: {
          currency: 'BDT',
          timezone: 'Asia/Dhaka',
          dateFormat: 'DD/MM/YYYY',
          defaultLanguage: 'bn',
          academicYear: '2026',
        },
      },
      branding: {
        create: {
          logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
          faviconUrl: '/favicon.ico',
          primaryColor: '#0d9488',
          accentColor: '#0f766e',
        },
      },
    },
  });

  console.log(`✅ School created/updated: ${school.name} (EIIN: ${school.eiin})`);

  // 2. Define Granular Permissions
  const permissionCodes = [
    { code: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard' },
    { code: 'users.view', name: 'View Users', module: 'Users' },
    { code: 'users.manage', name: 'Manage Users', module: 'Users' },
    { code: 'roles.view', name: 'View Roles', module: 'Roles' },
    { code: 'roles.manage', name: 'Manage Roles', module: 'Roles' },
    { code: 'school.settings.manage', name: 'Manage School Settings', module: 'Settings' },
    { code: 'academic.view', name: 'View Academic Records', module: 'Academics' },
    { code: 'academic.manage', name: 'Manage Academic Records', module: 'Academics' },
    { code: 'students.view', name: 'View Students', module: 'Students' },
    { code: 'students.manage', name: 'Manage Students', module: 'Students' },
    { code: 'admissions.view', name: 'View Admissions', module: 'Admissions' },
    { code: 'admissions.manage', name: 'Manage Admissions', module: 'Admissions' },
    { code: 'teachers.view', name: 'View Teachers', module: 'Teachers' },
    { code: 'teachers.manage', name: 'Manage Teachers', module: 'Teachers' },
    { code: 'routines.view', name: 'View Routines', module: 'Routines' },
    { code: 'routines.manage', name: 'Manage Routines', module: 'Routines' },
    { code: 'attendance.view', name: 'View Attendance', module: 'Attendance' },
    { code: 'attendance.manage', name: 'Manage Attendance', module: 'Attendance' },
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
    { code: 'reports.view', name: 'View Reports', module: 'Reports' },
    { code: 'reports.export', name: 'Export Reports', module: 'Reports' },
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

  // 4. Seed Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: seedAdminEmail },
    update: {
      name: seedAdminName,
      passwordHash,
      schoolId: school.id,
    },
    create: {
      name: seedAdminName,
      email: seedAdminEmail,
      passwordHash,
      schoolId: school.id,
      phone: '+8801700000000',
      status: UserStatus.ACTIVE,
      language: 'en',
    },
  });

  // Assign Super Admin Role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRoleId,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRoleId,
    },
  });

  console.log(`🔑 Super Admin User created: ${adminUser.email} / ${seedAdminPassword}`);

  // 5. Seed Classes & Sections
  const class10 = await prisma.class.upsert({
    where: { schoolId_code: { schoolId: school.id, code: 'CLASS-10' } },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Class 10',
      code: 'CLASS-10',
      numericLevel: 10,
      sections: {
        create: [
          { name: 'Padma', capacity: 40 },
          { name: 'Meghna', capacity: 40 },
        ],
      },
    },
  });

  console.log(`📚 Class created: ${class10.name}`);

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
