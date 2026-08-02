import { NextResponse } from 'next/server';
import { destroySession } from '@/src/lib/auth/session';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Logout error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
