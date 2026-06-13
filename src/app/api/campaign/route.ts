import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendJobDigest } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // Authorization check
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')
        if (key !== process.env.TRIGGER_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Fetch all profiles
        const { data: profiles, error: fetchError } = await supabase
            .from('profiles')
            .select('*')

        if (fetchError || !profiles) {
            throw fetchError || new Error('No profiles found')
        }

        const results = []

        // 2. Process each profile
        for (const profile of profiles) {
            try {
                const p = profile as any
                let jobs: any[] = []
                let isPreferencesSet = !!p.domains && (!!p.location_1 || !!p.location_2 || !!p.location_3)

                if (isPreferencesSet) {
                    // Mock job search logic
                    jobs = [
                        { title: 'Full Stack Developer', company: 'TechCorp', location: profile.location_1 || 'Remote', link: 'https://example.com/job1' },
                        { title: 'Backend Engineer', company: 'DataScale', location: 'Remote', link: 'https://example.com/job2' },
                    ]
                }

                if (!p.email) {
                    const { data: authUser } = await supabase.auth.admin.getUserById(p.id)
                    p.email = authUser.user?.email
                }

                if (!p.email) {
                    throw new Error('User email not found')
                }

                // Send email
                await sendJobDigest(p.email, jobs, isPreferencesSet)

                // Log success
                await supabase.from('activity_logs').insert({
                    user_id: profile.id,
                    action: 'Daily Digest',
                    status: 'success',
                    details: isPreferencesSet ? `${jobs.length} jobs found` : 'Preference reminder sent'
                })

                results.push({ email: profile.email, status: 'success' })
            } catch (err: any) {
                console.error(`Failed to process ${profile.email}:`, err)
                results.push({ email: profile.email, status: 'error', error: err.message })
            }
        }

        return NextResponse.json({ status: 'completed', results })
    } catch (err: any) {
        console.error('Campaign failed:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
