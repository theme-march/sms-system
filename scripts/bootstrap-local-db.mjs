#!/usr/bin/env node

/**
 * School Management System - Local Database Bootstrap Script
 * 
 * This script:
 * 1. Loads environment variables
 * 2. Creates the MySQL database if it doesn't exist
 * 3. Generates Prisma Client
 * 4. Applies Prisma migrations
 * 5. Seeds essential system data
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import mysql from 'mysql2/promise';

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ ERROR: .env file not found.');
    console.error('   Please copy .env.example to .env and configure it.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...rest] = trimmed.split('=');
    let value = rest.join('=').trim();
    
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    env[key.trim()] = value;
  }

  return env;
}

// Parse MySQL connection URL
function parseDbUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port ? parseInt(urlObj.port, 10) : 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1),
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${url}`);
  }
}

// Validate database name (security check)
function validateDatabaseName(name) {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error(
      `Invalid database name: ${name}. Only alphanumeric and underscore are allowed.`
    );
  }
}

// Create database if not exists
async function ensureDatabaseExists(connectionConfig) {
  const { host, port, user, password, database } = connectionConfig;

  console.log(`📦 Ensuring MySQL database "${database}" exists...`);

  try {
    // Connect without selecting a database
    const tempConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    // Create database
    await tempConnection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${database}\`
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci`
    );

    await tempConnection.end();
    console.log(`✅ Database "${database}" is ready.`);
  } catch (error) {
    console.error(`❌ Failed to create database:`, error.message);
    console.error(
      '\n💡 Troubleshooting:\n' +
      '   • Ensure MySQL is running\n' +
      '   • Verify DATABASE_URL in .env\n' +
      '   • Check MySQL credentials'
    );
    process.exit(1);
  }
}

// Run a command synchronously
function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️  ${description}...`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${description} failed with exit code ${code}`));
      } else {
        console.log(`✅ ${description} completed.`);
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Check if migrations exist
function migrationsExist() {
  const migrationsPath = path.resolve(process.cwd(), 'prisma/migrations');
  if (!fs.existsSync(migrationsPath)) return false;

  const files = fs.readdirSync(migrationsPath).filter((f) => f !== 'migration_lock.toml');
  return files.length > 0;
}

// Main bootstrap logic
async function bootstrap() {
  try {
    console.log('\n🚀 School Management System - Database Bootstrap\n');

    // Step 1: Load environment
    console.log('📄 Loading environment variables...');
    const env = loadEnv();

    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in .env file');
    }

    console.log('✅ Environment loaded.');

    // Step 2: Parse and validate DATABASE_URL
    const connectionConfig = parseDbUrl(env.DATABASE_URL);
    validateDatabaseName(connectionConfig.database);
    console.log(`✅ Database URL validated.`);

    // Step 3: Create database
    await ensureDatabaseExists(connectionConfig);

    // Step 4: Generate Prisma Client
    await runCommand('npx', ['prisma', 'generate'], 'Generating Prisma Client');

    // Step 5: Apply migrations or push schema
    // For local development, use db push which is more forgiving for schema synchronization
    if (process.env.NODE_ENV === 'production') {
      // In production, use migrations
      if (!migrationsExist()) {
        throw new Error(
          'No migrations found. In production, migrations must exist. ' +
          'Run migrations in development first.'
        );
      }
      console.log('\n📊 Found migration files. Applying migrations...');
      await runCommand('npx', ['prisma', 'migrate', 'deploy'], 'Deploying Prisma migrations');
    } else {
      // In development, use db push for more forgiving schema synchronization
      console.log('\n📊 Synchronizing database schema...');
      await runCommand('npx', ['prisma', 'db', 'push', '--skip-generate'], 'Pushing Prisma schema to database');
    }

    // Step 6: Run seed
    await runCommand('npm', ['run', 'db:seed'], 'Seeding database');

    console.log(
      '\n✨ Database bootstrap completed successfully!\n' +
      '   You can now start the application:\n' +
      '   npm run dev\n'
    );
  } catch (error) {
    console.error('\n❌ Bootstrap failed:', error.message);
    process.exit(1);
  }
}

// Run bootstrap
bootstrap();
