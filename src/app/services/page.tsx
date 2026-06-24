'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase' // مسیر فایل سوپابیس را چک کن
import { Loader2, Zap, Search, Activity, Package, CheckCircle2, ChevronRight, Hash, DollarSign } from 'lucide-react'

export default function ServicesCatalogPage() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  
  const [loadingPlatforms, setLoadingPlatforms] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')

  // پلتفرم‌های نامرتبط که نمی‌خواهیم در کاتالوگ باشند
  const excludedPlatforms = ['Adobe', 'Canva', 'Windows', 'Shopee', 'OTT Streaming', 'Mobile', 'Best', 'New', 'Latest', 'Private', 'Provider'];

  // ۱. لود کردن پلتفرم‌ها در ابتدای ورود به صفحه
  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoadingPlatforms(true)
      const { data, error } = await supabase
        .from('smm_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (data && !error) {
        const filteredPlats = data.filter(p => !excludedPlatforms.includes(p.name))
        setPlatforms(filteredPlats)
        if (filteredPlats.length > 0) {
          setSelectedPlatform(filteredPlats[0]) // انتخاب اولین پلتفرم به صورت پیش‌فرض
        }
      }
      setLoadingPlatforms(false)
    }
    fetchPlatforms()
  }, [])

  // ۲. لود کردن دسته‌بندی‌ها وقتی پلتفرمی انتخاب می‌شود
  useEffect(() => {
    if (!selectedPlatform) return

    const fetchCategories = async () => {
      setLoadingCategories(true)
      setSelectedCategory(null)
      setServices([])
      
      const { data: cats } = await supabase
        .from('smm_categories')
        .select('*')
        .eq('platform_id', selectedPlatform.id)
        .eq('is_active', true)
        .order('name', { ascending: true })

      setCategories(cats || [])
      
      // انتخاب اتوماتیک اولین دسته‌بندی برای اینکه صفحه خالی نماند
      if (cats && cats.length > 0) {
        setSelectedCategory(cats[0])
      }
      setLoadingCategories(false)
    }

    fetchCategories()
  }, [selectedPlatform])

  // ۳. لود کردن سرویس‌ها وقتی دسته‌بندی انتخاب می‌شود
  useEffect(() => {
    if (!selectedCategory) return

    const fetchServices = async () => {
      setLoadingServices(true)
      const { data: srvs } = await supabase
        .from('smm_services')
        .select('*')
        .eq('category_id', selectedCategory.id)
        .eq('is_active', true)
        .order('price', { ascending: true })

      setServices(srvs || [])
      setLoadingServices(false)
    }

    fetchServices()
  }, [selectedCategory])

  // فیلتر کردن سرویس‌ها بر اساس جستجو
  const filteredServices = services.filter(srv => 
    srv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    srv.supplier_service_id.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 pt-32 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* هاله گرادیانت بک‌گراند */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* هدر صفحه کاتالوگ */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase flex items-center justify-center gap-3">
            Service <span className="text-indigo-600">Catalog</span>
          </h1>
          <p className="text-base text-slate-500 font-medium mt-4 leading-relaxed">
            Explore our premium social nodes. Live pricing, minimum limits, and instant delivery specs across all global networks.
          </p>
        </div>

        {loadingPlatforms ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* ========================================= */}
            {/* STEP 1: PLATFORMS (Horizontal Scroll Row)   */}
            {/* ========================================= */}
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-4 shadow-sm">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 mask-image">
                {platforms.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat)}
                    className={`flex items-center gap-2.5 shrink-0 px-5 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
                      selectedPlatform?.id === plat.id
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-y-0'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <img 
                      src={plat.image_url} 
                      alt={plat.name} 
                      className={`w-5 h-5 object-contain ${selectedPlatform?.id === plat.id ? 'brightness-0 invert' : ''}`} 
                    />
                    {plat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================= */}
            {/* CONTENT GRID (Left: Categories, Right: Services) */}
            {/* ========================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* STEP 2: CATEGORIES (Sidebar) */}
              <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col h-[600px]">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800">Categories</h3>
                </div>

                {loadingCategories ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                          selectedCategory?.id === cat.id
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="line-clamp-2 pr-2">{cat.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${
                          selectedCategory?.id === cat.id ? 'text-indigo-600' : 'text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'
                        }`} />
                      </button>
                    ))}
                    {categories.length === 0 && (
                      <p className="text-xs text-slate-400 font-medium text-center py-10">No categories found.</p>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: SERVICES TABLE (Main Content) */}
              <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-[600px]">
                
                {/* Header of Table Area with Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900 line-clamp-1">
                        {selectedCategory ? selectedCategory.name : 'Select a Category'}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {filteredServices.length} Active Nodes
                      </p>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                  {loadingServices ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                      <Search className="w-10 h-10 opacity-20" />
                      <p className="text-sm font-bold">No active services found in this category.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                        <tr>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">ID</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Limits</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rate / 1k</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredServices.map((srv) => (
                          <tr key={srv.id} className="hover:bg-indigo-50/30 transition-colors group">
                            
                            <td className="py-4 px-6 align-middle">
                              <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black bg-slate-100 text-slate-500 rounded-md border border-slate-200 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                {srv.supplier_service_id}
                              </span>
                            </td>

                            <td className="py-4 px-6 align-middle">
                              <div className="text-xs font-black text-slate-800 leading-snug">
                                {srv.name}
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {srv.delivery_type && (
                                  <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded">
                                    Type: {srv.delivery_type}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-6 align-middle text-center">
                              <div className="inline-flex flex-col items-center justify-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                  Min: {srv.min_quantity?.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                  Max: {srv.max_quantity?.toLocaleString()}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6 align-middle text-right">
                              <div className="text-sm font-black text-indigo-600 flex items-center justify-end">
                                ${srv.price.toFixed(3)}
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* استایل‌های اختصاصی برای اسکرول‌بار ظریف */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        .mask-image { mask-image: linear-gradient(to right, black 90%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%); }
      ` }} />
    </div>
  )
}