import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
  const school = await prisma.school.findFirst();
  const where = school ? { schoolId: school.id } : {};
  const [classes, sections, subjects, teachers, students, enrollments, teacherAssignments] = await Promise.all([
    prisma.class.count({ where }),
    prisma.section.count({ where }),
    prisma.subject.count({ where }),
    prisma.teacher.count({ where }),
    prisma.student.count({ where }),
    prisma.studentEnrollment.count({ where }),
    prisma.teacherAssignment.count({ where }),
  ]);
  console.log('Seed stats:');
  console.log('Classes:', classes);
  console.log('Sections:', sections);
  console.log('Subjects:', subjects);
  console.log('Teachers:', teachers);
  console.log('Students:', students);
  console.log('Enrollments:', enrollments);
  console.log('TeacherAssignments:', teacherAssignments);
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(async ()=>{await prisma.$disconnect()});
