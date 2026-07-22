"use server";
import prisma from '@/src/lib/db/prisma';

export async function createAuditLog(data: {
  schoolId?: string;
  userId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_STATUS';
  module: string;
  recordId?: string;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        schoolId: data.schoolId || 'school-1',
        userId: data.userId || 'system-admin',
        action: data.action,
        module: data.module,
        recordId: data.recordId,
        details: data.details,
      },
    });
  } catch {
    // Graceful fallback when DB connection is unavailable
  }
}
