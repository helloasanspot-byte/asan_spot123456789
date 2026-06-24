'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

// --- Custom SVGs for Floating Social Icons (Light Theme) ---
const InstagramSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
)
const YoutubeSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
)
const TelegramSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
)
const TiktokSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg>
)

const floatingIcons = [
  { Icon: InstagramSVG, left: '50%', top: '15%', duration: '15s', size: 'w-12 h-12', delay: '0s', color: 'text-indigo-500/10' },
  { Icon: YoutubeSVG, left: '80%', top: '25%', duration: '18s', size: 'w-16 h-16', delay: '2s', color: 'text-blue-500/10' },
  { Icon: TelegramSVG, left: '40%', top: '80%', duration: '20s', size: 'w-14 h-14', delay: '5s', color: 'text-indigo-600/10' },
  { Icon: TiktokSVG, left: '85%', top: '75%', duration: '17s', size: 'w-12 h-12', delay: '3s', color: 'text-slate-900/10' },
  { Icon: InstagramSVG, left: '70%', top: '50%', duration: '22s', size: 'w-10 h-10', delay: '7s', color: 'text-indigo-500/10' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // استیت‌های مربوط به پروفایل داینامیک
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string } | null>(null)
  const [isSearchingProfile, setIsSearchingProfile] = useState(false)

  // سیستم بررسی خودکار ایمیل از طریق API امنیتی
  useEffect(() => {
    if (!email.includes('@') || !email.includes('.')) {
      setUserProfile(null)
      return
    }

    const fetchProfileByEmail = async () => {
      setIsSearchingProfile(true)
      try {
        // استفاده از API Route سرور برای دور زدن RLS به جای کوئری مستقیم سوپابیس
        const res = await fetch('/api/profile-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() })
        })
        
        const data = await res.json()

        if (data.success && data.profile) {
          const userName = data.profile.name || 'User'
          setUserProfile({
            name: userName !== 'User' ? userName : 'Welcome Back',
            avatar: data.profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=ffffff&color=4f46e5&bold=true`
          })
        } else {
          setUserProfile(null)
        }
      } catch (err) {
        console.error("Profile lookup error:", err)
        setUserProfile(null)
      } finally {
        setIsSearchingProfile(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchProfileByEmail()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [email])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-around {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
          25% { transform: translate(20px, -20px) rotate(5deg); opacity: 1; }
          50% { transform: translate(-10px, -40px) rotate(-5deg); opacity: 0.8; }
          75% { transform: translate(-30px, 10px) rotate(3deg); opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
        }
        .animate-float-bg { animation: float-around linear infinite; }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.4s ease-out forwards; }
      `}} />

      {/* Light Theme Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* === HUGE BACKGROUND LOGO WATERMARK === */}
      <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03] select-none hidden lg:block">
        <img src="/Logo.png" alt="Watermark" className="w-[800px] h-auto object-contain" />
      </div>

      {/* Floating Social Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        {floatingIcons.map((item, index) => {
          const { Icon } = item
          return (
            <div 
              key={index} 
              className={`absolute animate-float-bg ${item.color}`}
              style={{ 
                left: item.left, top: item.top, 
                animationDuration: item.duration, 
                animationDelay: item.delay 
              }}
            >
              <Icon className={item.size} />
            </div>
          )
        })}
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] relative overflow-hidden">
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium text-sm">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center relative z-10">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            
            {/* === DYNAMIC AVATAR SECTION === */}
            <div className="min-h-[80px] flex items-center justify-center transition-all duration-300">
              {userProfile ? (
                <div className="flex flex-col items-center animate-fade-in-down">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 p-[2px] shadow-md mb-2">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="w-full h-full rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{userProfile.name}</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                  <UserSVG className="w-8 h-8" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
                {/* Loader for email check */}
                {isSearchingProfile && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group mt-6 flex items-center justify-center gap-2 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner text-lg border-b-4 border-indigo-800 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'} 
              {!loading && <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600 relative z-10">
            Don't have an account?{' '}
            <Link href="/user/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline underline-offset-2 transition-all">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Simple internal icon for empty avatar state
const UserSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)