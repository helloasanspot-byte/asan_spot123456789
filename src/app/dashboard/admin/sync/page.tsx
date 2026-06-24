'use client'

import { useState } from 'react'
import { supabase } from '../../../../lib/supabase' // مسیر فایل سوپابیس را بر اساس محل قرارگیری این فایل تنظیم کن
import { RefreshCw, CheckCircle2, AlertCircle, Database, ArrowRight } from 'lucide-react'

export default function SyncServicesAsset() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  const handleSync = async () => {
    setLoading(true)
    setStatus({ type: '', text: '' })

    try {
      // صدا زدن Edge Function به صورت اصولی از طریق کلاینت سوپابیس
      const { data, error } = await supabase.functions.invoke('sync-services', {
        method: 'POST'
      })

      if (error) throw error

      if (data && data.success) {
        setStatus({
          type: 'success',
          text: data.message || 'All services, categories, and platforms have been synchronized successfully!'
        })
      } else {
        throw new Error(data?.error || 'Synchronization failed.')
      }

    } catch (err: any) {
      console.error('Sync Error:', err)
      setStatus({
        type: 'error',
        text: err.message || 'An error occurred while connecting to the sync server.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(79,70,229,0.08)] relative overflow-hidden">
      
      {/* دکوراسیون بک‌گراند داخل باکس */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Provider Sync Engine</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Fetch the latest live services from Famegrows. This will automatically update platforms, categories, and inject services with a 50% profit margin.
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={loading}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-slate-900 text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:bg-indigo-600 hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-900 cursor-pointer"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing Data...' : 'Launch Sync'}
        </button>
      </div>

      {/* نمایش پیام‌های وضعیت */}
      {status.type && (
        <div className="mt-6 animate-fade-in-up">
          {status.type === 'success' ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-emerald-900">Success</p>
                <p className="mt-0.5 text-emerald-700/90 font-medium">{status.text}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-red-900">Sync Failed</p>
                <p className="mt-0.5 text-red-700/90 font-medium">{status.text}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}