"use server";
import prisma from '@/src/lib/db/prisma';

export async function createAuditLog(data: {
  schoolId?: string;
  userId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_STATUS' | 'IMPORT_PREVIEW' | 'IMPORT' | 'EXPORT' | 'LOGIN';
  module: string;
  recordId?: string;
  details?: string;
}) {
  await prisma.auditLog.create({
    data: {
      schoolId: data.schoolId,
      userId: data.userId,
      action: data.action,
      module: data.module,
      recordId: data.recordId,
      details: data.details,
    },
  });
}
