'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { 
  Loader2, Zap, DollarSign, Wallet, Link as LinkIcon, 
  Hash, ChevronDown, CheckCircle2, ArrowRight, Ticket, 
  Globe, Info, MessageCircle
} from 'lucide-react'

export default function LuxuryOneTimeServicesForm() {
  // --- دیتای اصلی از سوپابیس ---
  const [platforms, setPlatforms] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  
  // --- وضعیت انتخاب‌ها ---
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('idle')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('idle')
  const [quantity, setQuantity] = useState<string>('1000') // پیش‌فرض ۱۰۰۰
  const [link, setLink] = useState<string>('')
  
  // --- لودینگ‌ها ---
  const [loadingPlatforms, setLoadingPlatforms] = useState(true)
  const [loadingCategoryService, setLoadingCategoryService] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  // --- دراپ‌داون سفارشی پلتفرم ---
  const [isPlatformOpen, setIsPlatformOpen] = useState(false)

  // --- سیستم کوپن تخفیف ---
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' })

  // --- سیستم ارز زنده (USD to AFN) ---
  const [afnRate, setAfnRate] = useState<number>(68.5) // نرخ رزرو

  const WHATSAPP_NUMBER = '17575055153'
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`

  // ۱. دریافت نرخ ارز زنده از API جهانی
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        if (data && data.rates && data.rates.AFN) {
          setAfnRate(data.rates.AFN)
        }
      } catch (err) {
        console.error("Failed to fetch live currency rate.", err)
      }
    }
    fetchExchangeRate()
  }, [])

  // ۲. لود کردن تمام پلتفرم‌ها
  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoadingPlatforms(true)
      const { data, error } = await supabase
        .from('smm_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (data && !error) {
        setPlatforms(data)
      }
      setLoadingPlatforms(false)
    }
    fetchPlatforms()
  }, [])

  // ۳. لود کردن دسته‌بندی‌ها و سرویس‌ها بر اساس تغییر پلتفرم
  useEffect(() => {
    if (!selectedPlatform) return

    const fetchCategoriesAndServices = async () => {
      setLoadingCategoryService(true)
      setSelectedCategory('idle')
      setSelectedServiceId('idle')
      setDiscountPercent(0)
      setCouponStatus({ type: '', text: '' })
      setCouponCode('')
      
      const { data: cats } = await supabase
        .from('smm_categories')
        .select('*')
        .eq('platform_id', selectedPlatform.id)
        .eq('is_active', true)

      const { data: srvs } = await supabase
        .from('smm_services')
        .select('*, smm_categories!inner(platform_id)')
        .eq('smm_categories.platform_id', selectedPlatform.id)
        .eq('is_active', true)

      setCategories(cats || [])
      setServices(srvs || [])
      setLoadingCategoryService(false)
    }

    fetchCategoriesAndServices()
  }, [selectedPlatform])

  // اعمال فیلتر دسته‌بندی روی سرویس‌ها
  const servicesInSelectedCategory = services.filter(srv => srv.category_id === selectedCategory)
  const selectedService = services.find(srv => srv.id === selectedServiceId)

  // وقتی یک سرویس انتخاب می‌شود، تعداد را روی 1000 تنظیم کن (مگر اینکه پکیج فیکس باشد)
  useEffect(() => {
    if (selectedService) {
      if (selectedService.delivery_type === 'Package' || selectedService.is_subscription) {
         setQuantity('1'); // معمولاً پکیج‌ها تعدادشان 1 است
      } else {
         setQuantity('1000');
      }
    }
  }, [selectedServiceId, selectedService])

  // بررسی اینکه آیا این یک محصول فیکس (پکیج یا اشتراک) است؟
  const isFixedCharge = selectedService?.delivery_type === 'Package' || selectedService?.is_subscription || false;

  // محاسبات مالی
  const unitPriceUSD = selectedService ? selectedService.price : 0
  const rawCostUSD = isFixedCharge ? unitPriceUSD : (unitPriceUSD * (parseInt(quantity) || 0)) / 1000
  
  const discountAmountUSD = rawCostUSD * (discountPercent / 100) 
  const totalCostUSD = Math.max(0, rawCostUSD - discountAmountUSD)
  
  const totalCostAFN = totalCostUSD * afnRate
  const unitPriceAFN = unitPriceUSD * afnRate

  // بررسی وضعیت نهایی فرم
  const isFormComplete = selectedPlatform && selectedServiceId !== 'idle' && quantity && link

  // اعمال کد تخفیف
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponStatus({ type: '', text: '' })

    try {
      const { data: coupon, error } = await supabase
        .from('smm_coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .eq('is_active', true)
        .single()

      if (error || !coupon) {
        setCouponStatus({ type: 'error', text: 'Invalid or expired coupon code.' })
        setDiscountPercent(0)
      } else if (coupon.used_count >= coupon.max_uses) {
        setCouponStatus({ type: 'error', text: 'This coupon usage limit has been reached.' })
        setDiscountPercent(0)
      } else {
        setDiscountPercent(coupon.discount_percent)
        setCouponStatus({ type: 'success', text: `Coupon applied! You got ${coupon.discount_percent}% off.` })
      }
    } catch (err) {
      setCouponStatus({ type: 'error', text: 'Error checking coupon system.' })
    } finally {
      setCouponLoading(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I want to place an order.\n\nService: ${selectedService?.name || 'Unknown service'}\nPlatform: ${selectedPlatform?.name || 'Unknown platform'}\nQuantity: ${isFixedCharge ? 'Fixed package' : quantity}\nLink: ${link || 'Not provided'}\nTotal: $${totalCostUSD.toFixed(2)}\n\nPlease confirm the order and provide the next steps.`
  )

  const whatsappUrl = `${WHATSAPP_LINK}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-12 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* هاله گرادیانت لوکس پشت صفحه */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* هدر صفحه */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase flex items-center justify-center md:justify-start gap-3">
            <Zap className="w-8 h-8 text-indigo-600 animate-pulse" /> Configuration Node
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Deploy instant network infrastructure for social nodes. Automated routing enabled.
          </p>
        </div>

        {loadingPlatforms ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-indigo-600">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="font-bold text-sm animate-pulse">Initializing engine...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ========================================= */}
            {/* LEFT SIDE: Luxury Configuration Panel       */}
            {/* ========================================= */}
            <div className="w-full lg:w-3/5 bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] space-y-8">
              
              {/* ۱. انتخاب پلتفرم (دراپ‌داون سفارشی همراه عکس) */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  1. SELECT TARGET PLATFORM
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-sm font-bold text-slate-700 transition-all text-left shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {selectedPlatform ? (
                        <>
                          <img src={selectedPlatform.image_url} alt="" className="w-6 h-6 object-contain" />
                          <span className="text-slate-900 font-extrabold">{selectedPlatform.name}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-medium">Choose an operational network node...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isPlatformOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPlatformOpen && (
                    <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-2 shadow-2xl z-50 grid grid-cols-1 sm:grid-cols-2 gap-1 animate-fade-in">
                      {platforms.map((plat) => (
                        <button
                          key={plat.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlatform(plat)
                            setIsPlatformOpen(false)
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                            selectedPlatform?.id === plat.id
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          <img src={plat.image_url} alt="" className="w-5 h-5 object-contain" />
                          <span>{plat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ۲. انتخاب دسته‌بندی و پکیج سرویس */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  2. ROUTING PACKAGE TYPE
                </label>
                
                {loadingCategoryService ? (
                  <div className="flex items-center gap-3 text-slate-400 py-3 bg-slate-50 rounded-2xl px-6 border border-slate-100 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Syncing cloud packages...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* انتخاب دسته‌بندی */}
                    <div className="relative">
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        disabled={!selectedPlatform}
                        className="w-full px-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <option value="idle">First, filter deep categories...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* انتخاب سرویس نهایی */}
                    <div className="relative">
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <select
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        disabled={selectedCategory === 'idle'}
                        className="w-full px-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <option value="idle">Choose your target optimization cluster...</option>
                        {servicesInSelectedCategory.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            ID: {srv.supplier_service_id} — {srv.name} (${srv.price.toFixed(3)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* === بخش نمایش توضیحات (DESCRIPTION) === */}
              {selectedService && selectedService.description && (
                <div className="space-y-3 animate-fade-in-up mt-2">
                  <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-500" /> SERVICE DESCRIPTION
                  </label>
                  <div className="bg-[#F8FAFC] border border-slate-200/60 rounded-2xl p-5 relative overflow-hidden shadow-inner">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
                    <p className="text-[13px] font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>
                </div>
              )}

              {/* ۳. مقصد پیوند (لینک) */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  3. DESTINATION LINK
                </label>
                <div className="relative group">
                  <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter post link or Player ID..."
                    className="w-full pl-13 pr-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 focus:border-indigo-500 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* ۴. تعداد سفارش */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  4. NODE STRENGTH QUANTITY
                </label>
                <div className="relative group">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 1000"
                    disabled={isFixedCharge} // قفل شدن برای پکیج‌های تک‌عددی
                    className={`w-full pl-13 pr-6 py-4 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 transition-all shadow-sm ${
                      isFixedCharge 
                        ? 'bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  {isFixedCharge && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded uppercase tracking-wider">
                      FIXED PACKAGE
                    </div>
                  )}
                </div>
              </div>

              {/* ۵. فیلد مدرن کد تخفیف */}
              <div className="space-y-3 pt-2">
                <label className="block text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  5. CRYPTO COUPON CODE
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow group">
                    <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter promo or coupon code..."
                      className="w-full pl-13 pr-6 py-3.5 bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-slate-900 hover:bg-indigo-600 text-white font-extrabold px-6 rounded-2xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponStatus.text && (
                  <p className={`text-xs font-bold ${couponStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {couponStatus.text}
                  </p>
                )}
              </div>

              {isFormComplete && (
                <div className="pt-4 animate-fade-in">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black px-10 py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)] active:translate-y-0.5 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">Send Order to WhatsApp</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <p className="mt-3 text-center text-xs font-semibold text-slate-500">
                    After sending the message, our team will confirm your order on WhatsApp.
                  </p>
                </div>
              )}

            </div>

            {/* ========================================= */}
            {/* RIGHT SIDE: Deep Invoice Analytics (Dark)  */}
            {/* ========================================= */}
            <div className="w-full lg:w-2/5 bg-[#0A0D14] border border-[#161C2A] rounded-[2.5rem] p-8 shadow-2xl sticky top-28 space-y-8">
              
              {/* هدر باکس راست */}
              <div className="flex items-center justify-between bg-[#111622] p-5 rounded-2xl border border-[#1C2436]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    GOOGLE RATE MATRIX
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> 1 USD = {afnRate.toFixed(2)} AFN
                </span>
              </div>

              {/* محاسبات فاکتور */}
              <div className="pt-4">
                {!isFormComplete ? (
                  <div className="flex flex-col items-center text-center py-14 space-y-4">
                    <Zap className="w-12 h-12 text-[#182030] stroke-1" />
                    <span className="text-xs font-black uppercase text-[#182030] tracking-[0.25em]">
                      Awaiting Node Setup
                    </span>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* اطلاعات سرویس */}
                    <div className="bg-[#111622]/50 p-4 rounded-xl border border-[#1C2436]/50 flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cluster Name</p>
                        <p className="text-white text-xs font-bold mt-1 leading-relaxed">{selectedService?.name}</p>
                      </div>
                    </div>

                    {/* اطلاعات قیمت واحد */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#111622]/50 p-4 rounded-xl border border-[#1C2436]/50">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Rate (USD)</p>
                        <p className="text-white text-sm font-black mt-1">${unitPriceUSD.toFixed(3)}</p>
                      </div>
                      <div className="bg-[#111622]/50 p-4 rounded-xl border border-[#1C2436]/50">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Rate (AFN)</p>
                        <p className="text-indigo-300 text-sm font-black mt-1">؋{unitPriceAFN.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* تعداد فیلتر شده */}
                    <div className="bg-[#111622]/50 p-4 rounded-xl border border-[#1C2436]/50 flex justify-between items-center">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Units</p>
                        <p className="text-white text-sm font-black mt-0.5">
                          {isFixedCharge ? 'Fixed Package' : parseInt(quantity).toLocaleString()}
                        </p>
                      </div>
                      {!isFixedCharge && (
                        <span className="text-slate-500 font-bold text-xs">x{(parseInt(quantity)/1000).toFixed(2)} Base</span>
                      )}
                    </div>

                    {/* بخش کوپن فعال شده */}
                    {discountPercent > 0 && (
                      <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex justify-between items-center text-xs font-bold text-emerald-400">
                        <span>Coupon Discount Applied:</span>
                        <span>-{discountPercent}%</span>
                      </div>
                    )}

                    {/* قیمت نهایی نهایی هماهنگ شده */}
                    <div className="border-t border-[#1C2436] pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">TOTAL CHARGE</span>
                        <div className="text-right">
                          <p className="text-3xl font-black text-white flex items-center gap-1 justify-end">
                            <DollarSign className="w-6 h-6 text-indigo-400" /> {totalCostUSD.toFixed(2)}
                          </p>
                          <p className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1 justify-end">
                            ؋ {totalCostAFN.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  )
}