'use client'

import { useState } from 'react'
import { 
  Mail, MapPin, Send, Loader2, CheckCircle2, 
  MessageCircle, Camera, Globe, ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // شماره و لینک‌های شبکه‌های اجتماعی به‌روزرسانی شد
  const SOCIAL_LINKS = {
    whatsapp: "https://wa.me/17575055153", // لینک مستقیم به واتساپ
    instagram: "https://www.instagram.com/asan_spot?utm_source=qr",
    facebook: "https://www.facebook.com/share/1CzPunwAvr/?mibextid=wwXIfr"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSuccess(false), 5000) // بعد از 5 ثانیه پیام موفقیت پاک شود
      } else {
        setError(data.error || 'Failed to send message.')
      }
    } catch (err) {
      setError('A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F6FF] py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Glows (Blue Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-400/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هدر صفحه */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-4 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Have questions about our social media nodes? Need help with an order? Our support team is available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* ============================================== */}
          {/* ستون چپ: اطلاعات تماس و شبکه‌های اجتماعی */}
          {/* ============================================== */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[40px] rounded-full" />
              
              <div className="relative z-10 flex-1">
                <h2 className="text-2xl font-black mb-2">Contact Information</h2>
                <p className="text-blue-200 text-sm font-medium mb-10 leading-relaxed">
                  Fill out the form or contact us directly through our official channels. We typically reply within minutes.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                      <Mail className="w-5 h-5 text-blue-100" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Email Support</p>
                      <p className="text-lg font-bold text-white">hello.asanspot@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                      <MapPin className="w-5 h-5 text-blue-100" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Global Office</p>
                      <p className="text-lg font-bold text-white">London, United Kingdom</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* شبکه‌های اجتماعی */}
              <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-4">Connect on Socials</p>
                <div className="flex gap-4">
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                    <MessageCircle className="w-6 h-6" />
                  </a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                    <Camera className="w-6 h-6" />
                  </a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                    <Globe className="w-6 h-6" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================== */}
          {/* ستون راست: فرم تماس با ما */}
          {/* ============================================== */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.05)] border border-blue-50/50">
            
            <h2 className="text-2xl font-black text-slate-900 mb-6">Send us a Message</h2>
            
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up py-10">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 font-medium max-w-sm">
                  Thank you for reaching out. Our support team will get back to you via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-[#F0F6FF]/50 border border-blue-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-[#F0F6FF]/50 border border-blue-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full bg-[#F0F6FF]/50 border border-blue-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full bg-[#F0F6FF]/50 border border-blue-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none custom-scrollbar"
                  />
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-600 text-sm font-bold p-4 rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] active:translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </div>

      {/* استایل اسکرول‌بار ظریف برای کادر متن */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #93C5FD; }
      `}} />
    </div>
  )
}