'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, BrainCircuit, Camera, PlayCircle, 
  Send, Layers, ArrowRight, Activity, Zap, CheckCircle2,
  Box, Share2, Gamepad2, Cpu, Sparkles
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const WHATSAPP_LINK = 'https://wa.me/17575055153'

const getFallbackProducts = (slug: string): SpecialProductOption[] => {
  const fallbackMap: Record<string, SpecialProductOption[]> = {
    'ai-tools': [
      { name: 'ChatGPT', slug: 'chatgpt', description: 'چت‌بات چندمنظوره و تحلیل متن' },
      { name: 'Claude', slug: 'claude', description: 'تحلیل اسناد طولانی و برنامه‌نویسی' },
      { name: 'Google Gemini', slug: 'google-gemini', description: 'دستیار هوشمند گوگل و تحلیل داده' },
      { name: 'Midjourney', slug: 'midjourney', description: 'تولید تصاویر هنری با کیفیت بالا' },
      { name: 'DALL-E 3', slug: 'dall-e-3', description: 'تبدیل متن به تصویر' },
      { name: 'Perplexity', slug: 'perplexity', description: 'موتور جستجوی هوشمند مبتنی بر پاسخ' },
      { name: 'GitHub Copilot', slug: 'github-copilot', description: 'دستیار برنامه‌نویسی و کدنویسی' },
      { name: 'Notion AI', slug: 'notion-ai', description: 'مدیریت پروژه و یادداشت‌برداری هوشمند' },
      { name: 'Canva Magic Studio', slug: 'canva-magic-studio', description: 'طراحی گرافیک و ویرایش تصویر' },
      { name: 'ElevenLabs', slug: 'elevenlabs', description: 'تبدیل متن به گفتار (صداهای طبیعی)' },
      { name: 'Runway Gen-3', slug: 'runway-gen-3', description: 'تولید و ویرایش ویدیو از متن' },
      { name: 'Jasper', slug: 'jasper', description: 'تولید محتوای متنی بازاریابی' },
      { name: 'Writesonic', slug: 'writesonic', description: 'تولید محتوای سئو شده' },
      { name: 'Grammarly', slug: 'grammarly', description: 'ویرایشگر پیشرفته متون و نگارش' },
      { name: 'DeepL', slug: 'deepl', description: 'ترجمه دقیق متون' },
      { name: 'Fireflies.ai', slug: 'fireflies-ai', description: 'ضبط و خلاصه‌سازی جلسات آنلاین' },
      { name: 'Claude Artifacts', slug: 'claude-artifacts', description: 'مشاهده و ویرایش کدها و مستندات' },
      { name: 'Cursor', slug: 'cursor', description: 'ویرایشگر کد مبتنی بر هوش مصنوعی' },
      { name: 'Leonardo.ai', slug: 'leonardo-ai', description: 'طراحی و تولید دارایی‌های بصری' },
      { name: 'HeyGen', slug: 'heygen', description: 'تولید ویدیوهای آواتار سخنگو' },
      { name: 'QuillBot', slug: 'quillbot', description: 'پارافریز و بازنویسی متون' },
      { name: 'Otter.ai', slug: 'otter-ai', description: 'پیاده‌سازی صوت به متن' },
      { name: 'Gamma.app', slug: 'gamma-app', description: 'ساخت اسلاید و ارائه (Presentation)' },
      { name: 'Poe', slug: 'poe', description: 'دسترسی به مدل‌های مختلف هوش مصنوعی' },
      { name: 'Hugging Face', slug: 'hugging-face', description: 'پلتفرم مدل‌های متن‌باز' },
      { name: 'Sora', slug: 'sora', description: 'تولید ویدیوهای سینمایی (در حال توسعه)' },
      { name: 'WolframAlpha', slug: 'wolframalpha', description: 'حل مسائل پیچیده ریاضی و علمی' },
      { name: 'ChatPDF', slug: 'chatpdf', description: 'تحلیل و پرسش از فایل‌های PDF' },
      { name: 'Adobe Firefly', slug: 'adobe-firefly', description: 'ابزارهای هوش مصنوعی برای فتوشاپ' },
    ],
    'creator-tools': [
      { name: 'Runway Gen-3', slug: 'runway-gen-3', description: 'تولید و ویرایش ویدیوهای سینمایی' },
      { name: 'HeyGen', slug: 'heygen', description: 'تولید ویدیو از آواتار سخنگو' },
      { name: 'CapCut', slug: 'capcut', description: 'ویرایش ویدیوی آنلاین با ابزارهای هوش مصنوعی' },
      { name: 'InVideo AI', slug: 'invideo-ai', description: 'تبدیل متن به ویدیوی کامل' },
      { name: 'Descript', slug: 'descript', description: 'ادیت ویدیو از طریق ویرایش متن' },
      { name: 'Adobe Express', slug: 'adobe-express', description: 'ابزارهای سریع برای تولید و ویرایش ویدیو' },
      { name: 'Veed.io', slug: 'veed-io', description: 'پاک‌سازی نویز صدا و ادیت سریع ویدیوها' },
      { name: 'Luma Dream Machine', slug: 'luma-dream-machine', description: 'تولید ویدیوهای واقع‌گرایانه' },
      { name: 'Kling AI', slug: 'kling-ai', description: 'ابزار تولید ویدیوهای طولانی و دقیق' },
      { name: 'Pika Art', slug: 'pika-art', description: 'ویرایش و تغییر سبک ویدیوها' },
      { name: 'Adobe Firefly', slug: 'adobe-firefly', description: 'حذف و اضافه کردن اشیاء به عکس' },
      { name: 'Canva Magic Studio', slug: 'canva-magic-studio', description: 'ویرایش همه‌کاره تصاویر و ویدیو' },
      { name: 'Magnific AI', slug: 'magnific-ai', description: 'افزایش کیفیت تصاویر' },
      { name: 'Photoroom', slug: 'photoroom', description: 'حذف پس‌زمینه و جایگزینی حرفه‌ای' },
      { name: 'Leonardo.ai', slug: 'leonardo-ai', description: 'ویرایش دقیق عکس و افزودن عناصر گرافیکی' },
      { name: 'Remove.bg', slug: 'remove-bg', description: 'حذف پس‌زمینه با دقت بالا' },
      { name: 'ClipDrop', slug: 'clipdrop', description: 'ابزارهای نورپردازی مجدد و پاک‌کننده اشیاء' },
      { name: 'Upscayl', slug: 'upscayl', description: 'افزایش رزولوشن و کیفیت تصاویر' },
      { name: 'Fotor', slug: 'fotor', description: 'روتوش چهره و اصلاح نور' },
      { name: 'Pixlr AI', slug: 'pixlr-ai', description: 'ویرایشگر آنلاین مشابه فتوشاپ' },
      { name: 'CapCup', slug: 'capcup', description: 'نسخه اصلاح شده CapCut (کاربرساخته)' },
      { name: 'InVideo', slug: 'invideo', description: 'تبدیل سریع متن به ویدیو' },
      { name: 'Descript Studio', slug: 'descript-studio', description: 'پکیج پیشرفته ویرایش صوت و ویدیو' },
    ],
    'security-vpn': [
      { name: 'NordVPN', slug: 'nordvpn', description: 'Threat Protection و حفاظت در برابر فیشینگ' },
      { name: 'ExpressVPN', slug: 'expressvpn', description: 'پروتکل Lightway برای سرعت و ثبات بالا' },
      { name: 'Surfshark', slug: 'surfshark', description: 'استفاده نامحدود از دستگاه‌ها و حالت Camouflage' },
      { name: 'Proton VPN', slug: 'proton-vpn', description: 'امنیت بالا با زیرساخت سوئیسی' },
      { name: 'CyberGhost', slug: 'cyberghost', description: 'سرورهای تخصصی برای استریمینگ' },
      { name: 'IPVanish', slug: 'ipvanish', description: 'مدیریت پیشرفته ترافیک' },
      { name: 'PIA', slug: 'private-internet-access', description: 'تنظیمات دقیق و حرفه‌ای امنیت' },
      { name: 'Mullvad VPN', slug: 'mullvad-vpn', description: 'حریم خصوصی بالا و ناشناسی' },
      { name: 'Windscribe', slug: 'windscribe', description: 'مسدودکننده تبلیغات و ردیاب‌ها' },
      { name: 'PureVPN', slug: 'purevpn', description: 'سرورهای اختصاصی با IP ثابت' },
      { name: 'TunnelBear', slug: 'tunnelbear', description: 'رابط کاربری ساده و مناسب تازه‌کارها' },
      { name: 'Hotspot Shield', slug: 'hotspot-shield', description: 'سرعت بالا برای استریمینگ' },
      { name: 'Avast SecureLine', slug: 'avast-secureline', description: 'محافظت تقویت‌شده و آنتی‌مالور' },
      { name: 'Kaspersky VPN', slug: 'kaspersky-vpn', description: 'امنیت شناخته‌شده آنتی‌ویروس' },
      { name: 'Bitdefender VPN', slug: 'bitdefender-vpn', description: 'ترکیب امنیت و سرعت' },
      { name: 'Windscribe Pro', slug: 'windscribe-pro', description: 'نسخه حرفه‌ای با قابلیت‌های بیشتر' },
      { name: 'VyprVPN', slug: 'vyprvpn', description: 'پروتکل اختصاصی و سرورهای امن' },
      { name: 'SaferVPN', slug: 'safervpn', description: 'تمرکز بر سادگی و دسترسی' },
      { name: 'Hide.me', slug: 'hide-me', description: 'گزینه‌های پیکربندی پیشرفته' },
      { name: 'SecureLine Pro', slug: 'secureline-pro', description: 'پکیج امنیتی ویژه سازمانی' },
    ],
  }

  return fallbackMap[slug] || []
}

// --- Custom SVGs ---
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg>
)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)

// استایل هوشمند برای بخش‌ها (Hero Section)
const getSectionStyle = (slug: string) => {
  const styles: Record<string, any> = {
    'social-media': { icon: Share2, colorClass: 'from-pink-500 to-rose-600', textColor: 'text-pink-600', bgLight: 'bg-pink-50', desc: 'Boost your social presence across top networks with our premium engagement nodes.' },
    'ai-tools': { icon: BrainCircuit, colorClass: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bgLight: 'bg-blue-50', desc: 'Deploy advanced artificial intelligence nodes and automate your digital workflows.' },
    'entertainment-games': { icon: Gamepad2, colorClass: 'from-purple-500 to-fuchsia-600', textColor: 'text-purple-600', bgLight: 'bg-purple-50', desc: 'Maximize streams, views, and gaming influence on global entertainment platforms.' },
    'software-services': { icon: Cpu, colorClass: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', desc: 'Enhance your professional software tools, VPNs, and premium accounts.' },
  }
  return styles[slug] || { icon: Layers, colorClass: 'from-slate-600 to-slate-800', textColor: 'text-slate-600', bgLight: 'bg-slate-50', desc: 'Explore our premium operational clusters.' }
}

// استایل هوشمند برای آیکون‌های Fallback و بک‌گراند کارت‌ها
const getPlatformStyle = (slug: string) => {
  const styles: Record<string, any> = {
    'instagram': { icon: Camera, colorClass: 'from-pink-500 to-rose-600', bgGlow: 'bg-pink-500/10' },
    'tiktok': { icon: TiktokIcon, colorClass: 'from-slate-800 to-slate-900', bgGlow: 'bg-slate-900/5' },
    'youtube': { icon: PlayCircle, colorClass: 'from-red-500 to-red-600', bgGlow: 'bg-red-500/10' },
    'telegram': { icon: Send, colorClass: 'from-sky-400 to-blue-500', bgGlow: 'bg-sky-500/10' },
    'facebook': { icon: FacebookIcon, colorClass: 'from-blue-600 to-blue-800', bgGlow: 'bg-blue-600/10' },
    'twitter-x': { icon: Layers, colorClass: 'from-slate-700 to-slate-900', bgGlow: 'bg-slate-700/10' },
    'spotify': { icon: Activity, colorClass: 'from-green-500 to-emerald-600', bgGlow: 'bg-green-500/10' },
  }
  return styles[slug] || { icon: Box, colorClass: 'from-indigo-500 to-purple-600', bgGlow: 'bg-indigo-500/10' }
}

type SpecialProductOption = {
  name: string
  slug: string
  description: string
  image_url?: string | null
}

export default function CategoryDetailsPage() {
  const params = useParams()
  const sectionSlug = params.id as string
  
  const [sectionData, setSectionData] = useState<any>(null)
  const [platforms, setPlatforms] = useState<any[]>([])
  const [specialProducts, setSpecialProducts] = useState<SpecialProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [specialProductsLoading, setSpecialProductsLoading] = useState(false)

  const specialSectionSlugs = ['ai-tools', 'creator-tools', 'security-vpn']
  const isSpecialSection = specialSectionSlugs.includes(sectionSlug)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('smm_sections')
          .select(`
            id, name, slug, is_active,
            smm_platforms ( id, name, slug, image_url, is_active )
          `)
          .eq('slug', sectionSlug)
          .eq('is_active', true)
          .single()

        if (data && !error) {
          setSectionData(data)
          const activePlatforms = (data.smm_platforms || [])
            .filter((p: any) => p.is_active)
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
          setPlatforms(activePlatforms)
        }
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchSpecialProducts = async () => {
      if (!isSpecialSection) {
        setSpecialProducts([])
        return
      }

      setSpecialProductsLoading(true)

      try {
        const tableName = 'smm_platforms_2'
        const { data, error } = await supabase
          .from(tableName)
          .select('id, name, slug, image_url, is_active')
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (!error && data) {
          const keywordMap: Record<string, string[]> = {
            'ai-tools': ['chatgpt', 'claude', 'gemini', 'grok', 'copilot', 'midjourney', 'perplexity', 'openai', 'anthropic', 'ai', 'firefly', 'notion', 'jasper', 'writesonic', 'grammarly', 'deepl', 'gamma', 'poe', 'hugging', 'sora', 'wolfram', 'chatpdf'],
            'creator-tools': ['runway', 'heygen', 'capcut', 'invideo', 'descript', 'adobe', 'veed', 'luma', 'kling', 'pika', 'canva', 'magnific', 'photoroom', 'leonardo', 'remove', 'clipdrop', 'upscayl', 'fotor', 'pixlr', 'capcup'],
            'security-vpn': ['vpn', 'nord', 'express', 'surfshark', 'proton', 'cyberghost', 'ipvanish', 'private', 'mullvad', 'windscribe', 'purevpn', 'tunnelbear', 'hotspot', 'avast', 'kaspersky', 'bitdefender', 'vypr', 'safer', 'hide', 'secureline'],
          }

          const keywords = keywordMap[sectionSlug] || []
          const matched = data.filter((platform: any) => {
            const haystack = `${platform.name || ''} ${platform.slug || ''}`.toLowerCase()
            return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
          })

          const mappedProducts = (matched.length > 0 ? matched : data).map((platform: any) => ({
            name: platform.name,
            slug: platform.slug,
            description: `Purchase ${platform.name} directly through the service page.`,
            image_url: platform.image_url,
          }))

          setSpecialProducts(mappedProducts)
        } else {
          setSpecialProducts(getFallbackProducts(sectionSlug))
        }
      } catch (err) {
        console.error('Special products fetch error:', err)
        setSpecialProducts(getFallbackProducts(sectionSlug))
      } finally {
        setSpecialProductsLoading(false)
      }
    }
    
    if (sectionSlug) {
      fetchData()
      fetchSpecialProducts()
    }
  }, [sectionSlug, isSpecialSection])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!sectionData) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Section Not Found</h1>
        <Link href="/categories" className="text-blue-600 font-bold hover:underline">Return to Categories</Link>
      </div>
    )
  }

  const sectionStyle = getSectionStyle(sectionData.slug)
  const SectionIcon = sectionStyle.icon
  const isSpecialSectionForRender = specialSectionSlugs.includes(sectionData.slug)
  const sectionTitle = isSpecialSectionForRender
    ? sectionData.slug === 'ai-tools'
      ? 'Choose an AI Service'
      : sectionData.slug === 'creator-tools'
        ? 'Choose a Creator Tool'
        : 'Choose a Security & VPN Tool'
    : 'Supported Platforms'

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* دکمه بازگشت */}
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-white/50 px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" /> Back to Sectors
          </Link>
        </div>

        {/* ================= HERO SECTION ================= */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-blue-50 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.05)] relative overflow-hidden mb-12">
          <div className={`absolute top-0 right-0 w-64 h-64 ${sectionStyle.bgLight} rounded-bl-[150px] -z-10`} />
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className={`w-24 h-24 shrink-0 bg-gradient-to-tr ${sectionStyle.colorClass} text-white rounded-[2rem] flex items-center justify-center shadow-lg`}>
              <SectionIcon className="w-12 h-12" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg ${sectionStyle.bgLight} ${sectionStyle.textColor}`}>
                  {platforms.length} Platforms Available
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">
                  <Activity className="w-3.5 h-3.5" /> Sector Online
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                {sectionData.name}
              </h1>
              <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-2xl">
                {sectionStyle.desc} Select a specific platform below to explore available services, automated nodes, and pricing details.
              </p>
            </div>
          </div>
        </div>

        {/* ================= PLATFORMS GRID ================= */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" /> {sectionTitle}
          </h2>

          {isSpecialSectionForRender ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialProductsLoading ? (
                <div className="col-span-full rounded-[2rem] border border-blue-100 bg-white p-8 text-center text-slate-500">
                  Loading products...
                </div>
              ) : specialProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/services/${product.slug}`}
                  className="group rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(37,99,235,0.2)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-3 text-white shadow-md">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      WhatsApp Purchase
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    {product.image_url ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-2">
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                    ) : null}
                    <h3 className="text-xl font-black text-slate-900">{product.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>

                  <div className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600">
                    Go to Service Page
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : platforms.length === 0 ? (
            <div className="bg-white p-8 rounded-[2rem] text-center border border-slate-100">
              <p className="text-slate-500 font-bold">No active platforms found in this sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const style = getPlatformStyle(platform.slug)
                const FallbackIcon = style.icon

                return (
                  <div 
                    key={platform.id}
                    className="group bg-white rounded-[2rem] p-6 border border-blue-50 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] ${style.bgGlow} -z-10 transition-transform duration-500 group-hover:scale-110`} />
                    
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        
                        {/* 🟢 نمایش لوگوی دیتابیس بدون از بین بردن رنگ */}
                        {platform.image_url ? (
                          <div className="w-14 h-14 shrink-0 bg-slate-50/80 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 p-2.5">
                            <img 
                              src={platform.image_url} 
                              alt={platform.name} 
                              className="w-full h-full object-contain drop-shadow-sm" 
                            />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 shrink-0 bg-gradient-to-tr ${style.colorClass} text-white rounded-2xl flex items-center justify-center shadow-md`}>
                            <FallbackIcon className="w-6 h-6" />
                          </div>
                        )}

                        <div>
                          <h3 className="text-lg font-black text-slate-900">{platform.name}</h3>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">
                        Deploy premium optimization services specifically designed for {platform.name}.
                      </p>
                    </div>

                    <Link 
                      href={`/services/${platform.slug}`}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors border border-slate-200/60"
                    >
                      Order {platform.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ================= CALL TO ACTION (CTA) ================= */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center mt-8">
          <div className={`absolute top-[-50%] right-[-10%] w-96 h-96 bg-gradient-to-tr ${sectionStyle.colorClass} rounded-full blur-[120px] opacity-30 pointer-events-none`} />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Scale Your Influence?</h2>
            <p className="text-slate-400 font-medium text-base mb-10">
              Create a free account today to access our full catalog of {sectionData.name} services, automated APIs, and wholesale pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/user/signup"
                className={`flex items-center justify-center gap-2 bg-gradient-to-r ${sectionStyle.colorClass} text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/user/login"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 border border-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}