export interface FeeCalculationInput {
  baseAmount: number;
  scholarships?: Array<{ percentageOrAmount: number; isPercentage: boolean }>;
  waivers?: Array<{ waiverValue: number; waiverType: 'PERCENTAGE' | 'FIXED' }>;
  previousDue?: number;
  fineAmount?: number;
  discountAmount?: number;
}

export interface FeeCalculationResult {
  subtotal: number;
  discountAmount: number;
  scholarshipAmount: number;
  waiverAmount: number;
  fineAmount: number;
  previousDue: number;
  totalAmount: number;
  dueAmount: number;
}

/**
 * Calculates student invoice amounts with high precision.
 */
export function calculateInvoiceBreakdown(input: FeeCalculationInput): FeeCalculationResult {
  const subtotal = Math.max(0, input.baseAmount || 0);
  const discountAmount = Math.max(0, input.discountAmount || 0);

  // Calculate scholarship
  let scholarshipAmount = 0;
  if (input.scholarships && input.scholarships.length > 0) {
    for (const sch of input.scholarships) {
      if (sch.isPercentage) {
        scholarshipAmount += (subtotal * sch.percentageOrAmount) / 100;
      } else {
        scholarshipAmount += sch.percentageOrAmount;
      }
    }
  }
  scholarshipAmount = Math.min(subtotal - discountAmount, Math.max(0, scholarshipAmount));

  // Calculate waiver
  let waiverAmount = 0;
  if (input.waivers && input.waivers.length > 0) {
    const netBeforeWaiver = Math.max(0, subtotal - discountAmount - scholarshipAmount);
    for (const wav of input.waivers) {
      if (wav.waiverType === 'PERCENTAGE') {
        waiverAmount += (netBeforeWaiver * wav.waiverValue) / 100;
      } else {
        waiverAmount += wav.waiverValue;
      }
    }
    waiverAmount = Math.min(netBeforeWaiver, Math.max(0, waiverAmount));
  }

  const fineAmount = Math.max(0, input.fineAmount || 0);
  const previousDue = Math.max(0, input.previousDue || 0);

  const totalAmount = Math.max(
    0,
    subtotal - discountAmount - scholarshipAmount - waiverAmount + fineAmount + previousDue
  );

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    scholarshipAmount: Number(scholarshipAmount.toFixed(2)),
    waiverAmount: Number(waiverAmount.toFixed(2)),
    fineAmount: Number(fineAmount.toFixed(2)),
    previousDue: Number(previousDue.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    dueAmount: Number(totalAmount.toFixed(2)),
  };
}

export interface PaymentAllocationInput {
  paymentAmount: number;
  invoiceItems: Array<{
    id: string;
    netAmount: number;
    paidAmount: number;
  }>;
}

export interface AllocationResult {
  allocatedTotal: number;
  advanceAmount: number;
  allocations: Array<{
    invoiceItemId: string;
    amount: number;
    newPaidAmount: number;
    isFullyPaid: boolean;
  }>;
}

/**
 * Allocates a payment amount sequentially across invoice items.
 */
export function allocatePaymentToInvoiceItems(input: PaymentAllocationInput): AllocationResult {
  let remainingPayment = Math.max(0, input.paymentAmount);
  let allocatedTotal = 0;

  const allocations: Array<{
    invoiceItemId: string;
    amount: number;
    newPaidAmount: number;
    isFullyPaid: boolean;
  }> = [];

  for (const item of input.invoiceItems) {
    const itemDue = Math.max(0, item.netAmount - item.paidAmount);
    if (itemDue <= 0) {
      allocations.push({
        invoiceItemId: item.id,
        amount: 0,
        newPaidAmount: item.paidAmount,
        isFullyPaid: true,
      });
      continue;
    }

    const allocForThisItem = Math.min(remainingPayment, itemDue);
    const newPaidAmount = item.paidAmount + allocForThisItem;
    remainingPayment -= allocForThisItem;
    allocatedTotal += allocForThisItem;

    allocations.push({
      invoiceItemId: item.id,
      amount: Number(allocForThisItem.toFixed(2)),
      newPaidAmount: Number(newPaidAmount.toFixed(2)),
      isFullyPaid: newPaidAmount >= item.netAmount,
    });
  }

  const advanceAmount = Number(Math.max(0, remainingPayment).toFixed(2));

  return {
    allocatedTotal: Number(allocatedTotal.toFixed(2)),
    advanceAmount,
    allocations,
  };
}

export function determinePaymentStatus(totalAmount: number, paidAmount: number, dueDateStr?: string): 'unpaid' | 'partially_paid' | 'paid' | 'overdue' {
  if (paidAmount >= totalAmount && totalAmount > 0) {
    return 'paid';
  }
  if (paidAmount > 0 && paidAmount < totalAmount) {
    return 'partially_paid';
  }
  if (dueDateStr) {
    const due = new Date(dueDateStr).getTime();
    if (due < Date.now()) {
      return 'overdue';
    }
  }
  return 'unpaid';
}

export interface CheckAdmitCardEligibilityInput {
  studentId: string;
  requireExamFeePayment: boolean;
  unpaidExamFeeInvoices: Array<{ id: string; dueAmount: number }>;
}

export function canIssueAdmitCard(input: CheckAdmitCardEligibilityInput): { eligible: boolean; reason?: string } {
  if (!input.requireExamFeePayment) {
    return { eligible: true };
  }

  const hasUnpaidExamFee = input.unpaidExamFeeInvoices.some((inv) => inv.dueAmount > 0);
  if (hasUnpaidExamFee) {
    return {
      eligible: false,
      reason: 'Admit card generation blocked: Student has outstanding exam fee dues.',
    };
  }

  return { eligible: true };
}
