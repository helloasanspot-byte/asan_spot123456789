'use client'

import Link from 'next/link'
import { Mail, MapPin, Send, ChevronRight, ShieldCheck, Zap, UserPlus, LogIn } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 relative overflow-hidden">
      
      {/* هاله و افکت‌های پس‌زمینه فوتر */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* بخش اول: لوگو و توضیحات (فضای بیشتر) */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-8">
            <Link href="/" className="inline-block group">
              <img 
                src="/Logo.png" 
                alt="Asan Spot Logo" 
                className="h-16 md:h-[72px] w-auto transition-transform duration-500 group-hover:scale-105 drop-shadow-sm" 
              />
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              The world's most advanced, fully automated Social Media Marketing infrastructure. 
              Deploy instant network nodes and boost your online presence with secure and scalable routing.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Zap className="w-4 h-4 text-indigo-500" /> Instant Delivery
              </span>
            </div>
          </div>

          {/* بخش دوم: لینک‌های اصلی (صفحاتی که ساختیم) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Platform</h3>
            <ul className="space-y-4 font-bold text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" /> Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" /> Service Catalog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" /> User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new-order" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group text-indigo-600">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" /> Place New Order
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش سوم: حساب کاربری و پشتیبانی */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Account</h3>
            <ul className="space-y-4 font-bold text-sm text-slate-500">
              <li>
                <Link href="/user/login" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <LogIn className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Sign In
                </Link>
              </li>
              <li>
                <Link href="/user/signup" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <UserPlus className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Create Account
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2 group mt-4 pt-4 border-t border-slate-100">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش چهارم: خبرنامه و اطلاعات تماس */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Stay Updated</h3>
            <div className="space-y-3 mb-6">
              <a href="mailto:support@asanspot.site" className="flex items-center gap-3 text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Mail className="w-4 h-4" /></div> 
                support@asanspot.site
              </a>
              <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin className="w-4 h-4" /></div> 
                London, United Kingdom
              </div>
            </div>
            
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter email address..." 
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-5 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-3.5 rounded-xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md active:scale-95 cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* کپی‌رایت و روش‌های پرداخت */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 font-bold text-xs">
            &copy; {new Date().getFullYear()} Asan Spot. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest">AtomaPay</span>
            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest">HesabPay</span>
            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  )
}