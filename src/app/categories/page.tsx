'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, BrainCircuit, Share2, Gamepad2, 
  Cpu, Layers, ArrowRight, Activity, Zap, Sparkles, Box
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// استایل‌ها و تنظیمات هوشمند منطبق بر Slug پوشه‌های جدید شما
const getSectionStyle = (slug: string) => {
  const styles: Record<string, any> = {
    // --- بخش‌های مربوط به جدول smm_platforms ---
    'social-media-services': { 
      icon: Share2, 
      colorClass: 'from-pink-500 to-rose-600', 
      textColor: 'text-pink-600', 
      bgGlow: 'bg-pink-500/10',
      desc: 'Boost your social presence across top networks like Instagram, TikTok, and Twitter.',
      isTable2: false 
    },
    'entertainment': { 
      icon: Gamepad2, 
      colorClass: 'from-purple-500 to-fuchsia-600', 
      textColor: 'text-purple-600', 
      bgGlow: 'bg-purple-500/10',
      desc: 'Maximize streams, views, and gaming influence on YouTube, Twitch, and Spotify.',
      isTable2: false
    },

    // --- بخش‌های مربوط به جدول smm_platforms_2 ---
    'ai-tools': { 
      icon: BrainCircuit, 
      colorClass: 'from-blue-500 to-indigo-600', 
      textColor: 'text-blue-600', 
      bgGlow: 'bg-blue-500/10',
      desc: 'Deploy advanced artificial intelligence nodes and automate your digital workflows.',
      isTable2: true 
    },
    'creator-tools': { 
      icon: Layers, 
      colorClass: 'from-amber-500 to-orange-600', 
      textColor: 'text-amber-600', 
      bgGlow: 'bg-amber-500/10',
      desc: 'Empower your content creation workflow with intelligent video and image editors.',
      isTable2: true
    },
    'security-vpn': { 
      icon: Cpu, 
      colorClass: 'from-emerald-500 to-teal-600', 
      textColor: 'text-emerald-600', 
      bgGlow: 'bg-emerald-500/10',
      desc: 'Enhance your professional software tools, VPNs, and premium accounts.',
      isTable2: true
    },
  }

  return styles[slug] || { 
    icon: Box, 
    colorClass: 'from-slate-600 to-slate-800', 
    textColor: 'text-slate-600', 
    bgGlow: 'bg-slate-500/10',
    desc: 'Explore our premium automated services and operational clusters.',
    isTable2: false
  }
}

export default function CategoriesPage() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        // خواندن هم‌زمان بخش‌ها همراه با شمارش پلتفرم‌ها برای نمایش روی کارت‌ها
        const { data, error } = await supabase
          .from('smm_sections')
          .select(`
            id, 
            name, 
            slug, 
            is_active,
            smm_platforms ( id ),
            smm_platforms_2 ( id )
          `)
          .eq('is_active', true)
        
        if (data && !error) {
          setSections(data)
        }
      } catch (err) {
        console.error("Failed to fetch sections", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-4 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase flex items-center justify-center gap-3">
            <Layers className="w-8 h-8 text-blue-600 animate-pulse" /> Service <span className="text-blue-600">Sectors</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
            Choose a main sector to explore its dedicated platforms and specialized services.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section: any) => {
              const style = getSectionStyle(section.slug)
              const Icon = style.icon

              // مچ کردن تعداد کانکشن‌ها بر اساس جدول درست دیتابیس برای نمایش دقیق دیتا
              const platformsCount = style.isTable2 
                ? (section.smm_platforms_2?.length || 0)
                : (section.smm_platforms?.length || 0)

              // حالا هدایت مستقیم به فولدرهای داخلی اختصاصی که در مسیر categories ساخته‌اید انجام می‌شود
              const targetPath = `/categories/${section.slug}`

              return (
                <div 
                  key={section.id}
                  className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-blue-50/50 shadow-[0_15px_40px_-15px_rgba(37,99,235,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 rounded-bl-[120px] ${style.bgGlow} -z-10 transition-transform duration-700 group-hover:scale-125`} />

                  <div>
                    {/* بخش بالایی کارت */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-tr ${style.colorClass} text-white rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 ${style.textColor}`}>
                        {style.isTable2 ? 'Core Service' : 'SMM Market'}
                      </span>
                    </div>

                    {/* عنوان بخش */}
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                      {style.desc}
                    </p>
                  </div>

                  {/* بخش پایینی: جزئیات عددی و دکمه ورود */}
                  <div className="pt-6 border-t border-slate-50 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Platforms</p>
                        <p className="text-slate-800 font-extrabold text-lg flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-emerald-500" /> {platformsCount} Connected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Server Status</p>
                        <p className="text-slate-800 font-extrabold text-lg flex items-center justify-end gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Online
                        </p>
                      </div>
                    </div>

                    {/* لینک دهی مستقیم به صفحات مجزای شما */}
                    <Link 
                      href={targetPath}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 group-hover:shadow-md"
                    >
                      Explore {section.name} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>

                </div>
              )
            })}
          </div>
        )}

        {/* بخش راهنمایی پایین */}
        <div className="mt-12 bg-white rounded-3xl p-6 border border-blue-50 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Fully synchronized with isolated sub-pages routing
          </p>
        </div>

      </div>
    </div>
  )
}