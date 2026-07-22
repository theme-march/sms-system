import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInvoiceBreakdown,
  allocatePaymentToInvoiceItems,
  determinePaymentStatus,
  canIssueAdmitCard,
} from '../src/lib/validations/fee.js';

test('Fee Calculation - subtotal, scholarship, waiver, fine, and previous dues', () => {
  const result = calculateInvoiceBreakdown({
    baseAmount: 5000,
    scholarships: [{ percentageOrAmount: 10, isPercentage: true }], // 10% = 500
    waivers: [{ waiverValue: 200, waiverType: 'FIXED' }], // 200 fixed
    discountAmount: 100,
    fineAmount: 50,
    previousDue: 1000,
  });

  // Base: 5000
  // Discount: 100
  // Scholarship: 10% of 5000 = 500
  // Net before waiver: 5000 - 100 - 500 = 4400
  // Waiver: 200
  // Fine: 50
  // Previous due: 1000
  // Total: 4400 - 200 + 50 + 1000 = 5250
  assert.equal(result.subtotal, 5000);
  assert.equal(result.discountAmount, 100);
  assert.equal(result.scholarshipAmount, 500);
  assert.equal(result.waiverAmount, 200);
  assert.equal(result.fineAmount, 50);
  assert.equal(result.previousDue, 1000);
  assert.equal(result.totalAmount, 5250);
});

test('Payment Allocation - Sequential item payment allocation and advance detection', () => {
  const allocation = allocatePaymentToInvoiceItems({
    paymentAmount: 4500,
    invoiceItems: [
      { id: 'item-1', netAmount: 2000, paidAmount: 0 },
      { id: 'item-2', netAmount: 1500, paidAmount: 500 }, // 1000 due
      { id: 'item-3', netAmount: 1000, paidAmount: 0 }, // 1000 due
    ],
  });

  // item-1 receives 2000 (fully paid)
  // item-2 receives 1000 (fully paid, 1500 total)
  // item-3 receives 1000 (fully paid)
  // Total allocated: 4000
  // Advance amount: 500
  assert.equal(allocation.allocatedTotal, 4000);
  assert.equal(allocation.advanceAmount, 500);
  assert.equal(allocation.allocations[0].amount, 2000);
  assert.equal(allocation.allocations[0].isFullyPaid, true);
  assert.equal(allocation.allocations[1].amount, 1000);
  assert.equal(allocation.allocations[1].isFullyPaid, true);
  assert.equal(allocation.allocations[2].amount, 1000);
  assert.equal(allocation.allocations[2].isFullyPaid, true);
});

test('Payment Status Determination - Paid, Partial, Unpaid, Overdue', () => {
  assert.equal(determinePaymentStatus(5000, 5000), 'paid');
  assert.equal(determinePaymentStatus(5000, 2000), 'partially_paid');
  assert.equal(determinePaymentStatus(5000, 0, '2020-01-01'), 'overdue');
  assert.equal(determinePaymentStatus(5000, 0, '2099-01-01'), 'unpaid');
});

test('Admit Card Issuance - Blocked when require_exam_fee_payment_for_admit_card is true and unpaid fee exists', () => {
  const blocked = canIssueAdmitCard({
    studentId: 'std-101',
    requireExamFeePayment: true,
    unpaidExamFeeInvoices: [{ id: 'inv-exam-1', dueAmount: 500 }],
  });
  assert.equal(blocked.eligible, false);
  assert.match(blocked.reason || '', /outstanding exam fee/i);

  const allowed = canIssueAdmitCard({
    studentId: 'std-101',
    requireExamFeePayment: true,
    unpaidExamFeeInvoices: [],
  });
  assert.equal(allowed.eligible, true);

  const disabledSetting = canIssueAdmitCard({
    studentId: 'std-101',
    requireExamFeePayment: false,
    unpaidExamFeeInvoices: [{ id: 'inv-exam-1', dueAmount: 500 }],
  });
  assert.equal(disabledSetting.eligible, true);
});

test('Duplicate Monthly Invoice Key Validation', () => {
  const existingInvoices = [
    { schoolId: 'sch-1', studentId: 'st-1', enrollmentId: 'enr-1', feeTypeId: 'ft-tuition', billingYear: 2026, billingMonth: 7 },
  ];

  const checkDuplicate = (target: { schoolId: string; studentId: string; enrollmentId: string; feeTypeId: string; billingYear: number; billingMonth: number }) => {
    return existingInvoices.some(
      (inv) =>
        inv.schoolId === target.schoolId &&
        inv.studentId === target.studentId &&
        inv.enrollmentId === target.enrollmentId &&
        inv.feeTypeId === target.feeTypeId &&
        inv.billingYear === target.billingYear &&
        inv.billingMonth === target.billingMonth
    );
  };

  assert.equal(
    checkDuplicate({ schoolId: 'sch-1', studentId: 'st-1', enrollmentId: 'enr-1', feeTypeId: 'ft-tuition', billingYear: 2026, billingMonth: 7 }),
    true
  );

  assert.equal(
    checkDuplicate({ schoolId: 'sch-1', studentId: 'st-1', enrollmentId: 'enr-1', feeTypeId: 'ft-tuition', billingYear: 2026, billingMonth: 8 }),
    false
  );
});
