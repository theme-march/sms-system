import { PrismaClient, Gender, PaymentMethod, PaymentStatus, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const db = prisma as any;
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'Demo@123456';
const SCHOOL_CODE = 'DEMO-SCHOOL';
const SUPER_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@school.test';

const at = (year: number, month: number, day: number) => new Date(year, month - 1, day, 9, 0, 0);
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const upsert = (model: string, id: string, data: Record<string, unknown>) =>
  db[model].upsert({ where: { id }, update: data, create: { id, ...data } });

async function main() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const school = await prisma.school.upsert({
    where: { code: SCHOOL_CODE },
    update: { name: 'Shapla Model School & College', eiin: '108245', principalName: 'Dr. Farhana Rahman', address: 'Dhanmondi, Dhaka 1209', phone: '+880 2-55001234', email: 'office@shaplamodel.edu.bd', website: 'https://shaplamodel.edu.bd', status: UserStatus.ACTIVE },
    create: { code: SCHOOL_CODE, name: 'Shapla Model School & College', eiin: '108245', principalName: 'Dr. Farhana Rahman', address: 'Dhanmondi, Dhaka 1209', phone: '+880 2-55001234', email: 'office@shaplamodel.edu.bd', website: 'https://shaplamodel.edu.bd', status: UserStatus.ACTIVE },
  });
  await prisma.schoolSettings.upsert({ where: { schoolId: school.id }, update: { currency: 'BDT', timezone: 'Asia/Dhaka', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'bn', academicYear: String(year) }, create: { schoolId: school.id, currency: 'BDT', timezone: 'Asia/Dhaka', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'bn', academicYear: String(year) } });
  await prisma.brandingSettings.upsert({ where: { schoolId: school.id }, update: { primaryColor: '#0f766e', accentColor: '#14b8a6' }, create: { schoolId: school.id, primaryColor: '#0f766e', accentColor: '#14b8a6' } });

  const roles = Object.fromEntries((await prisma.role.findMany()).map((role) => [role.name, role.id]));
  const accountSpecs = [
    ['demo.academic@school.test', 'Nusrat Jahan', 'Academic Admin'],
    ['demo.admission@school.test', 'Sadia Islam', 'Admission Officer'],
    ['demo.accountant@school.test', 'Mahmud Hasan', 'Accountant'],
    ['demo.hr@school.test', 'Tasnim Akter', 'HR Manager'],
    ['demo.teacher1@school.test', 'Arif Hossain', 'Teacher'],
    ['demo.teacher2@school.test', 'Samira Khan', 'Teacher'],
    ['demo.employee@school.test', 'Rashed Karim', 'Employee'],
    ['demo.student1@school.test', 'Ayan Chowdhury', 'Student'],
    ['demo.student2@school.test', 'Nabila Ahmed', 'Student'],
    ['demo.guardian1@school.test', 'Shafiq Chowdhury', 'Parent/Guardian'],
    ['demo.guardian2@school.test', 'Farzana Ahmed', 'Parent/Guardian'],
  ] as const;
  const users: Record<string, any> = {};
  const superAdmin = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });
  if (!superAdmin) throw new Error(`Missing Super Admin ${SUPER_ADMIN_EMAIL}. Run npm run db:seed first.`);
  users[SUPER_ADMIN_EMAIL] = await prisma.user.update({ where: { id: superAdmin.id }, data: { schoolId: school.id, status: UserStatus.ACTIVE } });
  if (!roles['Super Admin']) throw new Error('Missing Super Admin role. Run npm run db:seed first.');
  // Keep one canonical Super Admin. This also cleans up databases seeded by
  // older versions that created a separate demo.admin@school.test account.
  await prisma.user.deleteMany({ where: { email: 'demo.admin@school.test' } });
  await prisma.userRole.deleteMany({
    where: { roleId: roles['Super Admin'], userId: { not: superAdmin.id } },
  });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: superAdmin.id, roleId: roles['Super Admin'] } }, update: {}, create: { userId: superAdmin.id, roleId: roles['Super Admin'] } });
  for (const [email, name, roleName] of accountSpecs) {
    const user = await prisma.user.upsert({ where: { email }, update: { schoolId: school.id, name, passwordHash, status: UserStatus.ACTIVE }, create: { schoolId: school.id, name, email, passwordHash, phone: `01710${String(Object.keys(users).length + 1).padStart(6, '0')}`, status: UserStatus.ACTIVE, language: 'en' } });
    users[email] = user;
    if (!roles[roleName]) throw new Error(`Missing role: ${roleName}. Run npm run db:seed first.`);
    await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: roles[roleName] } }, update: {}, create: { userId: user.id, roleId: roles[roleName] } });
  }

  const academicYear = await upsert('academicYear', 'demo-academic-year-current', { schoolId: school.id, name: String(year), startDate: at(year, 1, 1), endDate: at(year, 12, 31), isCurrent: true, status: UserStatus.ACTIVE, deletedAt: null });
  const session = await upsert('academicSession', 'demo-session-current', { schoolId: school.id, academicYearId: academicYear.id, name: `${year} Regular Session`, startDate: at(year, 1, 1), endDate: at(year, 12, 31), status: UserStatus.ACTIVE, deletedAt: null });

  const classSpecs = [6, 7, 8, 9, 10];
  const classes: any[] = [];
  const sections: any[] = [];
  for (const level of classSpecs) {
    const cls = await upsert('class', `demo-class-${level}`, { schoolId: school.id, name: `Class ${level}`, code: `C${level}`, numericLevel: level, displayOrder: level, status: UserStatus.ACTIVE, deletedAt: null });
    classes.push(cls);
    for (const [index, name] of ['Padma', 'Meghna'].entries()) {
      const section = await upsert('section', `demo-section-${level}-${index + 1}`, { schoolId: school.id, classId: cls.id, name, code: `${level}${index ? 'M' : 'P'}`, displayOrder: index + 1, capacity: 35, status: UserStatus.ACTIVE, deletedAt: null });
      sections.push(section);
      await upsert('classSection', `demo-class-section-${level}-${index + 1}`, { schoolId: school.id, academicYearId: academicYear.id, classId: cls.id, sectionId: section.id, capacity: 35, status: UserStatus.ACTIVE, deletedAt: null });
    }
  }
  const scienceGroup = await upsert('group', 'demo-group-science', { schoolId: school.id, name: 'Science', description: 'Science group for secondary students', status: UserStatus.ACTIVE, deletedAt: null });
  const humanitiesGroup = await upsert('group', 'demo-group-humanities', { schoolId: school.id, name: 'Humanities', description: 'Humanities group for secondary students', status: UserStatus.ACTIVE, deletedAt: null });
  for (const cls of classes.filter((item) => item.numericLevel >= 9)) {
    await upsert('classGroup', `demo-class-group-${cls.numericLevel}-science`, { schoolId: school.id, academicYearId: academicYear.id, classId: cls.id, groupId: scienceGroup.id, status: UserStatus.ACTIVE, deletedAt: null });
    await upsert('classGroup', `demo-class-group-${cls.numericLevel}-humanities`, { schoolId: school.id, academicYearId: academicYear.id, classId: cls.id, groupId: humanitiesGroup.id, status: UserStatus.ACTIVE, deletedAt: null });
  }

  const subjectSpecs = [
    ['Bangla', 'বাংলা', 'BAN'], ['English', 'ইংরেজি', 'ENG'], ['Mathematics', 'গণিত', 'MAT'],
    ['General Science', 'সাধারণ বিজ্ঞান', 'SCI'], ['Bangladesh & Global Studies', 'বাংলাদেশ ও বিশ্বপরিচয়', 'BGS'], ['ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'ICT'],
  ] as const;
  const subjects: any[] = [];
  for (const [nameEn, nameBn, code] of subjectSpecs) subjects.push(await upsert('subject', `demo-subject-${code.toLowerCase()}`, { schoolId: school.id, nameEn, nameBn, code, subjectType: 'compulsory', description: `${nameEn} curriculum`, status: UserStatus.ACTIVE, deletedAt: null }));

  const rooms = [
    await upsert('room', 'demo-room-201', { schoolId: school.id, name: 'Room 201', code: 'R201', capacity: 40, location: 'Second Floor', status: UserStatus.ACTIVE, deletedAt: null }),
    await upsert('room', 'demo-room-lab', { schoolId: school.id, name: 'Science Lab', code: 'LAB1', capacity: 32, location: 'Third Floor', status: UserStatus.ACTIVE, deletedAt: null }),
  ];
  const periodSpecs = [['1st Period', '08:00', '08:45'], ['2nd Period', '08:45', '09:30'], ['3rd Period', '09:45', '10:30'], ['4th Period', '10:30', '11:15']] as const;
  const periods: any[] = [];
  for (const [index, [name, startTime, endTime]] of periodSpecs.entries()) periods.push(await upsert('period', `demo-period-${index + 1}`, { schoolId: school.id, name, startTime, endTime, displayOrder: index + 1, isBreak: false, status: UserStatus.ACTIVE, deletedAt: null }));

  const academicDept = await prisma.department.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'ACA' } }, update: { nameEn: 'Academic Department', nameBn: 'একাডেমিক বিভাগ', status: UserStatus.ACTIVE }, create: { schoolId: school.id, nameEn: 'Academic Department', nameBn: 'একাডেমিক বিভাগ', code: 'ACA', status: UserStatus.ACTIVE } });
  const adminDept = await prisma.department.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'ADM' } }, update: { nameEn: 'Administration', nameBn: 'প্রশাসন', status: UserStatus.ACTIVE }, create: { schoolId: school.id, nameEn: 'Administration', nameBn: 'প্রশাসন', code: 'ADM', status: UserStatus.ACTIVE } });
  const seniorTeacher = await prisma.designation.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'SNT' } }, update: { nameEn: 'Senior Teacher', nameBn: 'সিনিয়র শিক্ষক', status: UserStatus.ACTIVE }, create: { schoolId: school.id, nameEn: 'Senior Teacher', nameBn: 'সিনিয়র শিক্ষক', code: 'SNT', status: UserStatus.ACTIVE } });
  const officer = await prisma.designation.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'OFF' } }, update: { nameEn: 'Administrative Officer', nameBn: 'প্রশাসনিক কর্মকর্তা', status: UserStatus.ACTIVE }, create: { schoolId: school.id, nameEn: 'Administrative Officer', nameBn: 'প্রশাসনিক কর্মকর্তা', code: 'OFF', status: UserStatus.ACTIVE } });

  const teacherNames = ['Arif Hossain', 'Samira Khan', 'Mahbub Alam', 'Tahmina Sultana', 'Imran Kabir', 'Sharmeen Akter'];
  const teacherUsers = [users['demo.teacher1@school.test'], users['demo.teacher2@school.test']];
  const teachers: any[] = [];
  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = await upsert('teacher', `demo-teacher-${i + 1}`, { schoolId: school.id, userId: teacherUsers[i]?.id || null, employeeCode: `T-${String(i + 1).padStart(3, '0')}`, nameEn: teacherNames[i], nameBn: null, phone: `01820${String(i + 1).padStart(6, '0')}`, email: teacherUsers[i]?.email || `faculty${i + 1}@shaplamodel.edu.bd`, gender: i % 2 ? Gender.FEMALE : Gender.MALE, dateOfBirth: at(1984 + i, 4, 10), joiningDate: at(2016 + i, 1, 5), qualification: i % 2 ? 'M.A., B.Ed.' : 'M.Sc., B.Ed.', specialization: subjects[i].nameEn, departmentId: academicDept.id, designationId: seniorTeacher.id, employmentStatus: 'PERMANENT', status: UserStatus.ACTIVE, salary: 42000 + i * 2500 });
    teachers.push(teacher);
  }
  const employeeSpecs = [
    ['demo-employee-1', users['demo.employee@school.test'].id, 'Rashed Karim', 'E-001'],
    ['demo-employee-2', null, 'Maliha Sultana', 'E-002'],
    ['demo-employee-3', null, 'Abdul Mannan', 'E-003'],
  ] as const;
  const employees: any[] = [];
  for (const [id, userId, nameEn, employeeCode] of employeeSpecs) employees.push(await upsert('employee', id, { schoolId: school.id, userId, employeeCode, nameEn, nameBn: null, phone: `01930${employeeCode.slice(-3).padStart(6, '0')}`, email: userId ? users['demo.employee@school.test'].email : `${employeeCode.toLowerCase()}@shaplamodel.edu.bd`, departmentId: adminDept.id, designationId: officer.id, joiningDate: at(2020, 2, 1), employmentType: 'FULL_TIME', status: UserStatus.ACTIVE }));

  for (const cls of classes) for (let i = 0; i < subjects.length; i++) {
    const teacher = teachers[i];
    await upsert('classSubject', `demo-class-subject-${cls.numericLevel}-${i + 1}`, { schoolId: school.id, academicYearId: academicYear.id, classId: cls.id, groupId: null, subjectId: subjects[i].id, subjectType: 'compulsory', fullMarks: 100, passMarks: 33, status: UserStatus.ACTIVE, teacherId: teacher.id, deletedAt: null });
    const section = sections.find((item) => item.classId === cls.id && item.displayOrder === 1);
    await prisma.teacherAssignment.upsert({ where: { schoolId_academicYearId_classId_sectionId_subjectId_teacherId: { schoolId: school.id, academicYearId: academicYear.id, classId: cls.id, sectionId: section.id, subjectId: subjects[i].id, teacherId: teacher.id } }, update: { status: UserStatus.ACTIVE, isClassTeacher: i === 0, sessionId: session.id }, create: { schoolId: school.id, academicYearId: academicYear.id, sessionId: session.id, teacherId: teacher.id, classId: cls.id, sectionId: section.id, subjectId: subjects[i].id, isClassTeacher: i === 0, status: UserStatus.ACTIVE } });
  }

  const studentNames = ['Ayan Chowdhury','Nabila Ahmed','Rafi Islam','Mim Akter','Samiul Hasan','Anika Rahman','Zayan Karim','Nafisa Noor','Adnan Kabir','Tanjila Haque','Mahin Ahmed','Raisa Khan','Fahim Rahman','Orpa Sultana','Tahsin Alam','Lamisa Islam','Arafat Hossain','Mehjabin Chowdhury','Siam Ahmed','Nusaiba Jahan'];
  const students: any[] = [];
  const enrollments: any[] = [];
  const guardians: any[] = [];
  for (let i = 0; i < studentNames.length; i++) {
    const cls = classes[Math.floor(i / 4)];
    const section = sections.find((item) => item.classId === cls.id && item.displayOrder === (i % 2) + 1);
    const portalUser = i === 0 ? users['demo.student1@school.test'] : i === 1 ? users['demo.student2@school.test'] : null;
    const student = await upsert('student', `demo-student-${i + 1}`, { schoolId: school.id, userId: portalUser?.id || null, admissionNumber: `ADM-${year}-${String(i + 1).padStart(4, '0')}`, studentCode: `SMS-${cls.numericLevel}-${String(i + 1).padStart(3, '0')}`, nameEn: studentNames[i], nameBn: null, gender: i % 2 ? Gender.FEMALE : Gender.MALE, dateOfBirth: at(year - cls.numericLevel - 5, (i % 12) + 1, 10), bloodGroup: ['A+','B+','O+','AB+'][i % 4], birthRegistrationNumber: `BRN${year}${String(i + 1).padStart(7, '0')}`, phone: `01640${String(i + 1).padStart(6, '0')}`, email: portalUser?.email || null, presentAddress: 'Dhanmondi, Dhaka', permanentAddress: 'Dhaka, Bangladesh', previousSchool: i % 3 ? 'Local Primary School' : null, admissionDate: addDays(monthStart, Math.min(i, 20)), status: UserStatus.ACTIVE, classId: cls.id, sectionId: section.id, rollNumber: (i % 4) + 1, fatherName: `Mr. ${studentNames[i].split(' ')[1] || 'Guardian'}`, motherName: `Mrs. ${studentNames[i].split(' ')[1] || 'Guardian'}`, emergencyPhone: `01550${String(i + 1).padStart(6, '0')}` });
    students.push(student);
    const enrollment = await upsert('studentEnrollment', `demo-enrollment-${i + 1}`, { schoolId: school.id, studentId: student.id, academicYearId: academicYear.id, sessionId: session.id, classId: cls.id, sectionId: section.id, groupId: cls.numericLevel >= 9 ? scienceGroup.id : null, rollNumber: (i % 4) + 1, registrationNumber: `REG-${year}-${String(i + 1).padStart(4, '0')}`, enrollmentType: 'REGULAR', enrollmentStatus: 'ACTIVE', startDate: at(year, 1, 5), endDate: null });
    enrollments.push(enrollment);
    const guardianPortalUser = i === 0 ? users['demo.guardian1@school.test'] : i === 1 ? users['demo.guardian2@school.test'] : null;
    const guardian = await upsert('guardian', `demo-guardian-${i + 1}`, { schoolId: school.id, userId: guardianPortalUser?.id || null, name: i === 0 ? 'Shafiq Chowdhury' : i === 1 ? 'Farzana Ahmed' : `Guardian of ${studentNames[i]}`, relationship: i % 2 ? 'MOTHER' : 'FATHER', phone: `01550${String(i + 1).padStart(6, '0')}`, email: guardianPortalUser?.email || null, occupation: i % 3 === 0 ? 'Business' : 'Service', address: 'Dhaka, Bangladesh', portalAccessEnabled: true, status: UserStatus.ACTIVE });
    guardians.push(guardian);
    await prisma.studentGuardian.upsert({ where: { studentId_guardianId: { studentId: student.id, guardianId: guardian.id } }, update: { status: UserStatus.ACTIVE }, create: { studentId: student.id, guardianId: guardian.id, isPrimary: true, isFinancialContact: true, isEmergencyContact: true, relationship: guardian.relationship, status: UserStatus.ACTIVE } });
  }

  const weekdays = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY'];
  await prisma.attendance.deleteMany({ where: { studentId: { in: students.map((student) => student.id) } } });
  for (let d = 0; d < 10; d++) {
    const date = addDays(now, -d); date.setHours(0, 0, 0, 0);
    for (let i = 0; i < students.length; i++) {
      const status = (i + d) % 13 === 0 ? 'absent' : (i + d) % 9 === 0 ? 'late' : 'present';
      await upsert('studentAttendanceRecord', `demo-attendance-${d}-${i + 1}`, { schoolId: school.id, studentId: students[i].id, classId: students[i].classId, sectionId: students[i].sectionId, date, status, remarks: status === 'late' ? 'Arrived after assembly' : null });
      await upsert('attendance', `demo-daily-attendance-${d}-${i + 1}`, { studentId: students[i].id, date, status: status === 'present' ? 'PRESENT' : status === 'late' ? 'LATE' : 'ABSENT' });
    }
  }
  for (let i = 0; i < teachers.length; i++) await upsert('teacherAttendance', `demo-teacher-att-${i + 1}`, { schoolId: school.id, teacherId: teachers[i].id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), status: i === 4 ? 'late' : 'present', inTime: i === 4 ? '08:18' : '07:50', outTime: '15:30' });
  for (let i = 0; i < employees.length; i++) await upsert('employeeAttendance', `demo-employee-att-${i + 1}`, { schoolId: school.id, employeeId: employees[i].id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), status: 'present', inTime: '08:00', outTime: '16:00' });

  for (let day = 0; day < weekdays.length; day++) for (let p = 0; p < periods.length; p++) {
    const cls = classes[(day + p) % classes.length]; const section = sections.find((item) => item.classId === cls.id && item.displayOrder === 1); const subject = subjects[p % subjects.length]; const teacher = teachers[p % teachers.length];
    await upsert('routine', `demo-routine-${day}-${p}`, { classId: cls.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id, dayOfWeek: weekdays[day], startTime: periods[p].startTime, endTime: periods[p].endTime, roomNo: rooms[p % rooms.length].name });
    await upsert('classRoutine', `demo-class-routine-${day}-${p}`, { schoolId: school.id, academicYearId: academicYear.id, sessionId: session.id, classId: cls.id, sectionId: section.id, groupId: null, subjectId: subject.id, teacherId: teacher.id, roomId: rooms[p % rooms.length].id, weekday: weekdays[day], periodId: periods[p].id, startTime: periods[p].startTime, endTime: periods[p].endTime, effectiveFrom: at(year, 1, 1), effectiveTo: null, versionNumber: 1, status: 'PUBLISHED' });
  }
  for (let i = 0; i < 8; i++) { const cls = classes[i % classes.length]; const section = sections.find((item) => item.classId === cls.id && item.displayOrder === 1); await upsert('homework', `demo-homework-${i + 1}`, { classId: cls.id, sectionId: section.id, subjectId: subjects[i % subjects.length].id, teacherId: teachers[i % teachers.length].id, title: ['Creative writing practice','Algebra worksheet','Science observation journal','Reading comprehension'][i % 4], description: 'Complete the assigned work neatly and submit it during the next class.', dueDate: addDays(now, i + 2) }); }

  const completedExam = await upsert('exam', 'demo-exam-completed', { schoolId: school.id, name: `First Term Examination ${year}`, term: 'First Term', year, startDate: addDays(monthStart, -45), endDate: addDays(monthStart, -38), isPublished: true });
  const upcomingExam = await upsert('exam', 'demo-exam-upcoming', { schoolId: school.id, name: `Half-Yearly Examination ${year}`, term: 'Half-Yearly', year, startDate: addDays(now, 14), endDate: addDays(now, 22), isPublished: false });
  for (let i = 0; i < students.length; i++) for (let s = 0; s < 3; s++) { const score = 55 + ((i * 7 + s * 9) % 39); await prisma.mark.upsert({ where: { examId_studentId_subjectId: { examId: completedExam.id, studentId: students[i].id, subjectId: subjects[s].id } }, update: { marksObtained: score, grade: score >= 80 ? 'A+' : score >= 70 ? 'A' : score >= 60 ? 'A-' : 'B' }, create: { examId: completedExam.id, studentId: students[i].id, subjectId: subjects[s].id, marksObtained: score, maxMarks: 100, grade: score >= 80 ? 'A+' : score >= 70 ? 'A' : score >= 60 ? 'A-' : 'B', isLocked: true } }); }
  for (const cls of classes) { const section = sections.find((item) => item.classId === cls.id && item.displayOrder === 1); for (let s = 0; s < 3; s++) await upsert('examRoutine', `demo-exam-routine-${cls.numericLevel}-${s + 1}`, { schoolId: school.id, academicYearId: academicYear.id, examId: upcomingExam.id, classId: cls.id, sectionId: section.id, subjectId: subjects[s].id, examDate: addDays(now, 14 + s), startTime: '10:00', endTime: '13:00', durationMinutes: 180, roomId: rooms[0].id, totalMarks: 100, passMarks: 33, instructions: 'Bring admit card and arrive 30 minutes early.', status: 'PUBLISHED' }); }

  const monthlyFee = await upsert('feeStructure', 'demo-fee-structure-monthly', { schoolId: school.id, name: 'Monthly Tuition Fee', amount: 1800, frequency: 'MONTHLY', description: 'Monthly academic tuition' });
  const tuitionType = await prisma.feeType.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'TUITION' } }, update: { name: 'Monthly Tuition', category: 'TUITION', isRecurring: true }, create: { schoolId: school.id, name: 'Monthly Tuition', code: 'TUITION', category: 'TUITION', isRecurring: true } });
  const examFeeType = await prisma.feeType.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'EXAM' } }, update: { name: 'Examination Fee', category: 'EXAM', isRecurring: false }, create: { schoolId: school.id, name: 'Examination Fee', code: 'EXAM', category: 'EXAM', isRecurring: false } });
  for (let i = 0; i < students.length; i++) {
    const paid = i % 4 === 0 ? 1800 : i % 4 === 1 ? 1000 : 0; const due = 1800 - paid;
    const legacyInvoice = await upsert('feeInvoice', `demo-fee-invoice-${i + 1}`, { schoolId: school.id, studentId: students[i].id, feeStructureId: monthlyFee.id, invoiceNumber: `DEMO-FEE-${year}-${month}-${String(i + 1).padStart(3, '0')}`, amount: 1800, discount: 0, paidAmount: paid, dueDate: at(year, month, 10), status: paid === 1800 ? PaymentStatus.PAID : paid ? PaymentStatus.PARTIAL : PaymentStatus.PENDING });
    if (paid) await upsert('payment', `demo-payment-${i + 1}`, { invoiceId: legacyInvoice.id, receiptNumber: `DEMO-REC-${year}-${month}-${String(i + 1).padStart(3, '0')}`, amount: paid, paymentMethod: i % 2 ? PaymentMethod.BKASH : PaymentMethod.CASH, transactionId: `DEMO-TXN-${i + 1}`, paidAt: addDays(monthStart, Math.min(i + 1, 20)), notes: 'Demo tuition collection' });
    const invoice = await upsert('studentInvoice', `demo-student-invoice-${i + 1}`, { schoolId: school.id, studentId: students[i].id, enrollmentId: enrollments[i].id, academicYearId: academicYear.id, invoiceNumber: `DEMO-INV-${year}-${month}-${String(i + 1).padStart(3, '0')}`, billingYear: year, billingMonth: month, feeTypeId: tuitionType.id, issueDate: monthStart, dueDate: at(year, month, 10), subtotal: 1800, discountAmount: 0, scholarshipAmount: i === 3 ? 300 : 0, waiverAmount: 0, fineAmount: due && now.getDate() > 10 ? 50 : 0, previousDue: 0, totalAmount: i === 3 ? 1500 : 1800, paidAmount: Math.min(paid, i === 3 ? 1500 : 1800), dueAmount: Math.max(0, (i === 3 ? 1500 : 1800) - paid), paymentStatus: paid >= (i === 3 ? 1500 : 1800) ? 'paid' : paid ? 'partially_paid' : 'unpaid' });
    await upsert('invoiceItem', `demo-invoice-item-${i + 1}`, { invoiceId: invoice.id, feeTypeId: tuitionType.id, description: `${monthStart.toLocaleString('en', { month: 'long' })} tuition`, amount: 1800, discount: i === 3 ? 300 : 0, netAmount: i === 3 ? 1500 : 1800, paidAmount: Math.min(paid, i === 3 ? 1500 : 1800) });
  }
  for (let i = 0; i < 6; i++) await upsert('studentInvoice', `demo-exam-invoice-${i + 1}`, { schoolId: school.id, studentId: students[i].id, enrollmentId: enrollments[i].id, academicYearId: academicYear.id, invoiceNumber: `DEMO-EXAM-INV-${year}-${i + 1}`, billingYear: year, billingMonth: month, feeTypeId: examFeeType.id, issueDate: monthStart, dueDate: addDays(now, 7), subtotal: 800, totalAmount: 800, paidAmount: i < 4 ? 800 : 0, dueAmount: i < 4 ? 0 : 800, paymentStatus: i < 4 ? 'paid' : 'unpaid' });
  const cashAccount = await upsert('financialAccount', 'demo-account-cash', { schoolId: school.id, accountName: 'School Cash Account', accountType: 'CASH', accountNumber: 'CASH-001', balance: 185000 });
  await upsert('financialTransaction', 'demo-finance-income-1', { schoolId: school.id, transactionNumber: `DEMO-INCOME-${year}-${month}-1`, accountId: cashAccount.id, transactionType: 'CREDIT', category: 'FEE_COLLECTION', amount: 28600, description: 'Monthly tuition and examination fee collection', transactionDate: addDays(monthStart, 8) });
  await upsert('financialTransaction', 'demo-finance-expense-1', { schoolId: school.id, transactionNumber: `DEMO-EXPENSE-${year}-${month}-1`, accountId: cashAccount.id, transactionType: 'DEBIT', category: 'EXPENSE', amount: 8500, description: 'Electricity and internet bill', transactionDate: addDays(monthStart, 12) });
  await upsert('scholarship', 'demo-scholarship-1', { schoolId: school.id, studentId: students[3].id, title: 'Merit Scholarship', scholarshipType: 'MERIT', percentageOrAmount: 300, isPercentage: false, effectiveFrom: monthStart, effectiveTo: monthEnd, status: 'ACTIVE' });

  const campaign = await upsert('admissionCampaign', 'demo-admission-campaign', { schoolId: school.id, academicYearId: academicYear.id, title: `${year + 1} Admission Programme`, code: `ADM-${year + 1}`, startDate: now, endDate: addDays(now, 60), capacity: 150, status: 'ACTIVE', description: 'Online admission for the next academic session.' });
  const applicantNames = ['Zarif Rahman','Afsana Noor','Rayhan Islam','Ishrat Jahan','Abir Hasan'];
  for (let i = 0; i < applicantNames.length; i++) await upsert('admissionApplication', `demo-admission-${i + 1}`, { schoolId: school.id, campaignId: campaign.id, applicationNumber: `DEMO-APP-${year}-${i + 1}`, trackingCode: `DEMO-TRK-${year}-${i + 1}`, classId: classes[i % 2].id, groupId: null, studentNameEn: applicantNames[i], studentNameBn: null, gender: i % 2 ? Gender.FEMALE : Gender.MALE, dateOfBirth: at(year - 11, i + 1, 15), bloodGroup: 'B+', phone: `01310${String(i + 1).padStart(6, '0')}`, email: `applicant${i + 1}@example.com`, presentAddress: 'Dhaka, Bangladesh', permanentAddress: 'Bangladesh', previousSchool: 'Model Primary School', status: ['submitted','under_review','waiting_list','approved','submitted'][i], paymentStatus: i < 3 ? PaymentStatus.PAID : PaymentStatus.PENDING });

  const leaveType = await prisma.leaveType.upsert({ where: { schoolId_code: { schoolId: school.id, code: 'CASUAL' } }, update: { name: 'Casual Leave', daysAllowed: 10, isActive: true }, create: { schoolId: school.id, name: 'Casual Leave', code: 'CASUAL', description: 'Casual leave for staff', daysAllowed: 10, isCarryForward: false, isPaid: true, isActive: true } });
  await upsert('leaveApplication', 'demo-leave-pending-1', { schoolId: school.id, userId: users['demo.teacher1@school.test'].id, leaveTypeId: leaveType.id, startDate: addDays(now, 3), endDate: addDays(now, 4), totalDays: 2, reason: 'Family programme outside Dhaka', status: 'PENDING', appliedAt: addDays(now, -1) });
  await upsert('leaveApplication', 'demo-leave-approved-1', { schoolId: school.id, userId: users['demo.employee@school.test'].id, leaveTypeId: leaveType.id, startDate: addDays(now, -12), endDate: addDays(now, -12), totalDays: 1, reason: 'Medical appointment', status: 'APPROVED', appliedAt: addDays(now, -15) });

  const payrollPeriod = await prisma.payrollPeriod.upsert({ where: { schoolId_payrollYear_payrollMonth: { schoolId: school.id, payrollYear: year, payrollMonth: month } }, update: { startDate: monthStart, endDate: monthEnd, workingDays: 24, status: 'PARTIALLY_PAID' }, create: { schoolId: school.id, payrollYear: year, payrollMonth: month, startDate: monthStart, endDate: monthEnd, workingDays: 24, status: 'PARTIALLY_PAID' } });
  const payrollUsers = [...teacherUsers, users['demo.employee@school.test']];
  for (let i = 0; i < payrollUsers.length; i++) { const basic = 42000 + i * 3000, allowances = 8000 + i * 500, deductions = 1200, net = basic + allowances - deductions, paid = i === 0 ? net : 0; const payroll = await prisma.payroll.upsert({ where: { payrollPeriodId_userId: { payrollPeriodId: payrollPeriod.id, userId: payrollUsers[i].id } }, update: { basicSalary: basic, totalAllowances: allowances, totalDeductions: deductions, grossSalary: basic + allowances, netSalary: net, paidAmount: paid, status: paid ? 'PAID' : 'APPROVED' }, create: { payrollPeriodId: payrollPeriod.id, schoolId: school.id, userId: payrollUsers[i].id, teacherId: i < 2 ? teachers[i].id : null, basicSalary: basic, totalAllowances: allowances, totalDeductions: deductions, grossSalary: basic + allowances, netSalary: net, paidAmount: paid, status: paid ? 'PAID' : 'APPROVED' } }); if (paid) await upsert('salaryPayment', `demo-salary-payment-${i + 1}`, { payrollId: payroll.id, amount: paid, paymentMethod: 'BANK', transactionRef: `DEMO-SAL-${year}-${month}-${i + 1}`, paymentDate: addDays(monthStart, 25), processedById: users['demo.hr@school.test'].id }); }

  const auditEntries = [
    ['LOGIN','Authentication','Super Admin signed in'], ['CREATE','Students','Admitted 4 new students'], ['UPDATE','Attendance','Submitted today attendance'], ['CREATE','Fees','Generated monthly tuition invoices'], ['EXPORT','Reports','Exported student attendance report'],
  ] as const;
  for (let i = 0; i < auditEntries.length; i++) { const [action, module, details] = auditEntries[i]; await upsert('auditLog', `demo-audit-${i + 1}`, { schoolId: school.id, userId: users[SUPER_ADMIN_EMAIL].id, action, module, details, ipAddress: '127.0.0.1', createdAt: addDays(now, -i) }); }

  console.log('\nDemo MySQL dataset is ready.');
  console.log(`School: ${school.name}`);
  console.log(`Students: ${students.length}, Guardians: ${guardians.length}, Teachers: ${teachers.length}, Employees: ${employees.length}`);
  console.log(`Password for every demo login: ${DEMO_PASSWORD}`);
  console.log(`- Super Admin: ${SUPER_ADMIN_EMAIL} (uses SEED_ADMIN_PASSWORD)`);
  for (const [email, name, role] of accountSpecs) console.log(`- ${role}: ${email} (${name})`);
}

main().catch((error) => { console.error('Demo seed failed:', error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
