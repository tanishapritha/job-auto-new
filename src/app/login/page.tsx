'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        if (searchParams.get('tab') === 'signup') {
            setIsLogin(false)
        }
    }, [searchParams])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setError('Check your email for the confirmation link.')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card w-full max-w-md p-8 shadow-2xl bg-surface/50 backdrop-blur-xl border-white/10">
            <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-text">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-text-muted text-sm mt-2">
                    {isLogin
                        ? 'Access your job automation crew dashboard.'
                        : 'Join the crew and start automating your search.'}
                </p>
            </div>

            <div className="flex p-1 bg-bg rounded-lg mb-8 border border-border">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {error && (
                    <div className={`p-3 rounded-lg text-xs font-medium border ${error.includes('email') ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                        {error}
                    </div>
                )}

                <div className="input-group">
                    <label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 mt-4 text-lg justify-center transition-all bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Join Crew')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </form>

            <div className="mt-8">
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-2 text-text-muted">Or continue with</span>
                    </div>
                </div>

                <button className="btn btn-secondary w-full justify-center gap-3 py-3">
                    Continue with Social
                </button>
            </div>

            <p className="mt-8 text-center text-xs text-text-muted">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
            <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
