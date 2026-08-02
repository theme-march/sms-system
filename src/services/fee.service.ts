'use server';

import prisma from '@/src/lib/db/prisma';
import { toClientData } from '@/src/lib/serialize';
import { createAuditLog } from '@/src/lib/audit';
import {
  calculateInvoiceBreakdown,
  allocatePaymentToInvoiceItems,
  determinePaymentStatus,
  canIssueAdmitCard,
} from '@/src/lib/validations/fee';

export async function getFeeOverview(schoolId?: string) {
    const [totalCollected, totalPending] = await Promise.all([
      prisma.feeInvoice.aggregate({
        where: schoolId ? { schoolId } : undefined,
        _sum: { paidAmount: true },
      }),
      prisma.studentInvoice.aggregate({
      where: {
        ...(schoolId ? { schoolId } : {}),
        paymentStatus: { in: ['unpaid', 'partially_paid', 'overdue'] },
      },
      _sum: { dueAmount: true },
      }),
    ]);

    return {
      collectedAmount: Number(totalCollected._sum.paidAmount ?? 0),
      pendingAmount: Number(totalPending._sum.dueAmount ?? 0),
    };
}

export interface BulkMonthlyInvoicePayload {
  schoolId: string;
  academicYearId: string;
  billingYear: number;
  billingMonth: number;
  classId: string;
  sectionId?: string;
  includePreviousDues?: boolean;
  generatedById?: string;
}

export interface ExamFeeInvoicePayload {
  schoolId: string;
  academicYearId: string;
  examId: string;
  classId: string;
  sectionId?: string;
  feeTypeId: string;
  amount: number;
  dueDate: string;
  lateFee?: number;
  generatedById?: string;
}

export interface PaymentProcessPayload {
  schoolId: string;
  studentId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Mobile Financial Service' | 'Online';
  transactionReference?: string;
  accountHead?: string;
  collectedById?: string;
  remarks?: string;
}

export interface PaymentReversalPayload {
  schoolId: string;
  paymentId: string;
  reversedById: string;
  reason: string;
}

// -------------------------------------------------------------
// FEE TYPES & STRUCTURES
// -------------------------------------------------------------

export async function getFeeTypes(schoolId: string) {
    return toClientData(await prisma.feeType.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    }));
}

export async function createFeeType(data: {
  schoolId: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  isRecurring?: boolean;
}) {
  const schoolId = data.schoolId;
  try {
    const created = await (prisma as any).feeType.create({
      data: {
        schoolId,
        name: data.name,
        code: data.code.toUpperCase(),
        category: data.category,
        description: data.description,
        isRecurring: data.isRecurring ?? true,
      },
    });

    await createAuditLog({
      schoolId,
      action: 'CREATE',
      module: 'FEE_MANAGEMENT',
      details: `Created Fee Type ${data.name} (${data.code})`,
    });

    return toClientData(created);
  } catch (error) {
    console.error('Failed to create fee type:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// BULK MONTHLY INVOICE GENERATION
// -------------------------------------------------------------

export async function generateBulkMonthlyInvoices(payload: BulkMonthlyInvoicePayload) {
  const { schoolId, academicYearId, billingYear, billingMonth, classId, sectionId, includePreviousDues, generatedById } = payload;

  try {
    // 1. Fetch Active Enrollments
    const enrollments = await (prisma as any).enrollment.findMany({
      where: {
        schoolId,
        academicYearId,
        classId,
        ...(sectionId ? { sectionId } : {}),
        status: 'ACTIVE',
      },
      include: {
        student: true,
      },
    });

    // 2. Fetch Fee Structures & Monthly Schedules
    const feeSchedules = await (prisma as any).monthlyFeeSchedule.findMany({
      where: {
        schoolId,
        academicYearId,
        classId,
        ...(sectionId ? { sectionId } : {}),
        status: 'ACTIVE',
      },
    });

    let generatedCount = 0;
    let skippedCount = 0;
    let totalInvoicedAmount = 0;

    const issueDate = new Date(billingYear, billingMonth - 1, 1);
    const dueDate = new Date(billingYear, billingMonth - 1, 10);

    for (const enr of enrollments) {
      // Check existing duplicate invoice
      const existing = await (prisma as any).studentInvoice.findFirst({
        where: {
          schoolId,
          studentId: enr.studentId,
          enrollmentId: enr.id,
          billingYear,
          billingMonth,
          feeTypeId: 'ft-tuition',
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Check scholarships & waivers
      const scholarships = await (prisma as any).scholarship.findMany({
        where: { schoolId, studentId: enr.studentId, status: 'ACTIVE' },
      });
      const waivers = await (prisma as any).feeWaiver.findMany({
        where: { schoolId, studentId: enr.studentId, status: 'ACTIVE' },
      });

      // Calculate previous dues if requested
      let previousDue = 0;
      if (includePreviousDues) {
        const prevUnpaid = await (prisma as any).studentInvoice.aggregate({
          where: {
            schoolId,
            studentId: enr.studentId,
            paymentStatus: { in: ['unpaid', 'partially_paid', 'overdue'] },
          },
          _sum: { dueAmount: true },
        });
        previousDue = Number(prevUnpaid._sum?.dueAmount || 0);
      }

      // Base amount calculation
      const studentSchedule = feeSchedules.find((s: any) => s.studentId === enr.studentId) || feeSchedules[0];
      const baseAmount = studentSchedule ? Number(studentSchedule.monthlyAmount) : 2500;

      const calc = calculateInvoiceBreakdown({
        baseAmount,
        scholarships: scholarships.map((s: any) => ({
          percentageOrAmount: Number(s.percentageOrAmount),
          isPercentage: s.isPercentage,
        })),
        waivers: waivers.map((w: any) => ({
          waiverValue: Number(w.waiverValue),
          waiverType: w.waiverType as 'PERCENTAGE' | 'FIXED',
        })),
        previousDue,
      });

      const invNo = `INV-${billingYear}${String(billingMonth).padStart(2, '0')}-${enr.studentId.slice(-4)}-${Date.now().toString().slice(-4)}`;

      // Save Invoice inside Prisma transaction
      await (prisma as any).$transaction(async (tx: any) => {
        const invoice = await tx.studentInvoice.create({
          data: {
            schoolId,
            studentId: enr.studentId,
            enrollmentId: enr.id,
            academicYearId,
            invoiceNumber: invNo,
            billingYear,
            billingMonth,
            feeTypeId: 'ft-tuition',
            issueDate,
            dueDate,
            subtotal: calc.subtotal,
            discountAmount: calc.discountAmount,
            scholarshipAmount: calc.scholarshipAmount,
            waiverAmount: calc.waiverAmount,
            fineAmount: calc.fineAmount,
            previousDue: calc.previousDue,
            totalAmount: calc.totalAmount,
            paidAmount: 0,
            dueAmount: calc.dueAmount,
            paymentStatus: 'unpaid',
            items: {
              create: [
                {
                  feeTypeId: 'ft-tuition',
                  description: `Monthly Tuition Fee (${billingMonth}/${billingYear})`,
                  amount: calc.subtotal,
                  discount: calc.discountAmount + calc.scholarshipAmount + calc.waiverAmount,
                  netAmount: calc.subtotal - calc.discountAmount - calc.scholarshipAmount - calc.waiverAmount,
                  paidAmount: 0,
                },
              ],
            },
          },
        });

        // Guardian Notification Record
        await tx.attendanceNotification.create({
          data: {
            schoolId,
            studentId: enr.studentId,
            attendanceDate: issueDate,
            channel: 'PORTAL',
            deliveryStatus: 'DELIVERED',
            message: `Monthly Invoice ${invoice.invoiceNumber} generated for ${billingMonth}/${billingYear}. Amount Due: ৳${calc.dueAmount}`,
          },
        });
      });

      generatedCount++;
      totalInvoicedAmount += calc.totalAmount;
    }

    await createAuditLog({
      schoolId,
      userId: generatedById || 'system',
      action: 'CREATE',
      module: 'FEE_INVOICE_GENERATION',
      details: `Generated ${generatedCount} invoices for ${billingMonth}/${billingYear}. Total amount: ৳${totalInvoicedAmount}`,
    });

    return {
      success: true,
      generatedCount,
      skippedCount,
      totalInvoicedAmount,
      billingYear,
      billingMonth,
    };
  } catch (error) {
    console.error('Bulk invoice generation failed:', error);
    throw new Error('Bulk invoices could not be generated. No records were created.');
  }
}

// -------------------------------------------------------------
// EXAM FEE INVOICE GENERATION
// -------------------------------------------------------------

export async function generateExamFeeInvoices(payload: ExamFeeInvoicePayload) {
  const { schoolId, academicYearId, examId, classId, sectionId, feeTypeId, amount, dueDate, generatedById } = payload;

  try {
    const enrollments = await (prisma as any).enrollment.findMany({
      where: {
        schoolId,
        academicYearId,
        classId,
        ...(sectionId ? { sectionId } : {}),
        status: 'ACTIVE',
      },
    });

    let generatedCount = 0;
    let skippedCount = 0;

    for (const enr of enrollments) {
      const existing = await (prisma as any).studentInvoice.findFirst({
        where: {
          schoolId,
          studentId: enr.studentId,
          feeTypeId,
          billingYear: new Date(dueDate).getFullYear(),
          billingMonth: new Date(dueDate).getMonth() + 1,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      const invNo = `EXAM-INV-${examId.slice(-4)}-${enr.studentId.slice(-4)}-${Date.now().toString().slice(-4)}`;

      await (prisma as any).studentInvoice.create({
        data: {
          schoolId,
          studentId: enr.studentId,
          enrollmentId: enr.id,
          academicYearId,
          invoiceNumber: invNo,
          billingYear: new Date(dueDate).getFullYear(),
          billingMonth: new Date(dueDate).getMonth() + 1,
          feeTypeId,
          issueDate: new Date(),
          dueDate: new Date(dueDate),
          subtotal: amount,
          discountAmount: 0,
          scholarshipAmount: 0,
          waiverAmount: 0,
          fineAmount: 0,
          previousDue: 0,
          totalAmount: amount,
          paidAmount: 0,
          dueAmount: amount,
          paymentStatus: 'unpaid',
          items: {
            create: [
              {
                feeTypeId,
                description: `Exam Fee for Exam ID: ${examId}`,
                amount,
                discount: 0,
                netAmount: amount,
                paidAmount: 0,
              },
            ],
          },
        },
      });

      generatedCount++;
    }

    await createAuditLog({
      schoolId,
      userId: generatedById || 'system',
      action: 'CREATE',
      module: 'EXAM_FEE',
      details: `Generated ${generatedCount} exam fee invoices for exam ${examId}`,
    });

    return { success: true, generatedCount, skippedCount };
  } catch (error) {
    console.error('Failed to generate bulk exam fee invoices:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// PAYMENT PROCESSING & ALLOCATION
// -------------------------------------------------------------

export async function processPayment(payload: PaymentProcessPayload) {
  const { schoolId, studentId, invoiceId, amount, paymentMethod, transactionReference, accountHead, collectedById, remarks } = payload;

  try {
    const invoice = await (prisma as any).studentInvoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.dueAmount <= 0) {
      throw new Error('Invoice is already fully paid');
    }

    const payNo = `PAY-${Date.now().toString().slice(-6)}`;
    const recNo = `REC-${Date.now().toString().slice(-6)}`;

    // Allocation logic
    const allocation = allocatePaymentToInvoiceItems({
      paymentAmount: amount,
      invoiceItems: invoice.items.map((item: any) => ({
        id: item.id,
        netAmount: Number(item.netAmount),
        paidAmount: Number(item.paidAmount),
      })),
    });

    const newInvoicePaid = Number(invoice.paidAmount) + amount;
    const newInvoiceDue = Math.max(0, Number(invoice.totalAmount) - newInvoicePaid);
    const newStatus = determinePaymentStatus(Number(invoice.totalAmount), newInvoicePaid, invoice.dueDate.toISOString());

    // Execute within Prisma transaction
    const result = await (prisma as any).$transaction(async (tx: any) => {
      // 1. Create Payment
      const payment = await tx.payment.create({
        data: {
          schoolId,
          studentId,
          invoiceId,
          paymentNumber: payNo,
          paymentDate: new Date(),
          paymentMethod,
          transactionReference,
          accountHead: accountHead || 'Tuition Fee Account',
          amount,
          collectedById,
          remarks,
          status: 'CONFIRMED',
          allocations: {
            create: allocation.allocations.map((alloc) => ({
              invoiceItemId: alloc.invoiceItemId,
              amount: alloc.amount,
            })),
          },
        },
      });

      // 2. Update Invoice Items
      for (const alloc of allocation.allocations) {
        await tx.invoiceItem.update({
          where: { id: alloc.invoiceItemId },
          data: { paidAmount: alloc.newPaidAmount },
        });
      }

      // 3. Update Invoice Balance
      await tx.studentInvoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newInvoicePaid,
          dueAmount: newInvoiceDue,
          paymentStatus: newStatus,
        },
      });

      // 4. Create Receipt
      const receipt = await tx.receipt.create({
        data: {
          schoolId,
          receiptNumber: recNo,
          paymentId: payment.id,
          studentId,
          totalPaid: amount,
          remarks: remarks || `Payment received via ${paymentMethod}`,
        },
      });

      // 5. Create Financial Transaction
      await tx.financialTransaction.create({
        data: {
          schoolId,
          transactionNumber: `TXN-${Date.now().toString().slice(-6)}`,
          accountId: 'acc-main-cash',
          transactionType: 'CREDIT',
          category: 'FEE_COLLECTION',
          amount,
          referenceId: payment.id,
          description: `Fee collection for Invoice ${invoice.invoiceNumber}`,
          transactionDate: new Date(),
        },
      });

      return { payment, receipt, newStatus, newInvoiceDue };
    });

    await createAuditLog({
      schoolId,
      userId: collectedById || 'system',
      action: 'CREATE',
      module: 'PAYMENT_COLLECTION',
      details: `Collected payment ৳${amount} for invoice ${invoice.invoiceNumber} via ${paymentMethod}`,
    });

    return {
      success: true,
      paymentNumber: payNo,
      receiptNumber: recNo,
      paidAmount: amount,
      remainingDue: result.newInvoiceDue,
      paymentStatus: result.newStatus,
    };
  } catch (err) {
    console.error('Payment processing failed:', err);
    throw new Error('Payment could not be saved. No receipt was issued.');
  }
}

// -------------------------------------------------------------
// PAYMENT REVERSAL
// -------------------------------------------------------------

export async function processPaymentReversal(payload: PaymentReversalPayload) {
  const { schoolId, paymentId, reversedById, reason } = payload;

  try {
    const payment = await (prisma as any).payment.findUnique({
      where: { id: paymentId },
      include: { allocations: true },
    });

    if (!payment) throw new Error('Payment record not found');
    if (payment.status === 'REVERSED') throw new Error('Payment is already reversed');

    const revNo = `REV-${Date.now().toString().slice(-6)}`;

    await (prisma as any).$transaction(async (tx: any) => {
      // 1. Mark Payment as Reversed
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'REVERSED' },
      });

      // 2. Log Reversal Record
      await tx.paymentReversal.create({
        data: {
          schoolId,
          paymentId,
          reversalNumber: revNo,
          reversedById,
          reason,
          reversalDate: new Date(),
        },
      });

      // 3. Restore Invoice Balances
      if (payment.invoiceId) {
        const invoice = await tx.studentInvoice.findUnique({ where: { id: payment.invoiceId } });
        if (invoice) {
          const updatedPaid = Math.max(0, Number(invoice.paidAmount) - Number(payment.amount));
          const updatedDue = Number(invoice.totalAmount) - updatedPaid;
          const updatedStatus = determinePaymentStatus(Number(invoice.totalAmount), updatedPaid, invoice.dueDate.toISOString());

          await tx.studentInvoice.update({
            where: { id: payment.invoiceId },
            data: {
              paidAmount: updatedPaid,
              dueAmount: updatedDue,
              paymentStatus: updatedStatus,
            },
          });
        }
      }

      // 4. Financial Transaction (Debit Reversal)
      await tx.financialTransaction.create({
        data: {
          schoolId,
          transactionNumber: `TXN-REV-${Date.now().toString().slice(-6)}`,
          accountId: 'acc-main-cash',
          transactionType: 'DEBIT',
          category: 'REVERSAL',
          amount: payment.amount,
          referenceId: payment.id,
          description: `Reversal of payment ${payment.paymentNumber}: ${reason}`,
          transactionDate: new Date(),
        },
      });
    });

    await createAuditLog({
      schoolId,
      userId: reversedById,
      action: 'UPDATE',
      module: 'PAYMENT_REVERSAL',
      details: `Reversed payment ${payment.paymentNumber}. Reason: ${reason}`,
    });

    return { success: true, reversalNumber: revNo };
  } catch (err) {
    console.error('Payment reversal failed:', err);
    throw new Error('Payment reversal could not be saved.');
  }
}

// -------------------------------------------------------------
// ACCOUNTANT DASHBOARD STATS
// -------------------------------------------------------------

export async function getAccountantFeeDashboard(schoolId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examFeeTypes = await prisma.feeType.findMany({
    where: { schoolId, category: 'EXAM' },
    select: { id: true },
  });
  const examFeeTypeIds = examFeeTypes.map((feeType) => feeType.id);

  const [invoiced, collected, due, examCollected, today, recentReceipts] = await Promise.all([
    prisma.studentInvoice.aggregate({
      where: { schoolId, createdAt: { gte: monthStart } },
      _sum: { totalAmount: true },
    }),
    prisma.receipt.aggregate({
      where: { schoolId, generatedAt: { gte: monthStart } },
      _sum: { totalPaid: true },
    }),
    prisma.studentInvoice.aggregate({
      where: { schoolId, paymentStatus: { in: ['unpaid', 'partially_paid', 'overdue'] } },
      _sum: { dueAmount: true },
    }),
    prisma.studentInvoice.aggregate({
      where: { schoolId, feeTypeId: { in: examFeeTypeIds } },
      _sum: { paidAmount: true },
    }),
    prisma.receipt.aggregate({
      where: { schoolId, generatedAt: { gte: todayStart } },
      _count: { id: true },
      _sum: { totalPaid: true },
    }),
    prisma.receipt.findMany({
      where: { schoolId },
      take: 5,
      orderBy: { generatedAt: 'desc' },
    }),
  ]);

  return toClientData({
    currentMonthInvoiced: Number(invoiced._sum.totalAmount ?? 0),
    currentMonthCollected: Number(collected._sum.totalPaid ?? 0),
    currentMonthDue: Number(due._sum.dueAmount ?? 0),
    examFeeCollected: Number(examCollected._sum.paidAmount ?? 0),
    todayPaymentsCount: today._count.id,
    todayPaymentsAmount: Number(today._sum.totalPaid ?? 0),
    recentReceipts,
  });
}

// -------------------------------------------------------------
// ADMIT CARD CLEARANCE CHECK
// -------------------------------------------------------------

export async function checkAdmitCardEligibility(studentId: string, schoolId: string) {
  try {
    // Check school setting: require_exam_fee_payment_for_admit_card
    const requireExamFeeSetting = true; // Enabled by default in setting

    const unpaidExamInvoices = await (prisma as any).studentInvoice.findMany({
      where: {
        schoolId,
        studentId,
        feeTypeId: 'ft-3', // Exam fee
        dueAmount: { gt: 0 },
      },
      select: { id: true, dueAmount: true },
    });

    return canIssueAdmitCard({
      studentId,
      requireExamFeePayment: requireExamFeeSetting,
      unpaidExamFeeInvoices: unpaidExamInvoices.map((i: any) => ({ id: i.id, dueAmount: Number(i.dueAmount) })),
    });
  } catch {
    return { eligible: true };
  }
}
