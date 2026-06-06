'use client'

import React, { useEffect, useState } from 'react'
import { Activity, ShieldCheck, Zap, History, Info, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function StatusPage() {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pausing, setPausing] = useState(false)

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [profileRes, logsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        ])

        if (profileRes.data) setProfile(profileRes.data)
        if (logsRes.data) setLogs(logsRes.data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [supabase])

    const toggleAutomation = async () => {
        if (!profile) return
        setPausing(true)
        const newStatus = profile.status === 'active' ? 'paused' : 'active'

        await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', profile.id)

        await loadData()
        setPausing(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const isActive = profile?.status === 'active'

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`card border-${isActive ? 'success' : 'warning'}/20 bg-${isActive ? 'success' : 'warning'}/5`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-${isActive ? 'success' : 'warning'}/10 text-${isActive ? 'success' : 'warning'} border border-${isActive ? 'success' : 'warning'}/20`}>
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold text-${isActive ? 'success' : 'warning'}`}>
                                Automation: {isActive ? 'Active' : 'Paused'}
                            </h3>
                            <p className={`text-xs opacity-80`}>
                                {isActive ? 'Next run scheduled for tomorrow at 8:00 AM UTC.' : 'Resume automation to start receiving job matches.'}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted mb-4">
                        Your job automation is currently {isActive ? 'active and processing daily digests' : 'paused'} based on your preferences.
                    </p>
                    <button
                        onClick={toggleAutomation}
                        disabled={pausing}
                        className={`btn btn-secondary w-full border-${isActive ? 'success' : 'warning'}/20 hover:bg-${isActive ? 'success' : 'warning'}/5 text-${isActive ? 'success' : 'warning'}`}
                    >
                        {pausing ? <Loader2 className="w-4 h-4 animate-spin" /> : (isActive ? 'Pause Service' : 'Resume Service')}
                    </button>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">System Health</h3>
                            <p className="text-xs text-text-muted">All systems operational.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">Job Scraper</span>
                            <span className="text-success font-bold">Online</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">Email Engine</span>
                            <span className="text-success font-bold">Online</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">Supabase Realtime</span>
                            <span className="text-success font-bold">Connected</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <History className="w-5 h-5 text-text-muted" />
                    <h3 className="text-lg font-bold">Execution Logs</h3>
                </div>

                <div className="space-y-4">
                    {logs.length > 0 ? logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all">
                            <div className={`p-2 rounded-lg ${log.status === 'Success' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                }`}>
                                {log.status === 'Success' ? <ShieldCheck className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{log.event}</p>
                                <p className="text-xs text-text-muted">
                                    {new Date(log.created_at).toLocaleString()}
                                </p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-full ${log.status === 'Success' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                }`}>
                                {log.status}
                            </span>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-text-muted italic text-sm">
                            No logs available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
