# School Management System (Production-Ready Next.js + MySQL + Prisma)

A full-stack, enterprise-grade School Management System tailored for Bangladesh schools (EIIN registration, BDT currency, Asia/Dhaka timezone, English/Bangla i18n support, granular Role-Based Access Control).

---

## 🛠️ Technology Stack

- **Framework**: Next.js App Router (React 19, TypeScript)
- **Database**: MySQL 8.0+
- **ORM**: Prisma ORM v5.22.0
- **Styling**: Tailwind CSS
- **Authentication**: Secure Custom Session System with HTTP-only Cookies & bcryptjs
- **Validation**: Zod & React Hook Form
- **Export Capabilities**: jsPDF (PDF reports) & XLSX (Excel/CSV export)

---

## 🚀 Local Windows Setup Instructions

### 1. Requirements
- Node.js v20+ installed
- MySQL Server running locally on Windows (e.g. MySQL Workbench, XAMPP, or MySQL Community Server)

### 2. Environment Variables (.env)
Create a `.env` file in the root folder with:
```env
DATABASE_URL="mysql://root:password@localhost:3306/school_management"
SESSION_SECRET="super-secret-session-key-change-in-production-12345"
SEED_ADMIN_NAME="Super Admin"
SEED_ADMIN_EMAIL="admin@school.com"
SEED_ADMIN_PASSWORD="AdminPassword123!"
APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seeding Commands
Run the following in your command prompt / PowerShell:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to MySQL database
npm run db:push

# Run seed script to create initial Super Admin & Default School Profile
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Login Credentials
- **Role**: Super Administrator
- **Email**: `admin@school.com`
- **Password**: `AdminPassword123!`

---

## 📂 Key Features
- **School Settings**: Update School Name, EIIN, Principal Name, Currency (BDT), Date Format, Language.
- **Granular RBAC**: 30+ permissions across Super Admin, Teachers, Accountants, Students.
- **Academics & Admissions**: Manage Classes, Sections, Subjects, and Enrolled Students.
- **Attendance & Exams**: Daily Roll Call tracker, Mark sheets with grade calculations (A+, A, B, etc.).
- **Fees & Payroll**: Collect Tuition Fees, track bKash/Cash receipts, generate monthly staff payroll.
- **PDF & Excel Export**: Export student directories, report cards, and financial audit logs.
- **Audit Logs**: Full system audit trail tracking administrative updates.
# sms-system
