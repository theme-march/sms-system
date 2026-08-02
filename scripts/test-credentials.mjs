import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
const roles = ['Super Admin','School Admin','Academic Admin','Admission Officer','Accountant','HR Manager','Teacher','Employee','Student','Parent/Guardian'];

function emailForRole(role){
  if(role === 'Super Admin') return process.env.SEED_ADMIN_EMAIL || 'admin@school.test';
  const local = role.toLowerCase().replace(/[^a-z0-9]+/g, '.');
  return `${local}@school.test`;
}

async function main(){
  console.log('Testing seeded credentials...');
  for(const role of roles){
    const email = emailForRole(role);
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user){
      console.log(`${role}: ${email} => USER NOT FOUND`);
      continue;
    }
    if(!user.passwordHash){
      console.log(`${role}: ${email} => NO PASSWORD HASH`);
      continue;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log(`${role}: ${email} => ${ok ? 'PASSWORD OK' : 'PASSWORD MISMATCH'}`);
  }
}

main()
  .catch((e)=>{ console.error(e); process.exit(1); })
  .finally(async ()=>{ await prisma.$disconnect(); });
