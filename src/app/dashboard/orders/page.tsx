'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { 
  Loader2, CheckCircle2, Clock, Search, Filter, 
  ArrowLeft, XCircle, ExternalLink, Package, Activity, Link as LinkIcon
} from 'lucide-react'

// اینترفیس سفارشات
interface DbOrder {
  id: string
  quantity: number
  total_cost: number
  status: string
  created_at: string
  link: string
  smm_services?: { name: string }[]
}

export default function LuxuryOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  
  // استیت‌های فیلتر و جستجو
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: ordersData, error } = await supabase
          .from('smm_orders')
          .select('id, quantity, total_cost, status, created_at, link, smm_services(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(ordersData || [])
      } catch (err) {
        console.error("Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // فرمت تاریخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    })
  }

  // کوتاه کردن آیدی
  const formatId = (id: string) => `#ORD-${id.substring(0, 6).toUpperCase()}`

  // فیلتر کردن زنده سفارشات
  const filteredOrders = orders.filter(order => {
    const lowerQuery = searchQuery.toLowerCase()
    const matchesSearch = 
      order.id.toLowerCase().includes(lowerQuery) ||
      order.link?.toLowerCase().includes(lowerQuery) ||
      order.smm_services?.some((service) =>
        service.name.toLowerCase().includes(lowerQuery)
      )
      
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/30 pb-24 pt-10">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Navigation */}
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Package className="w-8 h-8 text-indigo-600" /> Operations Log
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Monitor and track all your active and historical network configurations.
              </p>
            </div>
            
            {/* Quick Stat Badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-slate-200/60 px-5 py-3 rounded-2xl shadow-sm">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Records</p>
                <p className="text-lg font-black text-slate-900 leading-none">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 mb-8">
          
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Service, or Link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing / In Progress</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">Order Details</th>
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">Target Link</th>
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">Amount</th>
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">Date / Time</th>
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Cost</th>
                  <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-indigo-600">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <span className="font-black text-sm uppercase tracking-widest animate-pulse">Decrypting Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      <td className="py-6 px-8">
                        <div className="flex flex-col gap-1">
                          <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-black text-[10px] rounded-md border border-indigo-100/50 w-fit tracking-wider">
                            {formatId(order.id)}
                          </span>
                          <span className="font-bold text-slate-800 text-sm mt-1 max-w-[250px] line-clamp-2 leading-relaxed">
                            {order.smm_services?.[0]?.name || 'Custom Infrastructure Service'}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-8">
                        <a 
                          href={order.link?.startsWith('http') ? order.link : `https://${order.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group/link max-w-[200px]"
                        >
                          <LinkIcon className="w-4 h-4 shrink-0 text-slate-400 group-hover/link:text-indigo-500" />
                          <span className="truncate">{order.link || 'N/A'}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      </td>

                      <td className="py-6 px-8">
                        <div className="font-extrabold text-slate-700 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                          x{order.quantity?.toLocaleString() || 1}
                        </div>
                      </td>

                      <td className="py-6 px-8">
                        <div className="font-medium text-slate-500 text-xs">
                          {formatDate(order.created_at)}
                        </div>
                      </td>

                      <td className="py-6 px-8 text-right">
                        <div className="font-black text-slate-900 text-base">
                          ${Number(order.total_cost).toFixed(3)}
                        </div>
                      </td>

                      <td className="py-6 px-8 text-center">
                        {order.status?.toLowerCase() === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </span>
                        )}
                        {(order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'in progress') && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-100 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing
                          </span>
                        )}
                        {order.status?.toLowerCase() === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-600 font-black text-[10px] uppercase tracking-widest border border-amber-100 shadow-sm">
                            <Clock className="w-4 h-4" /> Pending
                          </span>
                        )}
                        {order.status?.toLowerCase() === 'canceled' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm">
                            <XCircle className="w-4 h-4" /> Canceled
                          </span>
                        )}
                        {!['completed', 'processing', 'in progress', 'pending', 'canceled'].includes(order.status?.toLowerCase() || '') && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm">
                            {order.status || 'Unknown'}
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Package className="w-16 h-16 mb-5 text-slate-300" />
                        <span className="font-black text-xl text-slate-700">No records found</span>
                        <p className="text-sm font-medium mt-2 max-w-sm">
                          {searchQuery || statusFilter !== 'all' 
                            ? "Try adjusting your search or status filters." 
                            : "You haven't placed any orders yet. Start your first campaign to see the metrics here."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* استایل‌های اختصاصی برای اسکرول‌بار ظریف جدول */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}} />
    </div>
  )
}