'use client'

import React, { useEffect, useState } from 'react'
import {
    Briefcase,
    Mail,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({
        sent: 0,
        status: 'Inactive',
    })
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Fetch stats from activity logs or profile
                const { count } = await supabase
                    .from('activity_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'success')

                setStats({
                    sent: count || 0,
                    status: 'Active',
                })

                // Fetch recent logs
                const { data: recentLogs } = await supabase
                    .from('activity_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                setLogs(recentLogs || [])
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase])

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="card group hover:scale-[1.02] transition-all cursor-pointer border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div>
                <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-text">{value}</h4>
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Emails Sent"
                    value={loading ? '...' : stats.sent}
                    icon={Mail}
                    color="bg-primary/10 text-primary"
                />
                <StatCard
                    title="Automation Status"
                    value={loading ? '...' : stats.status}
                    icon={CheckCircle2}
                    color="bg-success/10 text-success"
                />
            </div>

            <div className="card border-none shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Recent Activity</h3>
                    <button className="text-primary text-sm font-medium hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <p className="text-text-muted text-sm py-4">No recent activity found.</p>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border/50">
                                <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                    {log.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{log.action || 'Job Search Executed'}</p>
                                    <p className="text-xs text-text-muted">{new Date(log.created_at).toLocaleString()}</p>
                                </div>
                                <div className="text-xs font-medium text-text-muted">
                                    {log.details || '5 jobs found'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
