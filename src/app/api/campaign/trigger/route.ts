import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendJobDigest } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const { userId } = await request.json()

        console.log('Manual trigger requested for userId:', userId)

        if (!userId) {
            console.error('No userId provided in request body')
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Fetch user profile
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (profileError || !profile) {
            console.log('Profile missing or error, attempting to create one...')
            const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
            if (authError || !authUser.user?.email) {
                return NextResponse.json({ error: 'User not found in auth system' }, { status: 404 })
            }

            // Internal "Self-healing": Create the profile if it doesn't exist
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: authUser.user.email,
                    full_name: authUser.user.user_metadata?.full_name || authUser.user.email.split('@')[0]
                })
                .select()
                .single()

            if (createError) {
                console.error('Failed to create self-healing profile:', createError)
                return NextResponse.json({ error: 'Failed to initialize profile' }, { status: 500 })
            }
            profile = newProfile
        }

        if (!profile.email) {
            console.log('Email missing in profile, fetching from auth system...')
            const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
            if (authError || !authUser.user?.email) {
                console.error('User email not found in auth system either')
                return NextResponse.json({ error: 'User email not found' }, { status: 400 })
            }
            profile.email = authUser.user.email
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
