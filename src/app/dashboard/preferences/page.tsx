'use client'

import React, { useState, useEffect } from 'react'
import { Save, Globe, MapPin, Hash, Briefcase, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PreferencesPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        domains: '',
        location_1: '',
        location_2: '',
        location_3: '',
        daily_limit: 20,
        remote_only: false
    })

    useEffect(() => {
        async function loadPreferences() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setFormData({
                        domains: data.domains || '',
                        location_1: data.location_1 || '',
                        location_2: data.location_2 || '',
                        location_3: data.location_3 || '',
                        daily_limit: data.daily_limit || 20,
                        remote_only: data.remote_only || false
                    })
                }
            }
            setLoading(false)
        }
        loadPreferences()
    }, [supabase])

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...formData,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold">Search Preferences</h3>
                        <p className="text-sm text-text-muted">Configure how the automation searches for your ideal jobs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {success && <span className="text-success text-sm font-medium animate-fade-in">Saved!</span>}
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-danger/10 text-danger border border-danger/20 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="input-group">
                        <label className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Job Domains / Titles
                        </label>
                        <input
                            type="text"
                            placeholder="Software Engineer, Frontend Developer, React Specialist..."
                            className="w-full"
                            value={formData.domains}
                            onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
                        />
                        <p className="text-xs text-text-muted mt-1">Separate keywords with commas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="input-group">
                                <label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location {i}
                                </label>
                                <input
                                    type="text"
                                    placeholder="City or Country"
                                    value={(formData as any)[`location_${i}`]}
                                    onChange={(e) => setFormData({ ...formData, [`location_${i}`]: e.target.value } as any)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="input-group">
                            <label className="flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Daily Job Limit
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={formData.daily_limit}
                                onChange={(e) => setFormData({ ...formData, daily_limit: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="input-group">
                            <label className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Remote Only
                            </label>
                            <div className="flex items-center h-full pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.remote_only}
                                        onChange={(e) => setFormData({ ...formData, remote_only: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-medium text-text">Remote jobs preference</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
