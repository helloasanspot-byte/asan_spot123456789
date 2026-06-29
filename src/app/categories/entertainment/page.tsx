'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Gamepad2, ShoppingCart, Sparkles, Activity, ShieldAlert, PlayCircle, Headphones } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function EntertainmentPage() {
  const router = useRouter()
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        // مرحله ۱: پیدا کردن ID بخش Entertainment بر اساس slug
        const { data: sectionData, error: sectionError } = await supabase
          .from('smm_sections')
          .select('id')
          .eq('slug', 'entertainment') // یا 'entertainment-games' بستگی به نام دقیق اسلاگ شما در دیتابیس دارد
          .single()

        if (sectionError || !sectionData) {
          throw new Error("Section not found")
        }

        // مرحله ۲: خواندن پلتفرم‌ها از جدول smm_platforms (جدول اول)
        const { data, error } = await supabase
          .from('smm_platforms')
          .select('*')
          .eq('section_id', sectionData.id)
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (data && !error) {
          setPlatforms(data)
        }
      } catch (err) {
        console.error("Failed to fetch Entertainment platforms:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlatforms()
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* هاله نوری پس‌زمینه مخصوص بخش Entertainment */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors mb-4 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sectors
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase flex items-center justify-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-600 animate-pulse" /> Entertainment <span className="text-purple-600">& Media</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
            Maximize streams, views, and your gaming influence across top global platforms like YouTube, Twitch, and Spotify.
          </p>
        </div>

        {/* وضعیت بارگذاری */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : platforms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Platforms</h3>
            <p className="text-slate-500 text-sm">There are currently no active entertainment platforms in this sector.</p>
          </div>
        ) : (
          /* گراید کارت‌های محصولات */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform: any) => (
              <div 
                key={platform.id}
                className="group bg-white rounded-[2rem] p-6 border border-purple-50/50 shadow-[0_10px_30px_-15px_rgba(168,85,247,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* بخش تصویر/لوگو و وضعیت شبکه */}
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
                        <Gamepad2 className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100/50">
                      <Activity className="w-3 h-3 animate-pulse" /> Live Service
                    </span>
                  </div>

                  {/* عنوان و اسلاگ کالا */}
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mb-6">
                    Platform: /{platform.slug}
                  </p>

                  {/* ویژگی‌های فرضی مرتبط با مدیا و استریم */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <PlayCircle className="w-4 h-4 text-purple-500" /> High Retention Streams
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Headphones className="w-4 h-4 text-purple-500" /> Premium Global Audience
                    </div>
                  </div>
                </div>

                {/* دکمه سفارش و خرید: هدایت به صفحه داشبورد برای ثبت اردر جدید */}
                <button
                  onClick={() => router.push(`/dashboard/new-order?service=${platform.slug}`)}
                  className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> Create Order
                </button>
              </div>
            ))}
          </div>
        )}

        {/* فوتر صفحه */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-purple-50 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Premium engagement tools for digital artists and gamers
          </p>
        </div>

      </div>
    </div>
  )
}