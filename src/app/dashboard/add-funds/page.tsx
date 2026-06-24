'use client'

import Link from 'next/link'
import { 
  Wallet, ShieldCheck, Zap, Lock, CreditCard, 
  ArrowLeft, Clock, Server, Globe2, Activity 
} from 'lucide-react'

export default function AddFundsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/30 pb-24 pt-10">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-5xl mx-auto px-6">
        
        {/* Header Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Wallet className="w-8 h-8 text-indigo-600" /> Funding Terminal
            </h1>
          </div>
        </div>

        {/* Main Alert Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden mb-8 relative">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                <Clock className="w-10 h-10 text-indigo-300 animate-pulse" />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Activity className="w-3 h-3" /> System Upgrade in Progress
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                  Payment Nodes Offline
                </h2>
                <p className="text-indigo-200/80 font-medium text-sm md:text-base max-w-xl">
                  We are deploying a revolutionary payment infrastructure to ensure 100% secure, instant, and decentralized transactions.
                </p>
              </div>
            </div>
          </div>

          {/* Dual Language Content */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* English Box */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-indigo-500" /> English
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                Dear user, the "Add Funds" functionality is temporarily paused as we undergo a major system upgrade. We are integrating advanced security protocols and connecting new global payment gateways. 
              </p>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                Once the update is complete, you will experience zero-latency deposits with zero hidden fees. Thank you for your patience and for choosing Asan Spot.
              </p>
            </div>

            {/* Persian Box */}
            <div className="space-y-4 text-right" dir="rtl">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center justify-end gap-2" dir="ltr">
                فارسی <Globe2 className="w-5 h-5 text-indigo-500" />
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                کاربر گرامی، بخش «افزایش موجودی» به دلیل ارتقای گسترده سیستم موقتاً غیرفعال است. ما در حال یکپارچه‌سازی پروتکل‌های امنیتی پیشرفته و اتصال به درگاه‌های پرداخت جهانی جدید هستیم.
              </p>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                پس از تکمیل این بروزرسانی، شما می‌توانید حساب خود را به صورت آنی و بدون هیچگونه کارمزد پنهان شارژ کنید. از صبر و شکیبایی شما و انتخابتان سپاسگزاریم.
              </p>
            </div>

          </div>
        </div>

        {/* Future Integrations Grid */}
        <h3 className="text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
          Upcoming Payment Integrations
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center opacity-70 grayscale-[30%]">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-slate-800">Global Cards</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Visa / Mastercard</p>
            <span className="mt-3 px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded">Soon</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center opacity-70 grayscale-[30%]">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 border border-emerald-100">
              <span className="font-black">HP</span>
            </div>
            <p className="text-sm font-black text-slate-800">HesabPay</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Local Mobile Wallet</p>
            <span className="mt-3 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded">Soon</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center opacity-70 grayscale-[30%]">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 border border-indigo-100">
              <span className="font-black">AP</span>
            </div>
            <p className="text-sm font-black text-slate-800">AtomaPay</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Premium Gateway</p>
            <span className="mt-3 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded">Soon</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center opacity-70 grayscale-[30%]">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3 border border-amber-100">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1.54A4.015 4.015 0 0 1 8.5 12c0-2.21 1.79-4 4-4V6.5a1.5 1.5 0 0 1 3 0V8c1.38.38 2.5 1.62 2.5 3 0 2.21-1.79 4-4 4v1.5a1.5 1.5 0 0 1-3 0zm1-3.5c-1.1 0-2-.9-2-2s.9-2 2-2v4z"/></svg>
            </div>
            <p className="text-sm font-black text-slate-800">Crypto Assets</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">USDT / BTC / ETH</p>
            <span className="mt-3 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded">Soon</span>
          </div>
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-1">Bank-Grade Security</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">All transactions will be protected with military-grade AES-256 encryption.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <Zap className="w-8 h-8 text-indigo-500 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-1">Instant Balance</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Funds are automatically credited to your account within milliseconds of payment.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <Server className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-1">Zero Downtime</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Our new payment API ensures continuous uptime even during high-load periods.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}