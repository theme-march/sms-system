import { spawn } from 'node:child_process';

// Clean up arguments passed to `npm run dev` or `next dev`
const rawArgs = process.argv.slice(2);
const cleanArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    cleanArgs.push('-H');
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      cleanArgs.push(rawArgs[i + 1]);
      i++;
    } else {
      cleanArgs.push('0.0.0.0');
    }
  } else {
    cleanArgs.push(arg);
  }
}

// Ensure port and host defaults if not explicitly provided
if (!cleanArgs.includes('-p') && !cleanArgs.includes('--port')) {
  cleanArgs.push('-p', '3000');
}
if (!cleanArgs.includes('-H') && !cleanArgs.includes('--hostname')) {
  cleanArgs.push('-H', '0.0.0.0');
}

const child = spawn('npx', ['next', 'dev', ...cleanArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
