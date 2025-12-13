import { NextResponse } from 'next/server';
import { getConnection, testConnection } from '@/lib/db/connection';
import { query } from '@/lib/db/connection';

export async function GET() {
  try {
    // Test 1: Connection test
    const connectionTest = await testConnection();
    console.log('✅ Connection test:', connectionTest);

    // Test 2: Direct query
    const slides = await query('SELECT COUNT(*) as count FROM hero_slides');
    console.log('✅ Hero slides count:', slides);

    // Test 3: Get actual slides
    const allSlides = await query('SELECT * FROM hero_slides LIMIT 5');
    console.log('✅ Sample slides:', allSlides);

    return NextResponse.json({
      connectionTest,
      count: slides[0]?.count || 0,
      sampleSlides: allSlides,
    });
  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json(
      {
        error: error?.message,
        code: error?.code,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}


