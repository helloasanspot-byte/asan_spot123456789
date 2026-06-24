'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Mail, Lock, User, UserPlus, 
  Calendar, Globe, Phone, Camera, UploadCloud,
  Eye, EyeOff, Rocket, ShieldCheck, Zap
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  
  // Form States
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // File Upload State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Status States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. بررسی الزامی بودن عکس پروفایل
    if (!avatarFile) {
      setError('Please upload a profile picture.')
      setLoading(false)
      return
    }

    // 2. بررسی تطابق رمز عبور
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      setLoading(false)
      return
    }

    try {
      // 3. ثبت‌نام کاربر در Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
            country: country,
            phone: phone,
          }
        }
      })

      if (signUpError) throw signUpError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none fixed" />

      {/* Main Container - Landscape Design */}
      <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] overflow-hidden">
        
        {/* Left Side: Welcome Panel (Glassmorphism & 3D Elements) */}
        <div className="lg:w-2/5 p-10 md:p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Orbs */}
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-blue-400/20 blur-2xl rounded-full pointer-events-none" />
          
          {/* === HUGE WHITE LOGO === */}
          <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.05] select-none hidden lg:block">
            <img src="/White%20logo.png" alt="Watermark" className="w-[800px] h-auto object-contain" />
          </div>

          <div className="relative z-10">
            {/* Logo Section */}
            <Link href="/" className="inline-block mb-12 md:mb-16 animate-fade-in-up">
              <img 
                src="/White%20logo.png" 
                alt="Asan Spot Logo" 
                className="w-48 md:w-56 h-auto drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
              />
            </Link>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Welcome to the <br /> <span className="text-indigo-200">Future of SMM</span>
            </h2>
            <p className="text-indigo-100/90 text-lg mb-10 font-medium leading-relaxed">
              Create your account to unlock powerful tools and take your social media presence to the next level.
            </p>

            {/* Feature List */}
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Rocket className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Instant Delivery</h4>
                  <p className="text-sm text-indigo-200/80">Automated processing in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Direct Crypto Pay</h4>
                  <p className="text-sm text-indigo-200/80">Seamless USDT transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <div className="bg-white/10 p-3 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h4 className="font-bold text-white">100% Secure</h4>
                  <p className="text-sm text-indigo-200/80">No account passwords required</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 text-indigo-200/60 text-sm font-medium">
            © 2026 Asan Spot Dashboard
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:w-3/5 p-8 md:p-14 bg-white flex flex-col justify-center">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Please fill in the details below to get started. All fields are required.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Mail className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                We've sent a verification link to <span className="font-bold text-slate-700">{email}</span>. Please verify to continue.
              </p>
              <Link href="/user/login" className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-100 transition-colors">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-6">
              
              {/* Profile Picture Upload (Required) */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative group cursor-pointer">
                  <div className={`w-28 h-28 rounded-full border-4 border-slate-50 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.2)] flex items-center justify-center overflow-hidden bg-slate-100 transition-all duration-300 ${!avatarPreview ? 'group-hover:bg-indigo-50 border-dashed border-slate-300 group-hover:border-indigo-300' : ''}`}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <UploadCloud className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-bold">Required *</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Upload Avatar <span className="text-red-500">*</span></span>
              </div>

              {/* Form Grid for Landscape layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    >
                      <option value="" disabled>Select Country</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="FR">France</option>
                      <option value="AE">UAE</option>
                      <option value="AF">Afghanistan</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {/* Email (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                {/* Password with Show/Hide */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with Show/Hide */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-3/4 mx-auto group mt-8 flex items-center justify-center gap-2 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner text-lg border-b-4 border-indigo-800 disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create Account'} 
                {!loading && <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link href="/user/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline underline-offset-2 transition-all">
                Sign in to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}