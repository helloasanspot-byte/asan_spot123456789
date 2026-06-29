'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BrainCircuit, ShoppingCart, Sparkles, CheckCircle2, Activity, ShieldAlert } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function AiToolsPage() {
  const router = useRouter()
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // آی‌دی اختصاصی بخش AI Tools در دیتابیس شما
  const SECTION_ID = 'ace862b4-a99f-4de4-a665-b5e24eaec5ed'

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        // خواندن پلتفرم‌ها از جدول smm_platforms_2 بر اساس section_id
        const { data, error } = await supabase
          .from('smm_platforms_2')
          .select('*')
          .eq('section_id', SECTION_ID)
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (data && !error) {
          setPlatforms(data)
        }
      } catch (err) {
        console.error("Failed to fetch AI platforms:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlatforms()
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* هاله نوری پس‌زمینه */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-4 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sectors
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase flex items-center justify-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-600 animate-pulse" /> AI <span className="text-blue-600">Tools</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
            Explore and deploy premium artificial intelligence nodes and automated operational systems.
          </p>
        </div>

        {/* وضعیت بارگذاری */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : platforms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Platforms</h3>
            <p className="text-slate-500 text-sm">There are currently no active automated clusters in this node.</p>
          </div>
        ) : (
          /* گراید کارت‌های محصولات */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform: any) => (
              <div 
                key={platform.id}
                className="group bg-white rounded-[2rem] p-6 border border-blue-50/50 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* بخش تصویر/لوگو و وضعیت */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden relative group-hover:scale-105 transition-transform">
                      {platform.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={platform.image_url} 
                          alt={platform.name} 
                          className="w-10 h-10 object-contain object-center"
                          onError={(e) => {
                            // در صورت خطای لود تصویر، آیکون دیفالت نمایش داده شود
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <BrainCircuit className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                      <Activity className="w-3 h-3 animate-pulse" /> Active Node
                    </span>
                  </div>

                  {/* عنوان و اسلاگ کالا */}
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mb-6">
                    ID Cluster: /{platform.slug}
                  </p>

                  {/* ویژگی‌های فرضی هماهنگ با سیستم برای زیبایی ظاهر کارت */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" /> Premium API Guaranteed
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" /> High-Speed Response Time
                    </div>
                  </div>
                </div>

                {/* دکمه سفارش و خرید: هدایت به صفحه اختصاصی واتساپ اردر همین بخش */}
                <button
                  onClick={() => router.push(`/whatsapp-order/ai-tools?service=${platform.slug}`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> Order Service
                </button>
              </div>
            ))}
          </div>
        )}

        {/* فوتر صفحه */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-blue-50 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> All operations are secured and end-to-end processed
          </p>
        </div>

      </div>
    </div>
  )
}