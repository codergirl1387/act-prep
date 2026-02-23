import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.turso_url = process.env.TURSO_DATABASE_URL ? 'set' : 'MISSING';
  checks.turso_token = process.env.TURSO_AUTH_TOKEN ? 'set' : 'MISSING';
  checks.anthropic = process.env.ANTHROPIC_API_KEY ? 'set' : 'MISSING';
  checks.email = process.env.EMAIL_USER ? 'set' : 'MISSING';
  checks.recipient = process.env.RECIPIENT_EMAIL ?? 'MISSING';
  checks.exam_date = process.env.EXAM_DATE ?? 'MISSING';

  try {
    const { getDb } = await import('@/lib/db');
    const db = getDb();
    const r = await db.execute('SELECT COUNT(*) as c FROM topic_weights');
    checks.db = `ok (topic_weights: ${r.rows[0].c} rows)`;
  } catch (e) {
    checks.db = `ERROR: ${String(e)}`;
  }

  try {
    const { ensureMigrated } = await import('@/lib/db');
    await ensureMigrated();
    checks.migrations = 'ok';
  } catch (e) {
    checks.migrations = `ERROR: ${String(e)}`;
  }

  try {
    const { getCompletedExamCount } = await import('@/lib/db/queries/sessions');
    const c = await getCompletedExamCount();
    checks.sessions = `ok (exams: ${c})`;
  } catch (e) {
    checks.sessions = `ERROR: ${String(e)}`;
  }

  return NextResponse.json(checks);
}
