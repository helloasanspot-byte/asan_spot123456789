'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { 
  TrendingUp, Heart, Users, Activity, 
  ChevronRight, CheckCircle2, Clock, Loader2,
  Settings, DollarSign, PackageCheck, Headset,
  Wallet
} from 'lucide-react'

// اینترفیس برای سفارشات دریافت شده از دیتابیس
interface DbOrder {
  id: string
  quantity: number
  total_cost: number
  status: string
  created_at: string
  smm_services?: { name: string } 
}

export default function LuxuryDashboardPage() {
  const [loading, setLoading] = useState(true)
  
  // استیت‌های ذخیره اطلاعات از دیتابیس (شامل آواتار)
  const [profile, setProfile] = useState({ firstName: 'User', balance: 0, totalSpent: 0, avatarUrl: '' })
  const [stats, setStats] = useState({ activeOrders: 0, completedOrders: 0, openTickets: 0 })
  const [recentOrders, setRecentOrders] = useState<DbOrder[]>([])

  // تابع اصلی برای دریافت تمام اطلاعات داشبورد
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // ۱. دریافت کاربر لاگین شده
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // ۲. دریافت پروفایل (نام، موجودی، مجموع خرید و عکس پروفایل)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, balance, total_spent, avatar_url')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || 'User',
          balance: profileData.balance || 0,
          totalSpent: profileData.total_spent || 0,
          avatarUrl: profileData.avatar_url || ''
        })
      }

      // ۳. دریافت تمام سفارشات کاربر برای محاسبه آمار و لیست اخیر
      const { data: ordersData } = await supabase
        .from('smm_orders')
        .select('id, quantity, total_cost, status, created_at, smm_services(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersData) {
        let active = 0
        let completed = 0
        
        // محاسبه سفارشات فعال و تکمیل شده
        ordersData.forEach((o: any) => {
          const stat = o.status?.toLowerCase()
          if (stat === 'completed') completed++
          else if (stat === 'pending' || stat === 'processing' || stat === 'in progress') active++
        })

        setStats(prev => ({ ...prev, activeOrders: active, completedOrders: completed }))
        setRecentOrders(
          ordersData.slice(0, 5).map((order: any) => ({
            ...order,
            smm_services: order.smm_services?.[0] ? { name: order.smm_services[0].name } : undefined
          }))
        ) // فقط ۵ سفارش اول برای جدول
      }

      // ۴. دریافت تعداد تیکت‌های باز
      const { count: ticketsCount } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'open')

      if (ticketsCount !== null) {
        setStats(prev => ({ ...prev, openTickets: ticketsCount }))
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // توابع کمکی
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const formatId = (id: string) => {
    return `#ORD-${id.substring(0, 6).toUpperCase()}`
  }

  // انتخاب عکس پروفایل (اگر در دیتابیس نبود، یک عکس شیک از روی اسم می‌سازد)
  const displayAvatar = profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.firstName}&background=0F172A&color=ffffff&bold=true&font-size=0.33`

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/30 pb-24">
      
      {/* --- Custom Animations & Styles --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          0% { transform: translateY(20px) scale(0.9); opacity: 0; }
          20% { transform: translateY(0px) scale(1); opacity: 1; }
          80% { transform: translateY(-40px) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.9); opacity: 0; }
        }
        .animate-float-1 { animation: float-up 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-up 4.5s ease-in-out infinite 1.5s; opacity: 0; }
        .animate-float-3 { animation: float-up 5s ease-in-out infinite 3s; opacity: 0; }
        .perspective-container { perspective: 1000px; }
        .isometric-phone { transform: rotateX(20deg) rotateY(-20deg) rotateZ(10deg); transform-style: preserve-3d; }
      `}} />

      {/* --- Main Dashboard Content --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* 0. Welcome & Balance Box (Luxury Redesign) */}
        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-10 mb-10 overflow-hidden shadow-[0_20px_50px_-15px_rgba(15,23,42,0.5)]">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* User Info */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 p-1 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={displayAvatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full border-4 border-slate-900 object-cover bg-white"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-4 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <p className="text-indigo-300 font-bold text-sm tracking-widest uppercase mb-1">Welcome Back</p>
                <h2 className="text-3xl md:text-4xl font-black text-white">{profile.firstName}!</h2>
              </div>
            </div>
            
            {/* Balance & Actions */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl">
              <div className="pr-0 sm:pr-6 sm:border-r border-white/10 text-center sm:text-left">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Current Balance</p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                  <span className="text-3xl font-black text-white">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : `$${profile.balance.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link href="/dashboard/settings" className="flex-1 sm:flex-none flex items-center justify-center p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors">
                  <Settings className="w-5 h-5" />
                </Link>
                <Link href="/dashboard/add-funds" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-500 text-white font-extrabold px-6 py-4 rounded-2xl hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all">
                  Add Funds
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* 1. Real-time Database Stats (Luxury Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Stat 1: Total Spent */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Spent</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 mt-2" /> : `$${profile.totalSpent.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>

          {/* Stat 2: Active Orders */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/50">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Active Orders</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 mt-2" /> : stats.activeOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Stat 3: Completed Orders */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Completed</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 mt-2" /> : stats.completedOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Stat 4: Open Tickets */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100/50">
                <Headset className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Open Tickets</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 mt-2" /> : stats.openTickets}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 2. Interactive 3D Hero Banner */}
        <div className="relative w-full h-[320px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] overflow-hidden mb-12 flex items-center perspective-container">
          
          {/* Background Glows */}
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-50%] right-[10%] w-[400px] h-[400px] bg-blue-400/30 blur-[100px] rounded-full" />

          {/* Banner Text (Left) */}
          <div className="relative z-10 w-full md:w-1/2 p-10 md:p-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-[10px] uppercase tracking-widest font-black mb-6 backdrop-blur-sm">
              <Activity className="w-3.5 h-3.5" /> High Speed Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-md">
              Ignite Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Social Growth</span>
            </h1>
            <Link href="/dashboard/new-order" className="inline-flex items-center gap-2 mt-2 bg-white text-indigo-900 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-lg">
              Place New Order <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* 3D Phone & Floating Elements (Right) */}
          <div className="hidden md:flex relative z-10 w-1/2 h-full items-center justify-center">
            
            <div className="isometric-phone relative w-48 h-96 bg-white/10 backdrop-blur-xl border border-white/30 rounded-[3rem] shadow-[20px_20px_50px_rgba(0,0,0,0.3),inset_5px_5px_15px_rgba(255,255,255,0.4)] flex flex-col p-3">
              <div className="w-full h-full bg-slate-900/90 rounded-[2.2rem] border border-white/10 overflow-hidden relative shadow-inner">
                <div className="h-32 bg-gradient-to-b from-indigo-500/40 to-transparent p-4 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 mb-2" />
                  <div className="w-20 h-3 bg-white/20 rounded-full mb-1" />
                  <div className="w-12 h-2 bg-white/10 rounded-full" />
                </div>
              </div>

              <div className="absolute -left-12 top-20 animate-float-1 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl"><Users className="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">New Followers</p>
                  <p className="text-sm font-black text-slate-900">+10,500</p>
                </div>
              </div>

              <div className="absolute -right-16 top-40 animate-float-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-3">
                <div className="bg-rose-100 p-2 rounded-xl"><Heart className="w-4 h-4 text-rose-500" /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Post Likes</p>
                  <p className="text-sm font-black text-slate-900">+5,240</p>
                </div>
              </div>

              <div className="absolute -left-8 top-64 animate-float-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl"><TrendingUp className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Views</p>
                  <p className="text-sm font-black text-slate-900">+50.2K</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. Recent Orders Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Recent Orders</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Track and manage your active social media boosts.</p>
            </div>
            <Link href="/dashboard/orders" className="text-indigo-600 font-bold hover:underline text-sm flex items-center gap-1 bg-indigo-50 px-5 py-2.5 rounded-xl transition-colors hover:bg-indigo-100">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Order ID</th>
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Service Details</th>
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Amount</th>
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Date / Time</th>
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Cost</th>
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                          <span className="font-bold text-sm tracking-widest uppercase">Syncing Node Data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-6 font-black text-indigo-600 text-sm">{formatId(order.id)}</td>
                        <td className="p-6 font-bold text-slate-800 text-sm max-w-xs truncate">
                          {order.smm_services?.name || 'Custom Infrastructure Service'}
                        </td>
                        <td className="p-6 font-extrabold text-slate-600">x{order.quantity.toLocaleString()}</td>
                        <td className="p-6 font-medium text-slate-400 text-xs">{formatDate(order.created_at)}</td>
                        <td className="p-6 font-black text-slate-900 text-right">${Number(order.total_cost).toFixed(3)}</td>
                        <td className="p-6 text-center">
                          {order.status?.toLowerCase() === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          )}
                          {(order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'in progress') && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-100">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                            </span>
                          )}
                          {order.status?.toLowerCase() === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest border border-amber-100">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                          {!['completed', 'processing', 'in progress', 'pending'].includes(order.status?.toLowerCase() || '') && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-widest border border-slate-200">
                              {order.status || 'Unknown'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <PackageCheck className="w-12 h-12 mb-4 text-slate-300" />
                          <span className="font-black text-lg text-slate-700">No active orders</span>
                          <p className="text-sm font-medium mt-1">Deploy a new node to see metrics here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}