import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class PayrollService {
  static async getPayrollPeriods(schoolId: string) {
    return prisma.payrollPeriod.findMany({
      where: { schoolId },
      orderBy: [{ payrollYear: 'desc' }, { payrollMonth: 'desc' }],
    });
  }

  static async generatePayroll(
    schoolId: string,
    payrollYear: number,
    payrollMonth: number,
    startDate: Date,
    endDate: Date,
    workingDays: number
  ) {
    return await prisma.$transaction(async (tx) => {
      let period = await tx.payrollPeriod.findUnique({
        where: {
          schoolId_payrollYear_payrollMonth: { schoolId, payrollYear, payrollMonth },
        },
      });

      if (!period) {
        period = await tx.payrollPeriod.create({
          data: {
            schoolId,
            payrollYear,
            payrollMonth,
            startDate,
            endDate,
            workingDays,
            status: 'CALCULATED',
          },
        });
      } else {
        if (period.status === 'APPROVED' || period.status === 'PAID') {
          throw new Error('Payroll is already approved or paid for this period.');
        }
        period = await tx.payrollPeriod.update({
          where: { id: period.id },
          data: { status: 'CALCULATED', workingDays, startDate, endDate },
        });
      }

      const assignments = await tx.employeeSalaryAssignment.findMany({
        where: { schoolId, isActive: true },
      });

      for (const assignment of assignments) {
        const components = await tx.salaryComponent.findMany({
          where: { salaryStructureId: assignment.salaryStructureId, isActive: true },
        });

        let basicSalary = new Prisma.Decimal(0);
        let totalAllowances = new Prisma.Decimal(0);
        let totalDeductions = new Prisma.Decimal(0);
        let tax = new Prisma.Decimal(0);

        const items: any[] = [];

        for (const comp of components) {
          if (comp.componentType === 'Basic Salary') {
            const amt = new Prisma.Decimal(comp.amount);
            basicSalary = basicSalary.add(amt);
            items.push({ componentName: comp.name, componentType: comp.type, amount: amt });
          }
        }

        for (const comp of components) {
          if (comp.componentType === 'Basic Salary') continue;

          let amt = new Prisma.Decimal(comp.amount);
          if (comp.amountType === 'PERCENTAGE') {
            amt = basicSalary.mul(amt).div(100);
          }

          if (comp.type === 'EARNING') {
            totalAllowances = totalAllowances.add(amt);
          } else if (comp.componentType === 'Tax') {
            tax = tax.add(amt);
          } else if (comp.type === 'DEDUCTION') {
            totalDeductions = totalDeductions.add(amt);
          }

          items.push({
            componentName: comp.name,
            componentType: comp.type,
            amount: amt,
          });
        }

        const overtime = new Prisma.Decimal(0);
        const bonus = new Prisma.Decimal(0);
        const loanDeduction = new Prisma.Decimal(0);
        
        const leaves = await tx.leaveApplication.findMany({
          where: {
            schoolId,
            userId: assignment.userId,
            status: 'APPROVED',
            startDate: { gte: startDate },
            endDate: { lte: endDate },
          },
        });

        let unpaidLeaveDays = 0;
        for (const leave of leaves) {
          const type = await tx.leaveType.findUnique({ where: { id: leave.leaveTypeId } });
          if (type && !type.isPaid) {
            unpaidLeaveDays += leave.totalDays;
          }
        }

        const dailyRate = workingDays > 0 ? basicSalary.div(workingDays) : new Prisma.Decimal(0);
        const absenceDeduction = dailyRate.mul(unpaidLeaveDays);

        const grossSalary = basicSalary.add(totalAllowances).add(overtime).add(bonus);
        const netSalary = grossSalary.sub(totalDeductions).sub(tax).sub(loanDeduction).sub(absenceDeduction);

        const existingPayroll = await tx.payroll.findUnique({
          where: {
            payrollPeriodId_userId: { payrollPeriodId: period.id, userId: assignment.userId },
          },
        });

        let payrollId;
        if (existingPayroll) {
          await tx.payrollItem.deleteMany({ where: { payrollId: existingPayroll.id } });
          const updated = await tx.payroll.update({
            where: { id: existingPayroll.id },
            data: {
              basicSalary, totalAllowances, totalDeductions, overtime, bonus, tax,
              loanDeduction, absenceDeduction, grossSalary, netSalary, status: 'DRAFT'
            },
          });
          payrollId = updated.id;
        } else {
          const created = await tx.payroll.create({
            data: {
              payrollPeriodId: period.id,
              schoolId,
              userId: assignment.userId,
              basicSalary, totalAllowances, totalDeductions, overtime, bonus, tax,
              loanDeduction, absenceDeduction, grossSalary, netSalary, status: 'DRAFT'
            },
          });
          payrollId = created.id;
        }

        if (items.length > 0) {
          await tx.payrollItem.createMany({
            data: items.map(i => ({ ...i, payrollId })),
          });
        }
      }

      return period;
    });
  }

  static async approvePayroll(schoolId: string, periodId: string) {
    return await prisma.$transaction(async (tx) => {
      const period = await tx.payrollPeriod.findUnique({ where: { id: periodId } });
      if (!period) throw new Error('Period not found');
      if (period.status === 'APPROVED' || period.status === 'PAID') {
         throw new Error('Period already approved or paid');
      }

      await tx.payroll.updateMany({
        where: { payrollPeriodId: periodId },
        data: { status: 'APPROVED' },
      });

      return tx.payrollPeriod.update({
        where: { id: periodId },
        data: { status: 'APPROVED' },
      });
    });
  }

  static async recordPayment(schoolId: string, payrollId: string, amount: Prisma.Decimal, method: string, ref?: string) {
    return await prisma.$transaction(async (tx) => {
      const payroll = await tx.payroll.findUnique({ where: { id: payrollId } });
      if (!payroll) throw new Error('Payroll not found');
      
      const newPaidAmount = payroll.paidAmount.add(amount);
      const isFullyPaid = newPaidAmount.gte(payroll.netSalary);

      await tx.salaryPayment.create({
        data: {
          payrollId,
          amount,
          paymentMethod: method,
          transactionRef: ref,
          processedById: 'system',
        }
      });

      const updatedPayroll = await tx.payroll.update({
        where: { id: payrollId },
        data: {
          paidAmount: newPaidAmount,
          status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
        }
      });

      if (isFullyPaid) {
        await tx.payslip.create({
          data: {
            payrollId,
            payslipNumber: `PS-${Date.now()}-${payrollId.substring(0, 4)}`,
          }
        });
      }

      return updatedPayroll;
    });
  }
}
