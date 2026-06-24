'use client'

import Link from 'next/link'
import { 
  ArrowLeft, Target, ShieldCheck, Zap, Globe2, 
  Users, Award, ChevronRight, Activity, Server
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Glows (Blue Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-400/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-6 bg-white/50 px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Asan Spot</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            The world's most advanced, fully automated Social Media Marketing infrastructure. We empower creators and businesses to scale their digital presence instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* ============================================== */}
          {/* بخش اصلی: داستان و ماموریت ما (کارت بزرگ) */}
          {/* ============================================== */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.05)] border border-blue-50/50">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
              <Target className="w-3.5 h-3.5" /> Our Mission
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
              Redefining Digital Growth <br className="hidden md:block" /> Through Smart Automation.
            </h2>
            
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
              <p>
                At Asan Spot, we recognized a massive gap in the digital marketing industry: the need for a reliable, high-speed, and secure platform that delivers real results without the hassle. We built our infrastructure from the ground up to provide seamless Social Media Marketing (SMM) services.
              </p>
              <p>
                Whether you are a rising influencer, a local brand, or a global enterprise, our automated nodes connect you directly to the highest quality network services. By cutting out the middlemen, we ensure lightning-fast delivery at unbeatable wholesale prices.
              </p>
              <p>
                Our commitment goes beyond just delivering likes and followers. We are dedicated to providing a secure ecosystem, supporting cutting-edge payment gateways like AtomaPay, HesabPay, and major Cryptocurrencies, ensuring that no matter where you are, your transactions are instant and safe.
              </p>
            </div>
          </div>

          {/* ============================================== */}
          {/* ستون کناری: آمار و ارقام (کارت‌های کوچک) */}
          {/* ============================================== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <Activity className="w-10 h-10 text-blue-200 mb-4" />
              <h3 className="text-4xl font-black mb-1">99.9%</h3>
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Server Uptime</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.05)] border border-blue-50/50 flex-1 flex flex-col justify-center group">
              <Server className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-4xl font-black text-slate-900 mb-1">500+</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Active Services</p>
            </div>

          </div>
        </div>

        {/* ============================================== */}
        {/* بخش چرا ما را انتخاب کنید (ویژگی‌ها) */}
        {/* ============================================== */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Why Choose Asan Spot?</h2>
          <p className="text-slate-500 font-medium mt-3">The ultimate edge you need to dominate social media.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Instant Execution</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Our automated API routing means your orders start processing within seconds of payment confirmation. No waiting, no delays.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Military-Grade Security</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Your data is encrypted. We never ask for your passwords, and our payment gateways are secured with the highest global standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Premium Quality</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              We constantly monitor and test our network nodes to ensure you receive the highest retention rates and non-drop services available.
            </p>
          </div>

        </div>

        {/* ============================================== */}
        {/* بخش Call to Action */}
        {/* ============================================== */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Go Viral?</h2>
            <p className="text-blue-200 font-medium max-w-xl mx-auto mb-8">
              Join thousands of creators and agencies who trust Asan Spot for their daily digital growth. Create your free account today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/user/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                Create Account <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-black px-8 py-4 rounded-2xl backdrop-blur-sm transition-all active:scale-95">
                View Services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}