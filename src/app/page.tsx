import Link from 'next/link'
import { Briefcase, Zap, Shield, Mail, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          JobCrew
        </h1>
        <div className="flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
          <Link href="/login?tab=signup" className="btn btn-primary">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-bounce">
          <Zap className="w-4 h-4" />
          v2.0 is now live with Supabase integration
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold text-text mb-8 tracking-tight">
          Find your next job while <br />
          <span className="text-primary">you sleep.</span>
        </h2>
        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12">
          The all-in-one automation crew that scrapes the web, filters the noise, and delivers your perfect job matches to your inbox every single morning.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/login?tab=signup" className="btn btn-primary py-4 px-10 text-lg">
            Start Free Crew
          </Link>
          <button className="btn btn-secondary py-4 px-10 text-lg">
            Watch Demo
          </button>
        </div>

        {/* Mock Mock UI */}
        <div className="mt-20 relative px-4">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] -z-10 rounded-full"></div>
          <div className="card max-w-5xl mx-auto p-4 md:p-8 bg-surface/50 backdrop-blur-xl border-white/20 shadow-2xl skew-y-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-bold">Daily Digests</h4>
                <p className="text-sm text-text-muted">Hand-picked jobs delivered at 8 AM daily.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center text-success mb-2">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-bold">Smart Filtering</h4>
                <p className="text-sm text-text-muted">Zero duplicates, only relevant high-salary matches.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center text-warning mb-2">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-bold">Global Reach</h4>
                <p className="text-sm text-text-muted">LinkedIn, Indeed, Glassdoor and 20+ more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-24 py-12 px-8 text-center text-text-muted text-sm">
        <p>© 2026 Job Automation Crew. Built with Supabase & Next.js.</p>
      </footer>
    </div>
  )
}
