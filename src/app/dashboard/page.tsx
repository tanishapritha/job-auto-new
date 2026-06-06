'use client'

import React, { useEffect, useState } from 'react'
import { Mail, CheckCircle, TrendingUp, Activity, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({
        sent: 0,
        status: 'Inactive',
        rate: '0%'
    })
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const [profileRes, logsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
            ])

            if (profileRes.data) {
                setStats({
                    sent: profileRes.data.emails_sent || 0,
                    status: profileRes.data.status === 'active' ? 'Active' : 'Paused',
                    rate: profileRes.data.emails_sent > 0 ? '100%' : '0%' // Simplistic
                })
            }

            if (logsRes.data) {
                setLogs(logsRes.data)
            }

            setLoading(false)
        }
        loadData()
    }, [supabase])

    const statCards = [
        { label: 'Total Emails Sent', value: stats.sent.toString(), icon: Mail, color: 'text-primary' },
        { label: 'Current Status', value: stats.status, icon: CheckCircle, color: stats.status === 'Active' ? 'text-success' : 'text-warning' },
        { label: 'System Health', value: '100%', icon: TrendingUp, color: 'text-success' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="card flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-surface border border-border ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                                <p className="text-2xl font-bold text-text">{stat.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Recent Activity</h3>
                </div>

                {logs.length > 0 ? (
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-bg/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-success' : 'bg-primary'}`}></div>
                                    <p className="text-sm font-medium">{log.event}</p>
                                </div>
                                <p className="text-xs text-text-muted">
                                    {new Date(log.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-text-muted">
                        <p>No recent activity found. Once your automation runs, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
