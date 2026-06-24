'use client'

import Link from 'next/link'
import { Repeat, Crown, Star, CheckCircle2, ArrowRight } from 'lucide-react'

export default function SubscriptionsPublicPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Automated <span className="text-blue-600">Subscriptions</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Set it and forget it. Our automated systems will detect your new posts and send engagement instantly. Perfect for consistent growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Auto Likes */}
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.15)] transition-all duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <Star className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Auto Likes</h2>
            <p className="text-slate-500 font-medium mt-2 mb-8">Automatic likes on your next 30 posts.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-slate-900">$29</span>
              <span className="text-slate-400 font-bold"> / Package</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 font-bold text-slate-700"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> 1,000 Real Likes per post</li>
              <li className="flex items-center gap-3 font-bold text-slate-700"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Instant detection (0-15 mins)</li>
              <li className="flex items-center gap-3 font-bold text-slate-700"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Impressions included</li>
            </ul>

            <Link href="/user/signup" className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors">
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pro Growth */}
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 rounded-[2rem] p-10 border border-indigo-800 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)] relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 text-sm font-black px-6 py-1.5 rounded-b-xl uppercase tracking-wider">
              Most Popular
            </div>
            <div className="w-16 h-16 bg-indigo-800/50 text-indigo-300 rounded-2xl flex items-center justify-center mb-6 mt-4 border border-indigo-700">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white">Pro Growth</h2>
            <p className="text-indigo-200/80 font-medium mt-2 mb-8">Complete monthly management for VIPs.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-white">$149</span>
              <span className="text-indigo-300 font-bold"> / Month</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 font-bold text-indigo-100"><CheckCircle2 className="w-6 h-6 text-amber-400" /> 10,000 Premium Followers /mo</li>
              <li className="flex items-center gap-3 font-bold text-indigo-100"><CheckCircle2 className="w-6 h-6 text-amber-400" /> Auto-Likes & Views on all posts</li>
              <li className="flex items-center gap-3 font-bold text-indigo-100"><CheckCircle2 className="w-6 h-6 text-amber-400" /> Dedicated Account Manager</li>
            </ul>

            <Link href="/user/signup" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-shadow">
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}