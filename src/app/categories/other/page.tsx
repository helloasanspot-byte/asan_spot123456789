'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Box, ShoppingCart, Sparkles, CheckCircle2, Activity, ShieldAlert, Tv, Monitor } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function OtherServicesPage() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // آی‌آی‌دی اختصاصی بخش Other Services که در دیتابیس ساختیم
  const SECTION_ID = 'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a'

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        // خواندن پلتفرم‌ها (Netflix, Amazon و...) از جدول smm_platforms_2
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
        console.error("Failed to fetch Other platforms:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlatforms()
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* هاله نوری پس‌زمینه مخصوص بخش سایر خدمات */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-400/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors mb-4 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sectors
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase flex items-center justify-center gap-3">
            <Box className="w-8 h-8 text-slate-600 animate-pulse" /> Other <span className="text-slate-600">Services</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
            Explore our premium various automated accounts, worldwide streaming services and global activations.
          </p>
        </div>

        {/* وضعیت بارگذاری دیتابیس */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
          </div>
        ) : platforms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Platforms</h3>
            <p className="text-slate-500 text-sm">There are currently no active premium accounts configured in this cluster.</p>
          </div>
        ) : (
          /* گراید کارت‌های محصولات (Netflix, Amazon Premium) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform: any) => (
              <div 
                key={platform.id}
                className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_10px_30px_-15px_rgba(71,85,105,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(71,85,105,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* بخش تصویر/لوگو و وضعیت کلاینت */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden relative group-hover:scale-105 transition-transform">
                      {platform.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={platform.image_url} 
                          alt={platform.name} 
                          className="w-10 h-10 object-contain object-center"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <Box className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                      <Activity className="w-3 h-3 animate-pulse" /> Global Node
                    </span>
                  </div>

                  {/* عنوان و اسلاگ کالا */}
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-slate-600 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mb-6">
                    Cluster: /{platform.slug}
                  </p>

                  {/* ویژگی‌های فرضی مرتبط با اکانت‌ها */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Tv className="w-4 h-4 text-slate-500" /> Ultra HD Streaming Support
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Monitor className="w-4 h-4 text-slate-500" /> Premium Private Profile
                    </div>
                  </div>
                </div>

                {/* دکمه سفارش کاملاً اصلاح‌شده با تگ Link جهت هدایت مستقیم و بدون باگ به واتساپ اردر */}
                <Link
                  href={`/whatsapp-order/other?service=${platform.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-800 text-slate-700 hover:text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-sm mt-4"
                >
                  <ShoppingCart className="w-4 h-4" /> Order Premium
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* فوتر صفحه */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Authorized regional distributions and automated streaming nodes
          </p>
        </div>

      </div>
    </div>
  )
}