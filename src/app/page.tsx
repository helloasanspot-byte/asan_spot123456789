'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Rocket, ShieldCheck, Zap, ArrowRight, TrendingUp, Heart, Users } from 'lucide-react'

// --- Custom SVGs for Brands (No lucide-react dependency needed for these) ---
const InstagramSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
)
const YoutubeSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
)
const TiktokSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg>
)
const TelegramSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22 3L2 12l5 2 2 7 3-5 5 3 5-17z"/></svg>
)
// آیکون‌های متفرقه از عکس
const PaperPlaneSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
)
const HeartOutlineSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
)
const UserOutlineSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
)

// آرایه‌ای برای تولید باران آیکون‌ها در پس‌زمینه
const rainIcons = [
  { Icon: InstagramSVG, left: '10%', delay: '0s', duration: '12s', size: 'w-8 h-8', color: 'text-pink-500/10' },
  { Icon: YoutubeSVG, left: '25%', delay: '2s', duration: '15s', size: 'w-12 h-12', color: 'text-red-500/10' },
  { Icon: PaperPlaneSVG, left: '45%', delay: '1s', duration: '10s', size: 'w-10 h-10', color: 'text-blue-500/10' },
  { Icon: TiktokSVG, left: '65%', delay: '4s', duration: '14s', size: 'w-10 h-10', color: 'text-slate-900/10' },
  { Icon: Heart, left: '85%', delay: '0.5s', duration: '11s', size: 'w-8 h-8', color: 'text-rose-500/10' },
  { Icon: InstagramSVG, left: '15%', delay: '5s', duration: '13s', size: 'w-10 h-10', color: 'text-purple-500/10' },
  { Icon: PaperPlaneSVG, left: '75%', delay: '3s', duration: '16s', size: 'w-8 h-8', color: 'text-sky-500/10' },
  { Icon: YoutubeSVG, left: '55%', delay: '6s', duration: '12s', size: 'w-10 h-10', color: 'text-red-500/10' },
  { Icon: Heart, left: '35%', delay: '4.5s', duration: '10s', size: 'w-6 h-6', color: 'text-rose-500/15' },
  { Icon: Users, left: '90%', delay: '7s', duration: '14s', size: 'w-12 h-12', color: 'text-blue-600/10' },
]

const floatingIcons = [
  { Icon: InstagramSVG, startX: -150, startY: 80, tx: -400, ty: 200, r: -45, color: 'text-pink-500', size: 'w-16 h-16' },
  { Icon: HeartOutlineSVG, startX: -200, startY: 180, tx: -500, ty: 400, r: -20, color: 'text-rose-500', size: 'w-14 h-14' },
  { Icon: Zap, startX: -10, startY: -60, tx: -100, ty: -300, r: 25, color: 'text-amber-400', size: 'w-14 h-14 drop-shadow-md fill-amber-400' },
  { Icon: PaperPlaneSVG, startX: -20, startY: 20, tx: -150, ty: -200, r: -15, color: 'text-blue-500', size: 'w-16 h-16 stroke-[1.5]' },
  { Icon: TiktokSVG, startX: 100, startY: -20, tx: 300, ty: -200, r: 15, color: 'text-slate-900', size: 'w-14 h-14' },
  { Icon: YoutubeSVG, startX: 150, startY: 100, tx: 400, ty: 250, r: -25, color: 'text-red-500', size: 'w-16 h-16' },
  { Icon: UserOutlineSVG, startX: 200, startY: 200, tx: 500, ty: 450, r: 30, color: 'text-blue-500', size: 'w-14 h-14 stroke-[2]' },
]

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const explosionProgress = Math.min(scrollY / 600, 1)

  return (
    <div className="relative overflow-hidden font-sans selection:bg-blue-500/30 text-slate-900 bg-[#F0F6FF] min-h-screen">
      
      {/* انیمیشن بارش آیکون‌ها */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes icon-rain {
          0% { transform: translateY(-150px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-rain { animation: icon-rain linear infinite; }
      `}} />

      {/* افکت‌های نوری پس‌زمینه */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-sky-400/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {rainIcons.map((item, index) => {
          const { Icon } = item
          return (
            <div 
              key={index} 
              className={`absolute animate-rain ${item.color}`}
              style={{ 
                left: item.left, 
                animationDelay: item.delay, 
                animationDuration: item.duration 
              }}
            >
              <Icon className={item.size} />
            </div>
          )
        })}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center min-h-[85vh]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-slate-700">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Asan Spot</span>, the ultimate destination for skyrocketing your online
        </h1>
        <p className="max-w-3xl text-xl text-slate-500 font-medium leading-relaxed mb-16">
          presence. We provide 100% automated, high-quality followers, likes, views, and engagement across all major platforms. Pay securely with Crypto and watch your numbers grow in seconds.
        </p>

        {/* Call to Action Buttons & Floating Icons Container */}
        <div className="relative w-full flex justify-center mt-10">
          
          {/* آیکون‌های شناور و انفجاری */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            {floatingIcons.map((p, i) => {
              const { Icon } = p
              const currentX = p.startX + (p.tx - p.startX) * explosionProgress
              const currentY = p.startY + (p.ty - p.startY) * explosionProgress
              const currentRotation = p.r + (explosionProgress * 90)
              const currentOpacity = 1 - (explosionProgress * 1.5)

              return (
                <div
                  key={i}
                  className={`absolute left-1/2 top-1/2 origin-center ${p.color}`}
                  style={{
                    transform: `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) rotate(${currentRotation}deg)`,
                    opacity: Math.max(0, currentOpacity),
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
                  }}
                >
                  <Icon className={p.size} />
                </div>
              )
            })}
          </div>

          {/* دکمه‌های اصلی */}
          <div className="relative z-20 flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              href="/user/signup"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.8)] hover:-translate-y-0.5 text-lg"
            >
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {/* 🔥 تغییر مهم: این دکمه حالا به صفحه services/ هدایت می‌کند 🔥 */}
            <Link 
              href="/services"
              className="flex items-center justify-center gap-2 bg-white border border-blue-100 text-blue-700 hover:text-white hover:bg-blue-600 font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Platforms Overview Section */}
      <section id="platforms" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Supported Platforms</h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            We offer specialized, high-retention growth services for the world's most popular social networks. Choose your battlefield and let us handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Platform Box: Instagram */}
          <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(236,72,153,0.2)] hover:-translate-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform">
              <InstagramSVG className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Instagram</h3>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed text-sm">
              Boost your profile instantly. Get premium followers, organic-looking likes, and massive reel views to trigger the algorithm and reach the explore page.
            </p>
            <ul className="space-y-2 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-pink-500" /> Premium Followers</li>
              <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-pink-500" /> Auto-Likes & Saves</li>
            </ul>
          </div>

          {/* Platform Box: TikTok */}
          <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)] hover:-translate-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-200 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(15,23,42,0.3)] group-hover:scale-110 transition-transform">
              <TiktokSVG className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">TikTok</h3>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed text-sm">
              Go viral over night. We provide real-looking views, shares, and followers to push your videos to the "For You" page (FYP) seamlessly.
            </p>
            <ul className="space-y-2 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-slate-900" /> Viral Views & Shares</li>
              <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-slate-900" /> Active Followers</li>
            </ul>
          </div>

          {/* Platform Box: Telegram */}
          <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(56,189,248,0.2)] hover:-translate-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(56,189,248,0.3)] group-hover:scale-110 transition-transform">
              <TelegramSVG className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Telegram</h3>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed text-sm">
              Grow your channels and groups with targeted members. Increase post views and reactions to build a highly credible crypto or business community.
            </p>
            <ul className="space-y-2 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2"><Users className="w-4 h-4 text-sky-500" /> Channel Members</li>
              <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sky-500" /> Post Views & Reactions</li>
            </ul>
          </div>

          {/* Platform Box: YouTube */}
          <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(239,68,68,0.2)] hover:-translate-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-gradient-to-tr from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
              <YoutubeSVG className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">YouTube</h3>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed text-sm">
              Achieve monetization faster. Buy high-retention watch hours, permanent subscribers, and likes to rank your videos higher on search results.
            </p>
            <ul className="space-y-2 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-red-500" /> Watch Time Hours</li>
              <li className="flex items-center gap-2"><Users className="w-4 h-4 text-red-500" /> Real Subscribers</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Key Features (Why Choose Us) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 mb-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why Asan Spot?</h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            We provide a unique combination of speed, security, and affordability that you won't find anywhere else.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 p-10 rounded-[2rem] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)] group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-50 border border-white text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_8px_20px_rgba(37,99,235,0.15)] group-hover:scale-110 transition-transform">
              <Rocket className="w-10 h-10 drop-shadow-sm" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Instant Processing</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Our advanced API integrates directly with global suppliers. The moment your payment is confirmed, your order starts delivering instantly, 24/7.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-10 rounded-[2rem] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)] group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-50 border border-white text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_8px_20px_rgba(37,99,235,0.15)] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-10 h-10 drop-shadow-sm" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">100% Safe & Secure</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              We never ask for your account password. All transactions and data are encrypted, keeping your social media profiles entirely safe from bans.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-10 rounded-[2rem] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)] group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-50 border border-white text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_8px_20px_rgba(37,99,235,0.15)] group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bitcoin drop-shadow-sm"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Direct Payments</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Top up your balance or pay directly via HesabPay, AtomaPay, and Crypto without geographical limitations or high banking fees.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}