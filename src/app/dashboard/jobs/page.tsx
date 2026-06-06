'use client'

import React, { useState, useEffect } from 'react'
import { Search, MapPin, DollarSign, Calendar, ExternalLink, Filter, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function JobsPage() {
    const supabase = createClient()
    const [search, setSearch] = useState('')
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)

    const fetchJobs = async () => {
        setFetching(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            const params = new URLSearchParams({
                keywords: profile?.domains || 'Software Engineer',
                locations: [profile?.location_1, profile?.location_2, profile?.location_3].filter(l => l).join(','),
                remote: (profile?.remote_only || false).toString(),
                limit: (profile?.daily_limit || 20).toString()
            })

            const res = await fetch(`/api/jobs/search?${params.toString()}`)
            const data = await res.json()
            setJobs(data.jobs || [])
        } catch (err) {
            console.error('Failed to fetch jobs:', err)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search within matched jobs..."
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary py-3 px-6">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
                <button
                    className="btn btn-primary py-3 px-8"
                    onClick={fetchJobs}
                    disabled={fetching}
                >
                    {fetching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Trigger New Search'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {fetching && jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-2xl border border-dashed border-border text-text-muted">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Scraping the web for your perfect matches...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="card hover:border-primary/50 transition-all cursor-pointer group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            {job.source}
                                        </span>
                                    </div>
                                    <p className="text-text font-medium mb-3">{job.company}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="w-4 h-4" />
                                            {job.salary}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {job.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="btn btn-secondary px-4 py-2 text-sm">
                                        Save
                                    </button>
                                    <a
                                        href={job.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary px-4 py-2 text-sm"
                                    >
                                        View Job
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-text-muted">
                        <p>No jobs found. Try adjusting your preferences or search terms.</p>
                    </div>
                )}
            </div>

            <div className="text-center py-8">
                <p className="text-text-muted text-sm italic">
                    {fetching ? 'Updating...' : `Showing ${filteredJobs.length} jobs based on your daily limit.`}
                </p>
            </div>
        </div>
    )
}
