import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendJobDigest } from '@/lib/resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        // 2. Mock job search (replace with real scraper logic)
        const p = profile as any
        let jobs: any[] = []
        let isPreferencesSet = !!p.domains && (!!p.location_1 || !!p.location_2 || !!p.location_3)

        if (isPreferencesSet) {
            jobs = [
                { title: 'Full Stack Developer', company: 'TechCorp', location: profile.location_1 || 'Remote', link: '#' },
                { title: 'Frontend Engineer', company: 'DesignCo', location: 'Remote', link: '#' },
            ]
        }

        // 3. Send email via Resend
        await sendJobDigest(profile.email, jobs, isPreferencesSet)

        // 4. Log activity
        await supabase.from('activity_logs').insert({
            user_id: userId,
            action: 'Manual Trigger',
            status: 'success',
            details: isPreferencesSet ? `${jobs.length} jobs found` : 'Preference reminder sent'
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Manual trigger failed:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
