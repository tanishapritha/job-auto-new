'use client'

import React, { useEffect, useState } from 'react'
import {
    Activity,
    Play,
    Pause,
    RefreshCcw,
    Clock,
    CheckCircle2,
    AlertCircle,
    Mail,
    Zap,
    Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic'

export default function StatusPage() {
    const supabase = createClient()
    const [isActive, setIsActive] = useState(true)
    const [loading, setLoading] = useState(true)
    const [triggering, setTriggering] = useState(false)
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Fetch recent logs
                const { data: recentLogs } = await supabase
                    .from('activity_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(10)

                setLogs(recentLogs || [])

                // Fetch automation status (mocked or from profile)
                setIsActive(true)
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase])

    const handleManualTrigger = async () => {
        setTriggering(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const response = await fetch('/api/campaign/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            })
            if (!response.ok) throw new Error('Trigger failed')
            alert('Email trigger initiated! Check your inbox shortly.')
        } catch (err) {
            alert('Failed to trigger email. Ensure your preferences are set.')
        } finally {
            setTriggering(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="card border-none shadow-sm bg-gradient-to-br from-surface to-surface/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'} animate-pulse`}>
                            <Activity className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Automation Life-Line</h3>
                            <p className="text-text-muted text-sm">Scheduled daily at 8:00 AM UTC</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleManualTrigger}
                            disabled={triggering}
                            className="btn btn-primary bg-primary/90 hover:bg-primary gap-2"
                        >
                            {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            Send Test Email Now
                        </button>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`btn ${isActive ? 'btn-secondary text-danger border-danger/20 hover:bg-danger/5' : 'btn-primary'} gap-2`}
                        >
                            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isActive ? 'Pause' : 'Resume'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card border-none shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-text-muted" />
                    Execution History
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-text-muted border-b border-border">
                                <th className="pb-4 font-semibold">Status</th>
                                <th className="pb-4 font-semibold">Action</th>
                                <th className="pb-4 font-semibold">Time</th>
                                <th className="pb-4 font-semibold">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={4} className="py-8 text-center text-text-muted">Loading...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-text-muted">No runs found yet.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="text-sm">
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                                {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="py-4 font-medium">{log.action || 'Daily Digest'}</td>
                                        <td className="py-4 text-text-muted">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="py-4 text-text-muted">{log.details || '5 jobs found'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
