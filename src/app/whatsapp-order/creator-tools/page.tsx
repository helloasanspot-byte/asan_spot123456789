'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, MessageCircle, Globe, Camera, 
  Mail, Sparkles, ShieldCheck, Layers
} from 'lucide-react'

export default function WhatsappOrderCreatorTools() {
  const searchParams = useSearchParams()
  const serviceSlug = searchParams.get('service') || 'Creator Tool'
  const [lang, setLang] = useState<'fa' | 'en'>('fa')

  // اطلاعات ارتباطی شما
  const whatsappNumber = '17575055153'
  const facebookUrl = 'https://www.facebook.com/share/1CzPunwAvr/?mibextid=wwXIfr'
  const instagramUrl = 'https://www.instagram.com/asan_spot?utm_source=qr'
  const emailAddress = 'hello.asanspot@gmail.com'

  // متن‌های داینامیک پیام واتساپ
  const whatsappMessageEn = `Hello Asan Spot, I would like to order the Creator Tool: [ ${serviceSlug.toUpperCase()} ]. Please guide me on the payment and activation process.`
  const whatsappMessageFa = `سلام آسان اسپات، من مایل هستم ابزار تولید محتوا: [ ${serviceSlug.toUpperCase()} ] را سفارش دهم. لطفاً مرا در مورد مراحل پرداخت و فعال‌سازی راهنمایی کنید.`

  const encodedMessage = encodeURIComponent(lang === 'en' ? whatsappMessageEn : whatsappMessageFa)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

  // ترجمه محتوای صفحه
  const content = {
    fa: {
      title: 'تکمیل سفارش سرویس',
      subtitle: 'سفارش آنلاین و فعال‌سازی آنی استودیو',
      selectedService: 'ابزار انتخاب شده شما:',
      btnWhatsapp: 'اتصال به واتساپ و ثبت سفارش',
      otherWays: 'سایر راه‌های ارتباطی و پشتیبانی آسان اسپات',
      notice: 'پس از کلیک، متن سفارش به صورت خودکار در واتساپ آماده می‌شود. کافیست آن را ارسال کنید.',
      features: ['پشتیبانی ۲۴ ساعته', 'تحویل فوری اکانت', 'پرداخت کاملاً امن'],
      backBtn: 'بازگشت به بخش‌ها'
    },
    en: {
      title: 'Complete Your Order',
      subtitle: 'Online Ordering & Instant Studio Activation',
      selectedService: 'Your Selected Tool:',
      btnWhatsapp: 'Connect to WhatsApp & Order',
      otherWays: 'Other Ways to Connect with Asan Spot',
      notice: 'After clicking, the order message will be prepared automatically. Just press send.',
      features: ['24/7 Premium Support', 'Instant Delivery', 'Secured Payment'],
      backBtn: 'Back to Sectors'
    }
  }

  const t = content[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF2] to-[#F8FAFC] py-12 px-6 relative overflow-hidden font-sans flex flex-col justify-center items-center">
      
      {/* هاله‌های نوری پس‌زمینه (تم نارنجی/کهربایی مخصوص Creator Tools) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-400/15 blur-[120px] rounded-full pointer-events-none" />

      {/* دکمه 3D تغییر زبان */}
      <button 
        onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
        className="absolute top-6 right-6 bg-gradient-to-b from-white to-orange-50 text-orange-700 font-extrabold px-5 py-2.5 rounded-xl shadow-[0_4px_0_#FDE68A,0_10px_15px_-3px_rgba(245,158,11,0.2)] border border-orange-100 flex items-center gap-2 text-sm z-50 transition-all active:translate-y-[4px] active:shadow-[0_0px_0_#FDE68A,0_0px_0_rgba(245,158,11,0.2)]"
      >
        <Globe className="w-4 h-4 text-orange-600" />
        {lang === 'fa' ? 'English' : 'فارسی'}
      </button>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* دکمه 3D بازگشت */}
        <div className="mb-8 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-5 py-2.5 rounded-xl shadow-[0_4px_0_#E2E8F0] border border-slate-200 transition-all active:translate-y-[4px] active:shadow-[0_0px_0_#E2E8F0] hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4" /> {t.backBtn}
          </Link>
        </div>

        {/* کارت اصلی با افکت شیشه‌ای و 3D */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border-2 border-white shadow-[0_30px_60px_-15px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(255,255,255,1)] relative">
          
          {/* هدر کارت */}
          <div className="text-center mb-8 relative">
            {/* آیکون 3D هدر با رنگ نارنجی */}
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_10px_25px_rgba(245,158,11,0.4),inset_0_2px_0_rgba(255,255,255,0.4)] border border-orange-400 transform -translate-y-4">
              <Layers className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
              {t.title}
            </h1>
            <p className="text-orange-500/80 text-sm font-bold uppercase tracking-widest">
              {t.subtitle}
            </p>
          </div>

          {/* باکس نمایش سرویس (3D Inset Effect) */}
          <div className="bg-slate-50/50 rounded-2xl p-5 mb-8 text-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.04)] border border-slate-200/60">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              {t.selectedService}
            </span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 font-mono inline-block drop-shadow-sm">
              {serviceSlug.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* دکمه اصلی اتصال به واتساپ (Ultra 3D Button - سبز رنگ برای حفظ هویت واتساپ) */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-b from-[#25D366] to-[#1EAA52] text-white font-black py-4 md:py-5 rounded-2xl text-lg tracking-wide transition-all shadow-[0_8px_0_#188A42,0_15px_20px_rgba(37,211,102,0.4),inset_0_2px_0_rgba(255,255,255,0.3)] active:shadow-[0_0px_0_#188A42,0_0px_0_rgba(37,211,102,0.4),inset_0_2px_0_rgba(255,255,255,0.3)] active:translate-y-[8px] border border-[#1EAA52]"
          >
            <MessageCircle className="w-7 h-7 text-white drop-shadow-md" />
            <span className="drop-shadow-md">{t.btnWhatsapp}</span>
          </a>
          <p className="text-[11px] text-slate-400 text-center mt-6 font-semibold px-4">
            * {t.notice}
          </p>

          {/* ویژگی‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 pt-8 border-t border-orange-50">
            {t.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-orange-700 justify-center bg-gradient-to-b from-orange-50 to-white py-3 rounded-xl border border-orange-100 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-orange-500 drop-shadow-sm flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          {/* بخش سایر راه‌های ارتباطی */}
          <div className="pt-6 border-t border-orange-50">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">
              {t.otherWays}
            </h3>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {/* دکمه 3D فیسبوک */}
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 group shadow-[0_5px_0_#E2E8F0] active:shadow-[0_0px_0_#E2E8F0] active:translate-y-[5px] transition-all"
              >
                <Globe className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform drop-shadow-sm" />
                <span className="text-[11px] font-black">Facebook</span>
              </a>

              {/* دکمه 3D اینستاگرام */}
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-600 hover:text-pink-600 group shadow-[0_5px_0_#E2E8F0] active:shadow-[0_0px_0_#E2E8F0] active:translate-y-[5px] transition-all"
              >
                <Camera className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform drop-shadow-sm" />
                <span className="text-[11px] font-black">Instagram</span>
              </a>

              {/* دکمه 3D ایمیل */}
              <a 
                href={`mailto:${emailAddress}`} 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-600 hover:text-red-500 group shadow-[0_5px_0_#E2E8F0] active:shadow-[0_0px_0_#E2E8F0] active:translate-y-[5px] transition-all"
              >
                <Mail className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform drop-shadow-sm" />
                <span className="text-[11px] font-black">Email</span>
              </a>
            </div>
          </div>

        </div>

        {/* هشدارهای پایین صفحه */}
        <div className="mt-8 text-center bg-white/50 backdrop-blur-md py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 border border-white shadow-sm mx-auto w-full md:w-auto">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <p className="text-[11px] font-black text-orange-800 uppercase tracking-widest">
            Powered by Asan Spot Support Cluster
          </p>
        </div>

      </div>
    </div>
  )
}