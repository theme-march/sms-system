import { prisma } from '../lib/prisma';

export class LeaveService {
  static async getLeaveTypes(schoolId: string) {
    return prisma.leaveType.findMany({
      where: { schoolId, isActive: true },
    });
  }

  static async applyForLeave(data: {
    schoolId: string;
    userId: string;
    leaveTypeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
  }) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    return prisma.leaveApplication.create({
      data: {
        schoolId: data.schoolId,
        userId: data.userId,
        leaveTypeId: data.leaveTypeId,
        startDate: start,
        endDate: end,
        totalDays,
        reason: data.reason,
        status: 'PENDING',
      },
    });
  }

  static async reviewLeave(applicationId: string, status: 'APPROVED' | 'REJECTED', approvedById: string, remarks?: string) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.leaveApplication.update({
        where: { id: applicationId },
        data: { status },
      });

      await tx.leaveApproval.create({
        data: {
          leaveApplicationId: applicationId,
          approvedById,
          status,
          remarks,
        },
      });

      return application;
    });
  }
}
