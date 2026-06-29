'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity, Loader2, Sparkles, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type SectionConfig = {
  title: string
  tableName: string
  description: string
  accentClass: string
  sectionSlug: string
}

export default function CategorySectionPage({ config }: { config: SectionConfig }) {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from(config.tableName)
        .select('id, name, slug, image_url, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (!error && data) {
        setPlatforms(data)
      } else {
        console.error(`Failed to load ${config.tableName}:`, error)
      }
      setLoading(false)
    }

    fetchPlatforms()
  }, [config.tableName])

  return (
    <main className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-white/50 px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" /> Back to Sectors
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-blue-50 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.05)] relative overflow-hidden mb-12">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr ${config.accentClass} opacity-10 rounded-bl-[150px] -z-10`} />
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className={`w-24 h-24 shrink-0 rounded-[2rem] bg-gradient-to-tr ${config.accentClass} text-white flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-50 text-slate-700`}>
                  {config.title}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">
                  <Activity className="w-3.5 h-3.5" /> Live Offers
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                {config.title}
              </h1>
              <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-2xl">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-black">Available Products</p>
              <h2 className="text-3xl font-black text-slate-900 mt-3">{platforms.length} active services</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
              Data Source: <span className="text-sky-600">{config.tableName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full rounded-[2rem] border border-blue-100 bg-white p-10 text-center text-slate-500">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
                <p className="mt-4 font-semibold">Loading products...</p>
              </div>
            ) : platforms.length === 0 ? (
              <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500">
                No active products found.
              </div>
            ) : (
              platforms.map((platform) => (
                <Link
                  key={platform.id}
                  href={`/services/${platform.slug}`}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-black">Service</p>
                      <h3 className="text-xl font-black text-slate-900">{platform.name}</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">View Order</div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-500 line-clamp-3">
                    Get fast access to {platform.name} services and complete your order through the dedicated service page.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-sm font-bold text-slate-700">
                    <span className="inline-flex items-center gap-2 text-sky-600">Order Page</span>
                    <Zap className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-slate-100 bg-slate-900 p-10 text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-3">Need help choosing a product?</h2>
          <p className="max-w-3xl text-slate-300 leading-7">
            Whether you are browsing AI tools, creative platforms, entertainment services, or VPN protection, every service links to the master order page so you can complete your purchase quickly.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/services" className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-black text-white transition hover:opacity-95">
              Browse All Services
            </Link>
            <span className="text-sm text-slate-400">Live data from {config.tableName}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
