import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const startTime = Date.now();
  const healthCheck = {
    server: 'up',
    database: 'unknown',
    timestamp: new Date().toISOString(),
    responseTime: 0,
  };
  
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    healthCheck.database = 'up';
  } catch (error) {
    healthCheck.database = 'down';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database health check failed:', errorMessage);
    
    healthCheck.responseTime = Date.now() - startTime;
    return NextResponse.json(
      {
        ...healthCheck,
        error: errorMessage,
      },
      { status: 503 }, 
    );
  }

  healthCheck.responseTime = Date.now() - startTime;

  return NextResponse.json(healthCheck, { status: 200 });
}