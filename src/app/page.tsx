import Link from 'next/link'
import { Briefcase, Mail, CheckCircle, Zap, ArrowRight, Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Simple Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          JobCrew
        </h1>
        <div className="flex items-center gap-6 text-sm font-medium text-text-muted">
          <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
          <Link href="/login?tab=signup" className="btn btn-primary">
            Start Automating
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Simplified Hero */}
      <section className="px-8 py-20 max-w-7xl mx-auto text-center border-b border-border">
        <h2 className="text-5xl md:text-6xl font-extrabold text-text mb-6 tracking-tight">
          Job searching,<br />
          <span className="text-primary">on autopilot.</span>
        </h2>
        <p className="text-lg text-text-muted max-w-xl mx-auto mb-10">
          The simple automation tool that finds relevant jobs and delivers them to your inbox every morning. No noise, just matches.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/login?tab=signup" className="btn btn-primary py-3 px-8 text-lg">
            Create Your Free Crew
          </Link>
          <Link href="/dashboard/preferences" className="btn btn-secondary py-3 px-8 text-lg">
            Set Preferences
          </Link>
        </div>
      </section>

      {/* Clear Features Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">1. Set Preferences</h3>
            <p className="text-text-muted leading-relaxed">
              Tell us your target roles, locations, and salary expectations. We only look for what you actually want.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">2. Daily Automation</h3>
            <p className="text-text-muted leading-relaxed">
              Our crew scrapes major job boards every morning at 8:00 AM. Zero manual searching required.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">3. Email Digests</h3>
            <p className="text-text-muted leading-relaxed">
              Receive a clean email with direct links to top matches. Apply in seconds and get on with your day.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 px-8 text-center text-text-muted text-sm border-t border-border">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Briefcase className="w-5 h-5" />
          <span className="font-bold text-text">JobCrew</span>
        </div>
        <p>© 2026 Job Automation Crew. All rights reserved.</p>
      </footer>
    </div>
  )
}
