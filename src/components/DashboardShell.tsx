'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Settings,
    Briefcase,
    Activity,
    User,
    LogOut,
    Bell,
    Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Preferences', href: '/dashboard/preferences', icon: Settings },
    { label: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { label: 'Status', href: '/dashboard/status', icon: Activity },
]

export const dynamic = 'force-dynamic'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [userData, setUserData] = useState<{ email?: string; full_name?: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserData({
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
                })
            }
            setLoading(false)
        }
        getUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="p-6">
                    <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2 no-underline">
                        <Briefcase className="w-6 h-6" />
                        JobCrew
                    </Link>
                </div>

                <div className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-border">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all group relative">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{userData?.full_name || 'User'}</p>
                                <p className="text-xs text-text-muted truncate">{userData?.email || 'user@example.com'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 hover:bg-danger/10 hover:text-danger rounded-md transition-colors"
                                title="Log out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="main-panel">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-text">
                            {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                        </h2>
                        <p className="text-text-muted text-sm">Automating your search every day.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-surface border border-border relative">
                            <Bell className="w-5 h-5 text-text-muted" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-bg"></span>
                        </button>
                    </div>
                </header>

                <div className="content">
                    {children}
                </div>
            </main>
        </div>
    )
}
