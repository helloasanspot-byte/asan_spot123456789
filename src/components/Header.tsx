'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogIn, Menu, X, PlusCircle, LayoutDashboard, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase' // مسیر سوپابیس خودت را چک کن

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const [session, setSession] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoadingAuth(false)
    }
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'py-3 bg-white/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-200/50' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/Logo.png" 
            alt="Asan Spot Logo" 
            className="h-16 md:h-20 w-auto transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(37,99,235,0.15)]" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-3 font-extrabold text-sm uppercase tracking-wider">
          <Link href="/" className="px-5 py-2.5 rounded-full text-slate-700 hover:text-white hover:bg-blue-600 transition-all duration-300">
            Home
          </Link>
          
          <Link href="/services" className="px-5 py-2.5 rounded-full text-slate-700 hover:text-white hover:bg-blue-600 transition-all duration-300">
            Services
          </Link>

          {/* لینک به صفحه جدید About */}
          <Link href="/dashboard/about" className="px-5 py-2.5 rounded-full text-slate-700 hover:text-white hover:bg-blue-600 transition-all duration-300">
            About
          </Link>

          {/* لینک به صفحه جدید Contact */}
          <Link href="/dashboard/contact" className="px-5 py-2.5 rounded-full text-slate-700 hover:text-white hover:bg-blue-600 transition-all duration-300">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {!loadingAuth && (
            session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-blue-700 bg-blue-50 border border-blue-100 hover:text-white hover:bg-blue-600 transition-all duration-300 font-extrabold">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/dashboard/new-order" className="group flex items-center gap-2 bg-slate-900 text-white font-extrabold px-7 py-2.5 rounded-full transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 shadow-md">
                  <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Order
                </Link>
              </>
            ) : (
              <>
                <Link href="/user/login" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-blue-700 bg-blue-50 border border-blue-100 hover:text-white hover:bg-blue-600 transition-all duration-300 font-extrabold">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link href="/user/signup" className="group flex items-center gap-2 bg-slate-900 text-white font-extrabold px-7 py-2.5 rounded-full transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 shadow-md">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-slate-700 hover:text-white hover:bg-blue-600 transition-all duration-300 bg-white/50 backdrop-blur-md p-2.5 rounded-full shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-slate-200 shadow-2xl py-6 px-6 flex flex-col gap-3 animate-fade-in-up">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-extrabold text-lg hover:bg-blue-50 hover:text-blue-600 px-6 py-3 rounded-2xl transition-all">Home</Link>
          
          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-extrabold text-lg hover:bg-blue-50 hover:text-blue-600 px-6 py-3 rounded-2xl transition-all">Services</Link>
          
          <Link href="/dashboard/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-extrabold text-lg hover:bg-blue-50 hover:text-blue-600 px-6 py-3 rounded-2xl transition-all">About</Link>
          
          <Link href="/dashboard/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-extrabold text-lg hover:bg-blue-50 hover:text-blue-600 px-6 py-3 rounded-2xl transition-all">Contact</Link>
          
          <hr className="border-slate-100 my-4" />
          
          {!loadingAuth && session ? (
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-blue-700 bg-blue-50 border border-blue-100 font-extrabold px-6 py-4 rounded-full">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/dashboard/new-order" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-600 font-extrabold px-6 py-4 rounded-full transition-colors">
                <PlusCircle className="w-5 h-5" /> New Order
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/user/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-blue-700 bg-blue-50 border border-blue-100 font-extrabold px-6 py-4 rounded-full">
                <LogIn className="w-5 h-5" /> Login
              </Link>
              <Link href="/user/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-600 font-extrabold px-6 py-4 rounded-full transition-colors">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}