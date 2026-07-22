const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Remove existing Payroll
schema = schema.replace(/model Payroll \{[\s\S]*?\n\}/g, '');
// Remove enum PayrollStatus if it exists
schema = schema.replace(/enum PayrollStatus \{[\s\S]*?\n\}/g, '');

const newModels = `
// ============================================================================
// HR, LEAVE, & PAYROLL MODULE
// ============================================================================

model LeaveType {
  id               String   @id @default(uuid())
  schoolId         String   @map("school_id")
  name             String
  code             String
  description      String?
  daysAllowed      Int      @map("days_allowed")
  isCarryForward   Boolean  @default(false) @map("is_carry_forward")
  isPaid           Boolean  @default(true) @map("is_paid")
  isActive         Boolean  @default(true) @map("is_active")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@unique([schoolId, code])
  @@map("leave_types")
}

model LeaveApplication {
  id               String   @id @default(uuid())
  schoolId         String   @map("school_id")
  userId           String   @map("user_id") // ID of the teacher or employee
  leaveTypeId      String   @map("leave_type_id")
  startDate        DateTime @map("start_date")
  endDate          DateTime @map("end_date")
  totalDays        Int      @map("total_days")
  reason           String   @db.Text
  attachmentUrl    String?  @map("attachment_url")
  status           String   @default("PENDING") // PENDING, APPROVED, REJECTED
  appliedAt        DateTime @default(now()) @map("applied_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("leave_applications")
}

model LeaveApproval {
  id                 String   @id @default(uuid())
  leaveApplicationId String   @map("leave_application_id")
  approvedById       String   @map("approved_by_id")
  status             String   // APPROVED, REJECTED
  remarks            String?  @db.Text
  actionDate         DateTime @default(now()) @map("action_date")

  @@map("leave_approvals")
}

model SalaryStructure {
  id          String   @id @default(uuid())
  schoolId    String   @map("school_id")
  name        String
  code        String
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@unique([schoolId, code])
  @@map("salary_structures")
}

model SalaryComponent {
  id                String   @id @default(uuid())
  salaryStructureId String   @map("salary_structure_id")
  name              String
  type              String   // EARNING, DEDUCTION
  componentType     String   @map("component_type") // Basic Salary, House Rent, Medical Allowance, Tax, etc.
  amountType        String   @map("amount_type") // FIXED, PERCENTAGE
  amount            Decimal  @db.Decimal(10, 2)
  percentageBase    String?  @map("percentage_base") // Which component it is based on
  isTaxable         Boolean  @default(true) @map("is_taxable")
  isActive          Boolean  @default(true) @map("is_active")

  @@map("salary_components")
}

model EmployeeSalaryAssignment {
  id                String   @id @default(uuid())
  schoolId          String   @map("school_id")
  userId            String   @map("user_id") // ID of teacher or employee
  salaryStructureId String   @map("salary_structure_id")
  effectiveDate     DateTime @map("effective_date")
  isActive          Boolean  @default(true) @map("is_active")
  createdAt         DateTime @default(now()) @map("created_at")

  @@map("employee_salary_assignments")
}

model PayrollPeriod {
  id           String   @id @default(uuid())
  schoolId     String   @map("school_id")
  payrollYear  Int      @map("payroll_year")
  payrollMonth Int      @map("payroll_month")
  startDate    DateTime @map("start_date")
  endDate      DateTime @map("end_date")
  workingDays  Int      @map("working_days")
  paymentDate  DateTime? @map("payment_date")
  status       String   @default("DRAFT") // DRAFT, CALCULATED, REVIEWED, APPROVED, PARTIALLY_PAID, PAID, CANCELLED
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@unique([schoolId, payrollYear, payrollMonth])
  @@map("payroll_periods")
}

model Payroll {
  id               String   @id @default(uuid())
  payrollPeriodId  String   @map("payroll_period_id")
  schoolId         String   @map("school_id")
  userId           String   @map("user_id") // ID of teacher or employee
  basicSalary      Decimal  @default(0.00) @map("basic_salary") @db.Decimal(10, 2)
  totalAllowances  Decimal  @default(0.00) @map("total_allowances") @db.Decimal(10, 2)
  totalDeductions  Decimal  @default(0.00) @map("total_deductions") @db.Decimal(10, 2)
  overtime         Decimal  @default(0.00) @db.Decimal(10, 2)
  bonus            Decimal  @default(0.00) @db.Decimal(10, 2)
  tax              Decimal  @default(0.00) @db.Decimal(10, 2)
  loanDeduction    Decimal  @default(0.00) @map("loan_deduction") @db.Decimal(10, 2)
  absenceDeduction Decimal  @default(0.00) @map("absence_deduction") @db.Decimal(10, 2)
  grossSalary      Decimal  @default(0.00) @map("gross_salary") @db.Decimal(10, 2)
  netSalary        Decimal  @default(0.00) @map("net_salary") @db.Decimal(10, 2)
  paidAmount       Decimal  @default(0.00) @map("paid_amount") @db.Decimal(10, 2)
  status           String   @default("DRAFT") // DRAFT, APPROVED, PARTIALLY_PAID, PAID
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@unique([payrollPeriodId, userId])
  @@map("payrolls")
}

model PayrollItem {
  id            String   @id @default(uuid())
  payrollId     String   @map("payroll_id")
  componentName String   @map("component_name")
  componentType String   @map("component_type") // EARNING, DEDUCTION
  amount        Decimal  @db.Decimal(10, 2)

  @@map("payroll_items")
}

model PayrollAdjustment {
  id        String   @id @default(uuid())
  payrollId String   @map("payroll_id")
  type      String   // ADDITION, DEDUCTION
  amount    Decimal  @db.Decimal(10, 2)
  reason    String
  createdAt DateTime @default(now()) @map("created_at")

  @@map("payroll_adjustments")
}

model SalaryPayment {
  id             String   @id @default(uuid())
  payrollId      String   @map("payroll_id")
  amount         Decimal  @db.Decimal(10, 2)
  paymentMethod  String   @map("payment_method") // CASH, BANK, CHEQUE, MOBILE_MONEY
  transactionRef String?  @map("transaction_ref")
  paymentDate    DateTime @default(now()) @map("payment_date")
  processedById  String   @map("processed_by_id")

  @@map("salary_payments")
}

model Payslip {
  id              String   @id @default(uuid())
  payrollId       String   @unique @map("payroll_id")
  payslipNumber   String   @unique @map("payslip_number")
  generatedAt     DateTime @default(now()) @map("generated_at")

  @@map("payslips")
}
`;

fs.writeFileSync('prisma/schema.prisma', schema + newModels);
