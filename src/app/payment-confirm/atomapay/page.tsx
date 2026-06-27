'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { 
  Loader2, UploadCloud, CheckCircle2, Copy, ArrowLeft, 
  Wallet, Info, Globe2, ScanLine, FileCheck, DollarSign, Activity
} from 'lucide-react'
import Link from 'next/link'

function AtomaPayCheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // سیستم قیمت زنده
  const [afnRate, setAfnRate] = useState<number>(68.5)

  // آدرس ولت AtomaPay شما (این آدرس را به ولت اصلی خودت تغییر بده)
  const ATOMAPAY_ADDRESS = "+93778894998"

  // دریافت نرخ ارز لایو
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        if (data && data.rates && data.rates.AFN) {
          setAfnRate(data.rates.AFN)
        }
      } catch (err) {
        console.error("Failed to fetch currency rate.", err)
      }
    }
    fetchExchangeRate()
  }, [])

  // دریافت اطلاعات سفارش
  useEffect(() => {
    if (!orderId) return
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('smm_orders')
        .select('*, smm_services(name)')
        .eq('id', orderId)
        .single()
      
      setOrder(data)
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  // کپی کردن آدرس ولت
  const copyToClipboard = () => {
    navigator.clipboard.writeText(ATOMAPAY_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ارسال فرم و آپلود رسید
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !orderId) return

    setUploading(true)
    const formData = new FormData()
    formData.append('receipt', file)
    formData.append('orderId', orderId)
    formData.append('gateway', 'AtomaPay') // تغییر به AtomaPay

    try {
      // توجه: درخواست به وب‌هوک AtomaPay ارسال می‌شود
      const res = await fetch('/api/webhook/atomapay', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/dashboard/orders'), 3500)
      } else {
        alert("Failed to submit receipt. Please try again or contact support.")
      }
    } catch (err) {
      alert("An error occurred while uploading. Please check your connection.")
    } finally {
      setUploading(false)
    }
  }

  // لودینگ اولیه
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F6FF]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-bold text-blue-900 uppercase tracking-widest animate-pulse">Connecting to Gateway...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F6FF] text-rose-500 font-bold">
        Error: Order not found or invalid link!
      </div>
    )
  }

  const totalUSD = Number(order.total_cost)
  const totalAFN = totalUSD * afnRate

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Glows (Blue Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-400/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.1)] overflow-hidden relative z-10 flex flex-col md:flex-row">
        
        {/* ============================================== */}
        {/* بخش راست/بالا: فاکتور و اطلاعات مالی (پس‌زمینه آبی) */}
        {/* ============================================== */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-700 to-blue-900 p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[50px] rounded-full" />
          
          <div>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white transition-colors mb-8 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm w-fit">
              <ArrowLeft className="w-4 h-4" /> Cancel Payment
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white leading-none">AtomaPay</h1>
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Premium Checkout</p>
              </div>
            </div>

            {/* نمایش مبلغ زنده */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Total Amount Due
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">${totalUSD.toFixed(3)}</span>
                <span className="text-blue-200 text-sm font-bold">USD</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-blue-200 font-medium text-sm">Live Exchange (AFN)</span>
                <span className="text-lg font-black text-emerald-300">؋ {totalAFN.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
              </div>
            </div>

            {/* آدرس ولت */}
            <div className="space-y-2">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Our AtomaPay Address</p>
              <div className="flex items-center justify-between bg-slate-900/40 border border-white/10 rounded-xl p-4">
                <span className="text-sm font-black text-white tracking-wider truncate mr-2">{ATOMAPAY_ADDRESS}</span>
                <button 
                  onClick={copyToClipboard} 
                  className={`p-2.5 rounded-lg transition-all flex items-center justify-center shrink-0 gap-2 text-xs font-bold ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="mt-8 bg-white p-3 rounded-2xl mx-auto w-3/4 max-w-[200px] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300">
            {/* عکس کیوآر کد AtomaPay - مطمئن شو عکسی با این نام داری */}
            <img 
              src="/atoma.jpeg" 
              alt="AtomaPay QR Code" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>

        {/* ============================================== */}
        {/* بخش چپ/پایین: آموزش و آپلود رسید (پس‌زمینه سفید) */}
        {/* ============================================== */}
        <div className="w-full md:w-3/5 p-8 md:p-12 bg-white flex flex-col justify-center relative">
          
          {success ? (
            <div className="text-center animate-fade-in-up py-10">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Receipt Verified!</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                Your payment receipt has been uploaded. Redirecting to your dashboard...
              </p>
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mt-8" />
            </div>
          ) : (
            <div className="space-y-8 h-full flex flex-col">
              
              {/* متن‌های راهنما (آبی و تمیز) */}
              <div className="space-y-6">
                
                {/* English */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                  <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Globe2 className="w-4 h-4 text-blue-500" /> Instructions
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed mb-2">
                    Please transfer the exact amount to our AtomaPay address. 
                    <span className="block mt-2 font-bold text-blue-800 bg-blue-100/50 px-2 py-1 rounded">
                      Important: Include Order ID (<span className="text-slate-900">{order.id.substring(0,8)}...</span>) in the <strong className="text-black">Memo/Description</strong> field.
                    </span>
                  </p>
                </div>

                {/* Persian */}
                <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 text-right" dir="rtl">
                  <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest flex items-center justify-end gap-2 mb-2" dir="ltr">
                    راهنمای پرداخت <Globe2 className="w-4 h-4 text-sky-500" />
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed mb-2">
                    لطفاً مبلغ دقیق را به آدرس AtomaPay ما ارسال کنید.
                    <span className="block mt-2 font-bold text-sky-800 bg-sky-100/50 px-2 py-1 rounded">
                      بسیار مهم: حتماً آیدی سفارش (<span className="text-slate-900" dir="ltr">{order.id.substring(0,8)}...</span>) را در بخش <strong className="text-black">Memo (یادداشت)</strong> بنویسید تا سفارشتان سریع تایید شود.
                    </span>
                  </p>
                </div>
              </div>

              {/* فرم آپلود عکس (دیزاین آبی) */}
              <form onSubmit={handleSubmit} className="mt-auto pt-4">
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-500" /> Upload Receipt Screenshot
                </label>
                
                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all group ${
                  file ? 'border-emerald-500 bg-emerald-50' : 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                    {file ? (
                      <>
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        <span className="font-bold text-sm text-emerald-700 truncate max-w-[250px]">{file.name}</span>
                        <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Tap to change file</span>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all">
                          <UploadCloud className="w-7 h-7 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                          <span className="font-black text-sm text-slate-700 block">Click to browse or drag file</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">JPG, PNG or PDF (Max 5MB)</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!file || uploading}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    'Confirm & Upload Receipt'
                  )}
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function PaymentConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F6FF]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
      </div>
    }>
      <AtomaPayCheckoutContent />
    </Suspense>
  )
}