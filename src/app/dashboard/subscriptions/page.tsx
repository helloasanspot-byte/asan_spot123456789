'use client'

import { Repeat, Crown, Star, CheckCircle2, ArrowRight } from 'lucide-react'

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
            <Repeat className="w-8 h-8 text-blue-600" /> Active Subscriptions
          </h1>
          <p className="text-slate-500 font-medium">Automate your growth with our premium monthly and auto-packages.</p>
        </div>

        {/* Pricing Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Auto Likes */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.15)] transition-all duration-300 flex flex-col">
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                <Star className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Auto Likes</h2>
              <p className="text-slate-500 text-sm font-medium mt-2">Automatic likes on your future posts.</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">$29</span>
              <span className="text-slate-400 font-bold"> / 30 Posts</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 1,000 Real Likes per post</li>
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Instant detection (0-15 mins)</li>
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Impressions & Profile Visits included</li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors">
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Pro Growth (Highlighted) */}
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 rounded-[2rem] p-8 border border-indigo-800 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)] relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 text-xs font-black px-4 py-1.5 rounded-b-xl uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-6 mt-4">
              <div className="w-14 h-14 bg-indigo-800/50 text-indigo-300 rounded-2xl flex items-center justify-center mb-6 border border-indigo-700">
                <Crown className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Pro Growth</h2>
              <p className="text-indigo-200/80 text-sm font-medium mt-2">Complete monthly management.</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-white">$149</span>
              <span className="text-indigo-300 font-bold"> / Month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-sm font-bold text-indigo-100"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> 10,000 Premium Followers /mo</li>
              <li className="flex items-start gap-3 text-sm font-bold text-indigo-100"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Auto-Likes & Views on all posts</li>
              <li className="flex items-start gap-3 text-sm font-bold text-indigo-100"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Dedicated Account Manager</li>
              <li className="flex items-start gap-3 text-sm font-bold text-indigo-100"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> 24/7 Priority Support</li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-shadow">
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: VIP Package */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.15)] transition-all duration-300 flex flex-col">
            <div className="mb-6">
              <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">VIP Agency</h2>
              <p className="text-slate-500 text-sm font-medium mt-2">For large influencers and brands.</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">$499</span>
              <span className="text-slate-400 font-bold"> / Month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> 50,000 Premium Followers /mo</li>
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Unlimited Auto-Likes & Views</li>
              <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Custom API Access</li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 hover:text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors">
              Contact Sales <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}

// Simple internal icon for Shield
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
)