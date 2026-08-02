'use server';

import prisma from '@/src/lib/db/prisma';
import { toClientData } from '@/src/lib/serialize';
import bcrypt from 'bcryptjs';

export interface AdmissionApplicationFilterParams {
  search?: string;
  campaignId?: string;
  classId?: string;
  status?: string;
  trackingCode?: string;
  schoolId?: string;
  page?: number;
  pageSize?: number;
}

export interface SubmitAdmissionInput {
  schoolId?: string;
  campaignId?: string;
  classId: string;
  groupId?: string;
  studentNameEn: string;
  studentNameBn?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  bloodGroup?: string;
  birthRegistrationNumber?: string;
  phone?: string;
  email?: string;
  presentAddress?: string;
  permanentAddress?: string;
  previousSchool?: string;
  guardians: Array<{
    name: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    occupation?: string;
    nationalId?: string;
    address?: string;
    isPrimary?: boolean;
    isFinancialContact?: boolean;
    isEmergencyContact?: boolean;
  }>;
  documents?: Array<{
    documentType: string;
    title: string;
    fileUrl: string;
  }>;
}

export async function getAdmissionCampaigns(schoolId?: string) {
  try {
    const campaigns = await prisma.admissionCampaign.findMany({
      where: schoolId ? { schoolId } : {},
      include: {
        academicYear: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return toClientData(campaigns);
  } catch (error) {
    console.error('DB error fetching admission campaigns:', error);
    return [];
  }
}

export async function createAdmissionCampaign(data: any) {
  try {
    return toClientData(await prisma.admissionCampaign.create({ data }));
  } catch (error) {
    console.error('Failed to create admission campaign:', error);
    throw error;
  }
}

export async function getAdmissionApplications(params: AdmissionApplicationFilterParams = {}) {
  const { search = '', campaignId = '', classId = '', status = '', trackingCode = '', schoolId, page = 1, pageSize = 10 } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (campaignId) where.campaignId = campaignId;
    if (classId) where.classId = classId;
    if (status) where.status = status;
    if (trackingCode) where.trackingCode = { contains: trackingCode };

    if (search) {
      where.OR = [
        { studentNameEn: { contains: search } },
        { studentNameBn: { contains: search } },
        { applicationNumber: { contains: search } },
        { trackingCode: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, applications] = await Promise.all([
      prisma.admissionApplication.count({ where }),
      prisma.admissionApplication.findMany({
        where,
        include: {
          class: true,
          group: true,
          campaign: true,
          guardians: true,
          documents: true,
          reviews: { orderBy: { createdAt: 'desc' } },
          test: true,
          interview: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return toClientData({ total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: applications });
  } catch (error) {
    console.error('DB query for admission applications failed:', error);
    return {
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      data: [],
    };
  }
}

export async function getAdmissionApplicationByTracking(codeOrNumber: string, phone?: string) {
  try {
    const application = await prisma.admissionApplication.findFirst({
      where: {
        OR: [{ trackingCode: codeOrNumber }, { applicationNumber: codeOrNumber }],
        ...(phone ? { phone: { contains: phone } } : {}),
      },
      include: {
        class: true,
        group: true,
        campaign: true,
        guardians: true,
        documents: true,
        reviews: { orderBy: { createdAt: 'desc' } },
        test: true,
        interview: true,
      },
    });
    if (application) return toClientData(application);
  } catch (error) {
    console.error('DB error fetching application tracking:', error);
  }

  return null;
}

export async function submitAdmissionApplication(input: SubmitAdmissionInput) {
  const applicationNumber = `APP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
  const trackingCode = 'TRK-' + Math.random().toString(36).substring(2, 7).toUpperCase();

  let schoolId = input.schoolId;
  if (!schoolId) {
    const firstSchool = await prisma.school.findFirst({ where: { status: 'ACTIVE' } });
    schoolId = firstSchool?.id;
  }
  if (!schoolId) throw new Error('No active school is configured for admission.');

  try {
    const created = await prisma.admissionApplication.create({
      data: {
        schoolId: schoolId!,
        campaignId: input.campaignId,
        applicationNumber,
        trackingCode,
        classId: input.classId,
        groupId: input.groupId,
        studentNameEn: input.studentNameEn,
        studentNameBn: input.studentNameBn,
        gender: input.gender,
        dateOfBirth: new Date(input.dateOfBirth),
        bloodGroup: input.bloodGroup,
        birthRegistrationNumber: input.birthRegistrationNumber,
        phone: input.phone,
        email: input.email,
        presentAddress: input.presentAddress,
        permanentAddress: input.permanentAddress,
        previousSchool: input.previousSchool,
        status: 'submitted',
        paymentStatus: 'PAID',
        guardians: {
          create: input.guardians.map((g) => ({
            name: g.name,
            relationship: g.relationship,
            phone: g.phone,
            alternatePhone: g.alternatePhone,
            email: g.email,
            occupation: g.occupation,
            nationalId: g.nationalId,
            address: g.address,
            isPrimary: g.isPrimary ?? true,
            isFinancialContact: g.isFinancialContact ?? true,
            isEmergencyContact: g.isEmergencyContact ?? true,
          })),
        },
        documents: input.documents
          ? {
              create: input.documents.map((d) => ({
                documentType: d.documentType,
                title: d.title,
                fileUrl: d.fileUrl,
                status: 'PENDING',
              })),
            }
          : undefined,
      },
      include: {
        class: true,
        guardians: true,
        documents: true,
      },
    });

    return toClientData(created);
  } catch (error) {
    console.error('DB creation failed for admission application:', error);
    throw error;
  }
}

export async function reviewAdmissionApplication(
  applicationId: string,
  reviewData: { decision: string; comments?: string; reviewerId?: string; rejectionReason?: string; correctionNotes?: string }
) {
  const { decision, comments, reviewerId, rejectionReason, correctionNotes } = reviewData;

  // Decision to status mapping:
  // approved, rejected, waiting_list, correction_requested, under_review
  let newStatus = decision.toLowerCase();
  if (decision === 'CORRECTION_REQUESTED') newStatus = 'correction_requested';
  if (decision === 'WAITING_LIST') newStatus = 'waiting_list';

  try {
    const updated = await prisma.admissionApplication.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        rejectionReason: rejectionReason || undefined,
        correctionNotes: correctionNotes || undefined,
        reviews: {
          create: {
            reviewerId,
            decision,
            comments,
          },
        },
      },
      include: {
        class: true,
        guardians: true,
        reviews: true,
      },
    });
    return toClientData(updated);
  } catch (error) {
    console.error('DB update failed for admission review:', error);
    throw error;
  }
}

/**
 * ADMISSION APPROVAL TRANSACTION
 * Executed inside 1 Prisma transaction:
 * 1. Validate application.
 * 2. Check duplicate student.
 * 3. Create student record.
 * 4. Create or connect guardian records.
 * 5. Create student_guardian relationships.
 * 6. Create student and guardian login accounts where enabled.
 * 7. Create student enrollment.
 * 8. Generate admission fee invoice foundation.
 * 9. Update application status.
 * 10. Create audit logs.
 * 11. Create notification records.
 * Rollback everything when a critical step fails.
 */
export async function approveAdmissionApplicationTransaction(
  applicationId: string,
  options: {
    academicYearId?: string;
    sectionId?: string;
    rollNumber?: number;
    feeStructureId?: string;
    createdByUserId?: string;
  } = {}
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate application
      const app = await tx.admissionApplication.findUnique({
        where: { id: applicationId },
        include: {
          guardians: true,
          documents: true,
          class: true,
          school: true,
        },
      });

      if (!app) {
        throw new Error(`Admission application #${applicationId} not found.`);
      }

      if (app.status === 'enrolled') {
        throw new Error(`Application #${app.applicationNumber} is already enrolled.`);
      }

      // 2. Check duplicate student (admissionNumber or birthRegistrationNumber)
      const generatedStudentCode = `STU-${app.applicationNumber}`;
      const generatedAdmissionNumber = `ADM-${app.applicationNumber}`;

      const existingDup = await tx.student.findFirst({
        where: {
          schoolId: app.schoolId,
          OR: [
            { admissionNumber: generatedAdmissionNumber },
            { studentCode: generatedStudentCode },
            ...(app.birthRegistrationNumber ? [{ birthRegistrationNumber: app.birthRegistrationNumber }] : []),
          ],
        },
      });

      if (existingDup) {
        throw new Error(`Duplicate student detected with admission/registration number.`);
      }

      // Resolve defaults only inside the application's school and class.
      let sectionId = options.sectionId;
      if (!sectionId) {
        const defaultSec = await tx.section.findFirst({
          where: { classId: app.classId },
        });
        sectionId = defaultSec?.id;
      }

      if (!sectionId) {
        throw new Error(`No section available for class assignment.`);
      }

      let academicYearId = options.academicYearId;
      if (!academicYearId) {
        const defaultAY = await tx.academicYear.findFirst({
          where: { schoolId: app.schoolId, isCurrent: true },
        });
        academicYearId = defaultAY?.id;
      }

      if (!academicYearId) {
        throw new Error(`No active academic year found.`);
      }

      const lastEnrollment = await tx.studentEnrollment.findFirst({
        where: { academicYearId, classId: app.classId, sectionId },
        orderBy: { rollNumber: 'desc' },
        select: { rollNumber: true },
      });
      const rollNumber = options.rollNumber || (lastEnrollment?.rollNumber || 0) + 1;

      // Check roll number collision
      const rollDup = await tx.studentEnrollment.findFirst({
        where: {
          academicYearId,
          classId: app.classId,
          sectionId,
          rollNumber,
          enrollmentStatus: 'ACTIVE',
        },
      });

      if (rollDup) {
        throw new Error(`Roll number #${rollNumber} is already assigned in this section.`);
      }

      // 6. Create student login user account if email/phone provided
      let studentUserId: string | null = null;
      const defaultPasswordHash = await bcrypt.hash('Student@123456', 10);

      if (app.email) {
        const studentUser = await tx.user.create({
          data: {
            schoolId: app.schoolId,
            name: app.studentNameEn,
            email: app.email,
            phone: app.phone,
            passwordHash: defaultPasswordHash,
            status: 'ACTIVE',
          },
        });
        studentUserId = studentUser.id;
      }

      // 3. Create student record
      const student = await tx.student.create({
        data: {
          schoolId: app.schoolId,
          userId: studentUserId,
          admissionNumber: generatedAdmissionNumber,
          studentCode: generatedStudentCode,
          nameEn: app.studentNameEn,
          nameBn: app.studentNameBn,
          gender: app.gender,
          dateOfBirth: app.dateOfBirth,
          bloodGroup: app.bloodGroup,
          birthRegistrationNumber: app.birthRegistrationNumber,
          phone: app.phone,
          email: app.email,
          presentAddress: app.presentAddress,
          permanentAddress: app.permanentAddress,
          previousSchool: app.previousSchool,
          admissionDate: new Date(),
          status: 'ACTIVE',
          classId: app.classId,
          sectionId,
          rollNumber,
          fatherName: app.guardians.find((g) => g.relationship === 'FATHER')?.name,
          motherName: app.guardians.find((g) => g.relationship === 'MOTHER')?.name,
          emergencyPhone: app.phone || app.guardians[0]?.phone,
        },
      });

      // 4. Create or connect guardian records & 5. Create student_guardian relationships
      for (const appGuardian of app.guardians) {
        let guardian = await tx.guardian.findFirst({
          where: {
            schoolId: app.schoolId,
            phone: appGuardian.phone,
          },
        });

        if (!guardian) {
          // 6. Create guardian user account if enabled
          let guardianUserId: string | null = null;
          if (appGuardian.email) {
            const guardianPassHash = await bcrypt.hash('Parent@123456', 10);
            const gUser = await tx.user.create({
              data: {
                schoolId: app.schoolId,
                name: appGuardian.name,
                email: appGuardian.email,
                phone: appGuardian.phone,
                passwordHash: guardianPassHash,
                status: 'ACTIVE',
              },
            });
            guardianUserId = gUser.id;
          }

          guardian = await tx.guardian.create({
            data: {
              schoolId: app.schoolId,
              userId: guardianUserId,
              name: appGuardian.name,
              relationship: appGuardian.relationship,
              phone: appGuardian.phone,
              alternatePhone: appGuardian.alternatePhone,
              email: appGuardian.email,
              occupation: appGuardian.occupation,
              nationalId: appGuardian.nationalId,
              address: appGuardian.address,
              portalAccessEnabled: Boolean(guardianUserId),
              status: 'ACTIVE',
            },
          });
        }

        // 5. Create student_guardian relationship
        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            guardianId: guardian.id,
            isPrimary: appGuardian.isPrimary,
            isFinancialContact: appGuardian.isFinancialContact,
            isEmergencyContact: appGuardian.isEmergencyContact,
            relationship: appGuardian.relationship,
            status: 'ACTIVE',
          },
        });
      }

      // 7. Create student enrollment
      const enrollment = await tx.studentEnrollment.create({
        data: {
          schoolId: app.schoolId,
          studentId: student.id,
          academicYearId,
          classId: app.classId,
          sectionId,
          groupId: app.groupId,
          rollNumber,
          enrollmentType: 'REGULAR',
          enrollmentStatus: 'ACTIVE',
          startDate: new Date(),
        },
      });

      // 8. Generate admission fee invoice foundation
      let feeStructure = await tx.feeStructure.findFirst({
        where: { schoolId: app.schoolId },
      });

      if (!feeStructure) {
        feeStructure = await tx.feeStructure.create({
          data: {
            schoolId: app.schoolId,
            name: 'Admission Fee 2026',
            amount: 5000.0,
            frequency: 'ONE_TIME',
            description: 'Standard Admission and Registration Fee',
          },
        });
      }

      const invoice = await tx.feeInvoice.create({
        data: {
          schoolId: app.schoolId,
          studentId: student.id,
          feeStructureId: feeStructure.id,
          invoiceNumber: 'INV-ADM-' + Math.floor(10000 + Math.random() * 90000),
          amount: feeStructure.amount,
          discount: 0.0,
          paidAmount: feeStructure.amount, // Paid during admission
          dueDate: new Date(),
          status: 'PAID',
        },
      });

      // 9. Update application status
      const updatedApp = await tx.admissionApplication.update({
        where: { id: applicationId },
        data: {
          status: 'enrolled',
          paymentStatus: 'PAID',
        },
      });

      // 10. Create audit logs
      await tx.auditLog.create({
        data: {
          schoolId: app.schoolId,
          userId: options.createdByUserId || null,
          action: 'APPROVE_ADMISSION',
          module: 'ONLINE_ADMISSION',
          recordId: applicationId,
          details: `Approved admission for ${app.studentNameEn} (${app.applicationNumber}). Generated Student Code: ${generatedStudentCode}, Roll: #${rollNumber}`,
        },
      });

      // 11. Create notification records
      if (studentUserId) {
        await tx.notification.create({
          data: {
            schoolId: app.schoolId,
            userId: studentUserId,
            title: 'Welcome to the School!',
            message: `Congratulations ${app.studentNameEn}! Your admission application (${app.applicationNumber}) has been approved. Student ID: ${generatedStudentCode}, Roll: #${rollNumber}.`,
            type: 'ADMISSION',
          },
        });
      }

      return {
        success: true,
        student,
        enrollment,
        invoice,
        application: updatedApp,
      };
    });
    return toClientData(result);
  } catch (error: any) {
    console.error('Prisma transaction failed for admission approval:', error?.message || error);
    throw error;
  }
}
