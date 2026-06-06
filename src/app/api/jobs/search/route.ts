import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const keywords = searchParams.get('keywords') || ''
    const locations = searchParams.get('locations')?.split(',') || []
    const remoteOnly = searchParams.get('remote') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    // In a real implementation, you would call a scraping service or use a library here.
    // For this build, we return mock results that simulate a search.

    const mockTitles = keywords.split(',').map(k => k.trim()).filter(k => k)
    if (mockTitles.length === 0) mockTitles.push('Software Engineer')

    const results = Array.from({ length: limit }).map((_, i) => {
        const title = mockTitles[i % mockTitles.length]
        return {
            id: `job-${i}-${Date.now()}`,
            title: title,
            company: ['Google', 'Meta', 'Amazon', 'Vercel', 'Supabase', 'Stripe'][Math.floor(Math.random() * 6)],
            location: remoteOnly ? 'Remote' : (locations[Math.floor(Math.random() * locations.length)] || 'United States'),
            salary: `$${Math.floor(Math.random() * 80 + 100)}k - $${Math.floor(Math.random() * 100 + 150)}k`,
            date: 'Just now',
            source: ['LinkedIn', 'Indeed', 'Ottis', 'Wellfound'][Math.floor(Math.random() * 4)],
            link: 'https://example.com/job'
        }
    })

    return NextResponse.json({ jobs: results })
}
